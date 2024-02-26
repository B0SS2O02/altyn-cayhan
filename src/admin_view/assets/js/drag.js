
function slist(target, apiTitle) {
  // (A) SET CSS + GET ALL LIST ITEMS
  let enterDragItems = [];
  target.classList.add("slist");
  let items = target.getElementsByTagName("tr"),
    current = null,
    dropped = null,
    cur = null;
  // (B) MAKE ITEMS DRAGGABLE + SORTABLE
  for (let i of items) {
    // (B1) ATTACH DRAGGABLE
    i.draggable = true;

    // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
    i.ondragstart = (e) => {
      current = i;
      private = i;
      for (let it of items) {
        if (it != current) {
          it.classList.add("hint");
        }
      }
    };

    // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
    i.ondragenter = (e) => {
      if (i != current) {
        i.classList.add("active");
      }
    };

    i.ondragleave = () => {
      i.classList.remove("active");
    };

    i.ondragend = () => {
      for (let it of items) {
        it.classList.remove("hint");
        it.classList.remove("active");
      }
    };

    i.ondragover = (e) => {
      e.preventDefault();

      if (i != current) {
        
        let currentpos = 0,
          droppedpos = 0;
        for (let it = 0; it < items.length; it++) {
          if (current == items[it]) {
            currentpos = it;
          }
          if (i == items[it]) {
            droppedpos = it;
          }
        }
        if (currentpos < droppedpos) {
          i.parentNode.insertBefore(current, i.nextSibling);
        } else {
          i.parentNode.insertBefore(current, i);
        }
        cur = Number(current.getAttribute("id"));
        dropped = Number(i.getAttribute("id"));
      }
    };

    // (B7) ON DROP - DO SOMETHING
    i.ondrop = async (e) => {
      e.preventDefault();
      if (cur != dropped) {
        loading.classList.remove("hidden");
        // let currentpos = 0,
        //   droppedpos = 0;
        // for (let it = 0; it < items.length; it++) {
        //   if (current == items[it]) {
        //     currentpos = it;
        //   }
        //   if (i == items[it]) {
        //     droppedpos = it;
        //   }
        // }
        // if (currentpos < droppedpos) {
        //   i.parentNode.insertBefore(current, i.nextSibling);
        // } else {
        //   i.parentNode.insertBefore(current, i);
        // }
        // let newElem = Number(i.getAttribute("id")),
        //   currentElem = Number(current.getAttribute("id")),
        let newElem = dropped,
          currentElem = cur,
          rangeA = Math.min(newElem, currentElem),
          rangeB = Math.max(newElem, currentElem);
        if (newElem !== currentElem) {
          try {
            await fetch(`/api/v1/${apiTitle}-drag`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                newElem,
                currentElem,
              }),
            });
            const elements = document
              .querySelector("tbody")
              .querySelectorAll("tr");
            for (let index = rangeA - 1; index < rangeB; index++) {
              const element = elements[index];
              element.setAttribute("id", index + 1);
            }
            loading.classList.add("hidden");

          } catch (err) {
            console.log(err);
          }
        }
      }
    };
  }
}
