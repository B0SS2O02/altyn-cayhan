// ----------------------------- GET FORMS ----------------------------//

// let url = {
//   shop_category: "http://216.250.12.159:3000/shop",
// };
// document.querySelector("#shop").click();

// function getShopCategory(shopId) {
//   console.log(`${url.shop_category}/${shopId}/shop-category`);
//   fetch(`${url.shop_category}/${shopId}/shop-category`, {
//     method: "GET",
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((res) => {
//       console.log(res);
//       const shopCategoryContainer = document.getElementById("shop-category");
//       let newCategory;

//       for (let i = 0; i < res.length; i++) {
//         newCategory += ` 
//         <div  class="flex justify-between items-center    border border-[#445FD3] text-[#445FD3] hover:bg-[#445FD3] hover:text-white rounded px-3 py-1 cursor-pointer select-none active:bg-[#445FD3] active:text-white">
//         <p class="m-0 p-0">${res[i].title}</p>
//         <div class="flex ml-[20px] gap-1">
//             <div class="z-1  rounded-md hover:bg-green-500  ">
//                 <a class="" href="/admin/shop/add-category/${res[i].id}">E</a>
//             </div>
//             <div    
//                 onclick="openModal('http://216.250.12.159:3000/shop-category/',${res[i].id},'Delete News',2,this.parentNode,2)"
//                 class="z-1  rounded-md  hover:bg-red-500 hover:text-red">
//                 D         
//             </div>
//         </div>
//       </div>`;
//       }
//       shopCategoryContainer.innerHTML = newCategory;
//     })
//     .catch((err) => {
//       alert(err.message);
//     });
// }
