
const insectDataList = [
    {
        id: "#INS-0042",
        name: "Green Peach Aphid",
        scientific: "Myzus persicae",
        plants: ["Tomatoes", "Peppers"],
        damage: "Yellowing leaves, sap depletion, virus vector",
        status: "Warning",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8VVlS7kTqaWZXXJ1w-AcR6ZJ6bQtlI_VJnXGCSvPid3lF_gMjnWvGeWlAWE2xcYHGKpFRsRIyspYc_jC6TLM6Gx0h6mawLhL06OEQvNGo2kOsz37ILAXJ5ZdEVxSCqecQ4_k5xy9hbGhCrz6I3iBaq6YkSkkPICJQJB-qIWxyDz5G2PdFUPEAfRUJ9h0AzCAF_v2ZQYZ_nJ8yyd7vC_PhluLrpadF9FVu4BQ-7pqK5Kf7pz_uAdBVwgIoTk0c19JPBqe7etd99rA"
    },
    {
        id: "#INS-0089",
        name: "Potato Beetle",
        scientific: "Leptinotarsa decemlineata",
        plants: ["Potatoes", "Eggplant"],
        damage: "Severe defoliation, plant death in heavy infestations",
        status: "Harmful",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkTG47B0_Os5kK2LoSAeJMjxJokm66IslGTtEkcSY31pM5ejkMW-igo0FzTyz4fuBLNJP2UUGzzINaUERqzx7_hS28pjIWq2n47LGSv-JGkcfbrc5_ywC0vR0O4dGRqofJ25OcecdLFdzgCr4jf9TkkYbGuu452MraYuatWu4WliIdbqXbyMUfbzqCRxQToKKIE5KUroeKr_ih4tNoC91y9Ienu0FOvy6LA0urWil8IzPEgN6jjkF8DgCQdq92gIZ2LFCw2ZepCLU"
    },
    {
        id: "#INS-0112",
        name: "Common Honey Bee",
        scientific: "Apis mellifera",
        plants: ["All Flowering"],
        damage: "None (Beneficial Pollinator)",
        status: "Controlled",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnQlG6ocLLqv1sz7B_sG0zQN0JfpiAk9cRMidxbyKDH4tGgpcnwPk_okRpDn61RII0htvybR6-Jju__n00oKOdOwRJ09sf3V0Kq3p_wnVgx6oDl2YK7ouhgSNHLOD5RI9LYDCven1eYe0gup7O8yOd2nHl_TNHunPT-bj5plVdoc9TQakZZKSRpiyYwDtH1pJbsMLwSuhjwrpMsoqTwyWjaC9ZeO-xpYkTaYaT8wiUdIN324ifD4p8AUVS_hc3c7JGjgoD0LlyeWk"
    },
    {
        id: "#INS-0155",
        name: "Migratory Locust",
        scientific: "Locusta migratoria",
        plants: ["Grains", "Maize"],
        damage: "Massive crop consumption, swarming damage",
        status: "Harmful",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpBJgzREQIRLPdLS-Rubd9kYWFuLeaar27Kv7OTqDeTFnXzcRyVIEAniD-ewrIavhDmoeWMEiKL8_KUudL-IjbL8es0CfPaPqmtH4p7NpYBEgze5TK25cmOUSNxSzs5XH3AaDkGXf9pfMTskmmNnU-K_LEsM3KGXfSzA3avlz0g77rslFDjpmm6IbSG_fo-jeuQV30VCW7inlX-VFyPIXAQg9dtPNAMGMyv4fpQs0CDytSdUarbxrfrMa-mDVgTzhvhNlaSVqvj40"
    }
];


function displayInsects(data) {
    const tableContainer = document.getElementById('tableBody');
    const counterDisplay = document.getElementById('entryCount');

    if (!tableContainer) return;

    tableContainer.innerHTML = '';
    data.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color: #94a3b8; font-family: monospace;">${item.id}</td>
            <td>
                <div class="insect-cell">
                    <img src="${item.img}" class="insect-img" alt="${item.name}">
                    <span style="font-weight: 600; color: #002d1c;">${item.name}</span>
                </div>
            </td>
            <td class="scientific-name">${item.scientific}</td>
            <td>${item.plants.map(p => `<span class="tag">${p}</span>`).join('')}</td>
            <td style="max-width: 250px;">${item.damage}</td>
            <td>
                <span class="status-badge status-${item.status.toLowerCase()}">
                    <span class="dot"></span> ${item.status}
                </span>
            </td>
            <td class="text-right">
                <div class="action-menu" onclick="handleDropdown(event, ${idx})">
                    <span class="material-symbols-outlined">more_vert</span>
                    <div class="dropdown" id="dropdown-${idx}">
                        <button onclick="editEntry('${item.id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteEntry(${idx})">Delete</button>
                    </div>
                </div>
            </td>
        `;
        tableContainer.appendChild(tr);
    });

    if (counterDisplay) {
        counterDisplay.innerText = `Showing ${data.length} of ${data.length} entries`;
    }
}


function handleDropdown(event, index) {
    event.stopPropagation();
    const allMenus = document.querySelectorAll('.dropdown');
    const targetMenu = document.getElementById(`dropdown-${index}`);

    allMenus.forEach(m => {
        if (m !== targetMenu) m.style.display = 'none';
    });

    if (targetMenu) {
        const isShown = targetMenu.style.display === 'block';
        targetMenu.style.display = isShown ? 'none' : 'block';
    }
}


window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(m => m.style.display = 'none');
});


window.deleteEntry = function(index) {
    if (confirm('Are you sure you want to delete this?')) {
        insectDataList.splice(index, 1);
        displayInsects(insectDataList);
    }
};

window.editEntry = function(id) {
    alert('Editing insect ID: ' + id);
};

window.handleDropdown = function(event, index) {
    event.stopPropagation();
    const allMenus = document.querySelectorAll('.dropdown');
    const targetMenu = document.getElementById(`dropdown-${index}`);

    allMenus.forEach(m => {
        if (m !== targetMenu) m.style.display = 'none';
    });

    if (targetMenu) {
        const isShown = targetMenu.style.display === 'block';
        targetMenu.style.display = isShown ? 'none' : 'block';
    }
};


window.onclick = () => {
    document.querySelectorAll('.dropdown').forEach(m => m.style.display = 'none');
};


document.addEventListener('DOMContentLoaded', () => {
    displayInsects(insectDataList);


    fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
    });
});