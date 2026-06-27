// إعدادات الـ Pagination الافتراضية
const rowsPerPage = 5;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", function () {
    // تشغيل الـ Pagination أول ما الصفحة تحمل
    initPagination();

    // إغلاق الـ Dropdown لو المستخدم داس في أي مكان برة القائمة
    document.addEventListener("click", function (event) {
        if (!event.target.closest('.action-menu')) {
            closeAllDropdowns();
        }
    });
});

/* ==========================================================================
   1. التحكم في الـ Dropdown Actions (تعديل / حذف)
   ========================================================================== */
function toggleDropdown(event, id) {
    event.stopPropagation(); // منع الحدث إنه يوصل للـ document

    const targetDropdown = document.getElementById(id);
    const isAlreadyOpen = targetDropdown.style.display === "block";

    // قفل أي قائمة تانية مفتوحة الأول
    closeAllDropdowns();

    // لو مكانتش مفتوحة، افتحها
    if (!isAlreadyOpen) {
        targetDropdown.style.display = "block";
    }
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(dropdown => {
        dropdown.style.display = "none";
    });
}

/* ==========================================================================
   2. الفلترة والبحث الذكي (Client-side Search)
   ========================================================================== */
function filterDiseasesTable() {
    const input = document.getElementById("diseaseSearch");
    const filter = input.value.toLowerCase().trim();
    const table = document.getElementById("diseaseTable");
    const tr = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    // لو مفيش داتا خالص (الرسالة بتاعة No diseases found) متعملش حاجة
    if (tr.length === 1 && tr[0].cells.length === 1) return;

    let visibleCount = 0;

    for (let i = 0; i < tr.length; i++) {
        // البحث في اسم المرض (العمود الثاني) ونوع النبات (العمود الثالث) والـ ID (العمود الأول)
        const idCell = tr[i].getElementsByTagName("td")[0];
        const nameCell = tr[i].getElementsByTagName("td")[1];
        const plantCell = tr[i].getElementsByTagName("td")[2];

        if (nameCell && plantCell && idCell) {
            const idText = idCell.textContent || idCell.innerText;
            const nameText = nameCell.textContent || nameCell.innerText;
            const plantText = plantCell.textContent || plantCell.innerText;

            if (idText.toLowerCase().indexOf(filter) > -1 ||
                nameText.toLowerCase().indexOf(filter) > -1 ||
                plantText.toLowerCase().indexOf(filter) > -1) {

                // هنعلم عليها مؤقتاً إنها تطابق البحث
                tr[i].dataset.searchMatch = "true";
                visibleCount++;
            } else {
                tr[i].dataset.searchMatch = "false";
                tr[i].style.display = "none"; // إخفاء مباشر للي مش مطابق
            }
        }
    }

    // إعادة ضبط الصفحة الحالية لأول صفحة وتحديث الـ Pagination بناءً على نتائج البحث
    currentPage = 1;
    updateTableDisplay(true);
}

/* ==========================================================================
   3. الـ Pagination الديناميكي وعداد الصفوف
   ========================================================================== */
function initPagination() {
    // إعطاء كل الصفوف حالة "مطابق للبحث" في البداية
    const table = document.getElementById("diseaseTable");
    const tr = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    if (tr.length === 1 && tr[0].cells.length === 1) {
        document.getElementById("entryCount").innerText = "Showing 0 entries";
        return;
    }

    for (let i = 0; i < tr.length; i++) {
        tr[i].dataset.searchMatch = "true";
    }

    updateTableDisplay(false);
}

function updateTableDisplay(isSearching = false) {
    const table = document.getElementById("diseaseTable");
    const tr = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    const entryCountSpan = document.getElementById("entryCount");
    const paginationWrapper = document.getElementById("paginationWrapper");

    // ترشيح الصفوف المطابقة للبحث فقط
    const matchedRows = Array.from(tr).filter(row => row.dataset.searchMatch === "true");
    const totalEntries = matchedRows.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;

    // التأكد من أن الصفحة الحالية لا تتخطى إجمالي الصفحات بعد الفلترة
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;

    // إخفاء أو إظهار الصفوف بناءً على الصفحة الحالية
    Array.from(tr).forEach(row => row.style.display = "none"); // إخفاء الكل أولاً

    matchedRows.slice(startIdx, endIdx).forEach(row => {
        row.style.display = ""; // إظهار الصفوف الخاصة بالصفحة الحالية فقط
    });

    // تحديث نص العداد السفلي بشكل احترافي
    if (totalEntries === 0) {
        entryCountSpan.innerText = "Showing 0 to 0 of 0 entries";
    } else {
        const showingTo = Math.min(endIdx, totalEntries);
        entryCountSpan.innerText = `Showing ${startIdx + 1} to ${showingTo} of ${totalEntries} entries`;
    }

    // بناء أزرار الـ Pagination ديناميكياً
    buildPaginationControls(totalPages, isSearching);
}

function buildPaginationControls(totalPages, isSearching) {
    const paginationWrapper = document.getElementById("paginationWrapper");
    paginationWrapper.innerHTML = ""; // مسح الأزرار القديمة

    if (totalPages <= 1 && !isSearching) {
        // لو الداتا كلها في صفحة واحدة مش محتاجين أزرار تنقل
        return;
    }

    // زر السابق (Previous)
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updateTableDisplay();
        }
    };
    paginationWrapper.appendChild(prevBtn);

    // أزرار أرقام الصفحات
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.innerText = i;
        if (i === currentPage) {
            pageBtn.classList.add("active");
        }
        pageBtn.onclick = () => {
            currentPage = i;
            updateTableDisplay();
        };
        paginationWrapper.appendChild(pageBtn);
    }

    // زر التالي (Next)
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTableDisplay();
        }
    };
    paginationWrapper.appendChild(nextBtn);
}