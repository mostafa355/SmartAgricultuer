// متغيرات التحكم في الصفحات
let currentPage = 1;
const rowsPerPage = 10;

document.addEventListener("DOMContentLoaded", function () {
    initPagination();

    // إغلاق أي Dropdown مفتوح عند الضغط في أي مكان خارجي بالصفحة
    document.addEventListener("click", function (event) {
        if (!event.target.closest('.action-menu')) {
            closeAllDropdowns();
        }
    });
});

// دالة التحكم بفتح وإغلاق الـ Dropdown
function toggleDropdown(event, id) {
    event.stopPropagation(); // منع انتشار الحدث للـ document
    const targetDropdown = document.getElementById(id);

    if (targetDropdown) {
        const isCurrentlyOpen = targetDropdown.style.display === "block";
        closeAllDropdowns(); // إغلاق القوائم الأخرى أولاً لعدم التداخل

        if (!isCurrentlyOpen) {
            targetDropdown.style.display = "block";
        }
    }
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(d => {
        d.style.display = "none";
    });
}

function initPagination() {
    currentPage = 1;
    showPage(currentPage);
}

// ميثود عرض صفحة معينة وإخفاء الباقي
function showPage(page) {
    const table = document.getElementById("plantsTable");
    if (!table) return;

    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = Array.from(tbody.getElementsByTagName("tr"));

    // تخطي الحسبة إذا كان الجدول فارغاً ويحتوي رسالة "No plants found" فقط
    if (rows.length === 1 && rows[0].cells.length === 1) return;

    currentPage = page;
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach((row, index) => {
        if (index >= start && index < end) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

    updatePaginationControls(totalPages);

    const entryCount = document.getElementById("entryCount");
    if (entryCount) {
        const showingEnd = Math.min(end, totalRows);
        entryCount.innerText = `Showing ${totalRows === 0 ? 0 : start + 1} to ${showingEnd} of ${totalRows} entries`;
    }
}

// ميثود رسم وتحديث أزرار التنقل (الأرقام، التالي، السابق)
function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById("paginationWrapper");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { closeAllDropdowns(); showPage(currentPage - 1); };
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.innerText = i;
        if (i === currentPage) pageBtn.classList.add("active");
        pageBtn.onclick = () => { closeAllDropdowns(); showPage(i); };
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { closeAllDropdowns(); showPage(currentPage + 1); };
    paginationContainer.appendChild(nextBtn);
}

// === ميثود البحث الفوري المضافة والمطورة لنباتات ===
function filterTable() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    const filter = input.value.toLowerCase();
    const table = document.getElementById("plantsTable");
    if (!table) return;

    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = tbody.getElementsByTagName("tr");

    // تخطي الحسبة إذا كان الجدول فارغاً
    if (rows.length === 1 && rows[0].cells.length === 1) return;

    let hasFilter = filter.length > 0;

    if (!hasFilter) {
        // لو البحث فاضي نرجع للنظام العادي المقسم لصفحات ونقفل المنسدلات
        closeAllDropdowns();
        initPagination();
        return;
    }

    closeAllDropdowns(); // إغلاق القوائم المفتوحة فوراً أثناء البحث منعاً للتشوه البصري
    let visibleCount = 0;

    for (let i = 0; i < rows.length; i++) {
        // كود البحث بيبص على العمود الأول (ID)، العمود الثاني (اسم النبات)، والعمود الثالث (الاسم العلمي)
        const idCell = rows[i].cells[0].textContent || rows[i].cells[0].innerText;
        const nameCell = rows[i].cells[1].textContent || rows[i].cells[1].innerText;
        const scientificCell = rows[i].cells[2].textContent || rows[i].cells[2].innerText;

        if (idCell.toLowerCase().indexOf(filter) > -1 ||
            nameCell.toLowerCase().indexOf(filter) > -1 ||
            scientificCell.toLowerCase().indexOf(filter) > -1) {
            rows[i].style.display = "";
            visibleCount++;
        } else {
            rows[i].style.display = "none";
        }
    }

    // إخفاء أزرار الترقيم أثناء التصفية لعرض النتائج كاملة دفعة واحدة
    const paginationContainer = document.getElementById("paginationWrapper");
    if (paginationContainer) paginationContainer.innerHTML = "";

    const entryCount = document.getElementById("entryCount");
    if (entryCount) {
        entryCount.innerText = `Found ${visibleCount} matching entries`;
    }
}