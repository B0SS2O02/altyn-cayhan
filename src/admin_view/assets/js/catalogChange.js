const restaurant = document.querySelector("#restaurantId");
const prodCategory = document.querySelector("#prodCategoryId");

prodCategory.disabled = !edit;
let prodCategoryOld = prodCategory.querySelectorAll("option");

if (edit) {
  let temp = [];
  prodCategory.querySelectorAll("option").forEach((option) => {
    if (option.value == prodCategory.value) {
      prodCategory.querySelectorAll("option").forEach((prod) => {
        if (prod.className == option.classList) {
          temp.push(prod);
        }
      });
    }
  });
  prodCategory.innerHTML = "";
  temp.forEach((t) => {
    prodCategory.appendChild(t);
  });
}

restaurant.onchange = (e) => {
  let categories = [];
  prodCategoryOld.forEach((option) => {
    console.log(e.target.value);
    if (option.className.split("-").pop() == e.target.value) {
      categories.push(option);
    }
  });
  prodCategory.disabled = false;
  console.log(categories);
  prodCategory.innerHTML = "";
  categories.forEach((cat) => {
    prodCategory.appendChild(cat);
  });
};
