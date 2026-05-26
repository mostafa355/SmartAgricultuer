
    function openEditPopup(){
      document.getElementById("editProfilePopup").style.display = "flex";
    }

    function closeEditPopup(){
      document.getElementById("editProfilePopup").style.display = "none";
    }

    function openPopup(){
      document.getElementById("passwordPopup").style.display = "flex";
    }

    function closePopup(){
      document.getElementById("passwordPopup").style.display = "none";
    }

    window.onclick = function(e){
      if(e.target.classList.contains("popup-overlay")){
        e.target.style.display = "none";
      }
    }