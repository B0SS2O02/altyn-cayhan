const restaurant = document.querySelector("#restaurantId");
const prodCategory = document.querySelector("#prodCategoryId");

prodCategory.disabled = !edit;
let prodCategoryOld = prodCategory.querySelectorAll("option");

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
