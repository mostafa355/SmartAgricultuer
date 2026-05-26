
let diseases = [
    { id: "DIS-001", name: "Late Blight", plant: "Tomatoes", symptoms: "Brown spots on leaves, water-soaked lesions.", status: "Dangerous", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVZ3ekjWcmWXi4-e72vmGprbPho3hRW17EtcbggNuo365CQ8u9GO2OWYT4QqcwnxA2x-uauOZ-Uv9H6CTVRV_tywYfT8SWV4TrHobtRukYAZ8jSHdJKP_-9znub5EyIskERYVpftrpqtV0ZKAOiQgAwSV5n0nqkYlsXGDTL2hzx_lE0fm6aciS8Sc7JwTkMNAkwI1z1etM1WOVbODvrM9ZKN6EMxOed5C3OOBpx5zAU5q8k6hQjh4aIqqdRCzAljMd3bKRyDbdftw" },
    { id: "DIS-002", name: "Leaf Rust", plant: "Wheat", symptoms: "Orange-brown spores, yellowish streaks.", status: "Healthy", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuABSkUcFnn8fXPPygZ6tUZSShX7uGs7YYZHf2FUvQpThwxLTHriz9Ce34X58DRo3MPPSKc0BL3csLt1SRrtsx2xGmIa4Hii00dYPKJejcZseehsyXgaUBHCf7p2M0cftgkuhjN-jAjVK_6c2MNzkfwRZS6BSV43Ut0mQhUBoqALdiXPamcwXIIxLHJ5Ps8ammFgF11lU-WwDTbZ-bboWYHwRNda7T_ve8Ha3FA8pfmV72l6ylkxIv23nApqR6wtuJezaID4RpG6WUA" },
    { id: "DIS-003", name: "Powdery Mildew", plant: "Zucchini", symptoms: "White powdery coating, distorted growth.", status: "Medium Risk", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDImHQ25rWalSNupsmfk5yd-TOpvK7j98rKEfoS3OVtiy2dixPvoMtv1-7wswMpw7CpMiQx-c1Tg_3zU8debsGu11DqguI3gkPSQygP3NAavPtbyulrhxyEa2j_UxFxHnV8Mcj6ThfTpf9H75Sp-V38w-CcpGIE7ZAMNeaJP0W1RI3agVyy-6YsqVs_WL9v136QpbPM2TygjZSEjicDmjmO-LBVe-Kxe17wFtHBUmwqRXNVGX3WJxoj1BzdFo9S1ytammm-4-vCXnc" },
    { id: "DIS-004", name: "Downy Mildew", plant: "Grapes", symptoms: "Angular yellow lesions, gray fuzz on underside.", status: "Dangerous", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2L1FuPdB-ZnkkwERkvut3AOYXL4qPKevNuf-I2YaCNi_rgNe5Kd2XeK2R698ikmyiVWs9HgFO59dRoYcPIrW6ZEm6X-RrpsjDKZI5jzpWLjeroEOZDXpxMZ_YzN0MWWsNxpIDoxuasEK_Q6cYhNfS5oT4dukbCEek6Etyu3CdWylMy_KMraiF8OY6GUmhO6MzeTaIMuxNVpkJ_UFDn0lu3TSrPikw-pZobi89r-uREMz7nkr743Z5idFlAAAxwrHKnGoMuB88Ols" },
    { id: "DIS-005", name: "Black Rot", plant: "Apples", symptoms: "Black circular lesions, fruit shriveling.", status: "Healthy", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrWYatGFVeoLjuEKFRgdRnz73AyIl3q7eX1Oy22QOmsY7BzClSSkczRq-s7fqgMeIKXum-85zFD3IZ__IRLbw4qfV7OLCNYzYMHP2f94kVWoJoKdrk5jYw5gaEf3Aa89nE3U_lYXJ19wIqVVuhL-oatBh9M-7rhEmS890DL1mw619qLeGrqQJqQ1TNbrpBLTx70jDsfSdA0dPKP4kIeyez3KuFD82QIzBp7xnpbWumA_AwckqvS_51O0Zz9y0ox6OSLPLC4--gGgw" }
];

const tableBody = document.querySelector("#diseaseTable tbody");
const rowCountText = document.getElementById("rowCountText");


function renderTable(data) {
    if (!tableBody) return;
    tableBody.innerHTML = "";
    data.forEach((item, index) => {
        const statusClass = item.status === 'Dangerous' ? 'status-dangerous' : (item.status === 'Healthy' ? 'status-healthy' : 'status-medium');
        
        const row = `
            <tr>
                <td style="font-family: monospace;">#${item.id}</td>
                <td>
                    <div class="disease-info">
                        <img src="${item.img}" class="disease-img">
                        ${item.name}
                    </div>
                </td>
                <td>${item.plant}</td>
                <td title="${item.symptoms}">${item.symptoms.substring(0, 30)}...</td>
                <td><span class="status-pill ${statusClass}">${item.status}</span></td>
                <td class="actions-cell">
                    <button class="btn-icon" onclick="toggleMenu(${index})">
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                    <div id="menu-${index}" class="dropdown-menu" style="display:none; position:absolute; right:0; background:white; border:1px solid #ddd; z-index:10; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                        <button onclick="editItem('${item.id}')" style="display:block; width:100%; padding:10px; border:none; background:none; cursor:pointer; text-align:left;">Edit</button>
                        <button onclick="deleteItem('${item.id}')" style="display:block; width:100%; padding:10px; border:none; background:none; cursor:pointer; text-align:left; color:red;">Delete</button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    if (rowCountText) {
        rowCountText.innerText = `Showing ${data.length} of ${diseases.length} diseases`;
    }
}


function deleteItem(id) {
    if(confirm("Are you sure you want to delete this record?")) {
        diseases = diseases.filter(d => d.id !== id);
        renderTable(diseases);
    }
}


function editItem(id) {
    alert("Edit mode for ID: " + id);
}


function toggleMenu(index) {
    const menu = document.getElementById(`menu-${index}`);
    menu.style.display = menu.style.display === "none" ? "block" : "none";
}


renderTable(diseases);


document.addEventListener('DOMContentLoaded', () => {
    
   
    const addBtn = document.getElementById("addDiseaseBtn");
    if(addBtn) {
        addBtn.addEventListener("click", () => {
            window.location.href = "adddisease.html";
        });
    }

    
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        fetch('navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            navbarPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));
    }
});