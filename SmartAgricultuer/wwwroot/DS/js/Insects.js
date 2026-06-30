let currentPage = 1;
const rowsPerPage = 10;

document.addEventListener("DOMContentLoaded", function () {
    initPagination();

    document.addEventListener("click", function (event) {
        if (!event.target.closest('.action-menu')) {
            closeAllDropdowns();
        }
    });
});

function initPagination() {
    currentPage = 1;
    showPage(currentPage);
}

function showPage(page) {
    const table = document.getElementById("insectsTable");
    if (!table) return;

    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = Array.from(tbody.children);

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

function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById("paginationWrapper");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        closeAllDropdowns();
        showPage(currentPage - 1);
    };
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.innerText = i;
        if (i === currentPage) {
            pageBtn.classList.add("active");
        }
        pageBtn.onclick = () => {
            closeAllDropdowns();
            showPage(i);
        };
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        closeAllDropdowns();
        showPage(currentPage + 1);
    };
    paginationContainer.appendChild(nextBtn);
}

function toggleDropdown(event, id) {
    event.stopPropagation();
    const targetDropdown = document.getElementById(id);

    if (targetDropdown) {
        const isCurrentlyOpen = targetDropdown.style.display === "block";
        closeAllDropdowns();

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

function filterInsectsTable() {
    const input = document.getElementById("insectSearch");
    if (!input) return;

    const filter = input.value.toLowerCase();
    const table = document.getElementById("insectsTable");
    if (!table) return;

    const tbody = table.getElementsByTagName("tbody")[0];
    const rows = tbody.children;

    if (rows.length === 1 && rows[0].cells.length === 1) return;

    let hasFilter = filter.length > 0;

    if (!hasFilter) {
        closeAllDropdowns();
        initPagination();
        return;
    }

    closeAllDropdowns();
    let visibleCount = 0;

    for (let i = 0; i < rows.length; i++) {
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

    const paginationContainer = document.getElementById("paginationWrapper");
    if (paginationContainer) paginationContainer.innerHTML = "";

    const entryCount = document.getElementById("entryCount");
    if (entryCount) {
        entryCount.innerText = `Found ${visibleCount} matching entries`;
    }
}
function editInsect(id) {
    window.location.href = `/Admin/AdminPanel/Edit_Insect/${id}`;
}

function deleteInsect(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#006d3d',
        cancelButtonColor: '#dc2626',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `/Admin/AdminPanel/Delete_Insect/${id}`;
        }
    });
}