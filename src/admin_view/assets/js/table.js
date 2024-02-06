
    // table configuration start
    function FilterFunction() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("search");
        filter = input.value.toUpperCase();
        table = document.getElementById("table");
        tr = document.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }
      // table configuration finish
  
      // conf active inactive
      const bool = document.querySelectorAll("[id=bool]");
      for (i = 0; i < bool.length; i++) {
        if (bool[i].textContent.toUpperCase().trim() === "YES") {
          -bool[i].classList.add("text-[#445FD3]");
        } else {
          bool[i].classList.add("text-[red]");
        }
      }
      
      // conf active finish