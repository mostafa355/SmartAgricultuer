
  function filterTable() {

    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {

      const cells = row.getElementsByTagName("td");

      const plantName = cells[1].innerText.toLowerCase();
      const scientific = cells[2].innerText.toLowerCase();
      const diseases = cells[4].innerText.toLowerCase();

      if (
        plantName.includes(filter) ||
        scientific.includes(filter) ||
        diseases.includes(filter)
      ) {

        row.style.display = "";

      } else {

        row.style.display = "none";

      }

    });

  }



  function toggleMenu(button) {

    const currentMenu = button.nextElementSibling;

    document.querySelectorAll(".dropdown-menu").forEach(menu => {

      if (menu !== currentMenu) {
        menu.classList.remove("show");
      }

    });

    currentMenu.classList.toggle("show");

  }

  window.addEventListener("click", function(e) {

    if (!e.target.closest(".dropdown")) {

      document.querySelectorAll(".dropdown-menu").forEach(menu => {
        menu.classList.remove("show");
      });

    }

  });