const hamburger = document.querySelector("#hamburger");
const menu = document.querySelector("#menu");
const body = document.querySelector("#body");
const closeButton = document.querySelector("#close");
// after click hamburger menu will open
hamburger.addEventListener("click", () => {
  closeButton.classList.remove("hidden");

  body.classList.remove("hidden");
  body.style =
    "background-color:#000000bf;width:100vw;height:100vh;position:absolute";
  document.body.style.overflow = "hidden";
  menu.classList.remove("hidden");
  menu.classList.add("absolute", "flex", "flex-col", "items-center");
  hamburger.classList.add("opacity-0");
});
// clicking window and menu will close
body.addEventListener("click", () => {
  hamburger.classList.remove("opacity-0");
  menu.classList.add("hidden");
  body.classList.add("hidden");
  menu.classList.remove("absolute", "flex", "flex-col", "items-center");
});
closeButton.addEventListener("click", () => {
  hamburger.classList.remove("opacity-0");
  closeButton.classList.add("hidden");
  menu.classList.add("hidden");
  body.classList.add("hidden");
  menu.classList.remove("absolute", "flex", "flex-col", "items-center");
});

function collapse() {
  const lists = document.getElementById("collapse_1");
  lists.classList.toggle("hidden");
}
const dropdown = document.querySelectorAll(["[data-dropdown-toggle=dropdown]"]);

dropdown.forEach((element) => {
  const dropdownItems = element.parentElement.querySelector("#dropdown");
  element.addEventListener("click", () => {
    dropdownItems.classList.toggle("hidden");
  });
});
// const dropdownItems = document.getElementById('dropdown')
// dropdown.addEventListener('click', () => {
//   dropdownItems.classList.toggle('hidden')
// })
function changeLang(value) {
  console.log("lang", value);
  fetch("http://localhost:3001/api/v1/set-cookie", {
    method: "PUT",
    body: JSON.stringify({
      lang: value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      // dropdownItems.classList.toggle("hidden");
      location.reload();
    })
    .catch((err) => {
      console.log(err);
      alert("Yalnyshlyk yuze cykdy");
    });
}

const locales = {
  tm: {
    Foods: "Naharlar",
    "Add Food": "Nahar Goşmak",
    Name: "Ady",
    Category: "Kategoriýa",
    Active: "Aktiw",
    Popular: "Popular",
    Discount: "Skidka",
    False: "Yalnyş",
    True: "Dogry",
    "Delete Food": "Nahary Pozmak",
    "Are you sure?": "Ynamyňyz Barmy?",
    Yes: "Howa",
    Orders: "Sargytlar",
    Address: "Adres",
    Name: "Ady",
    PhoneNumber: "Telefon nomeri",
    Price: "Bahasy",
    Date: "Senesi",
    Pay: "Toleg",
    DeliveryTime: "Eltip Beriş Wagty",
    Status: "Status",
    Order: "Sargyt",
    Image: "Surat",
    Video: "Wideo",
    "Add Category": "Kategoriýa Goşmak",
    Add: "Goşmak",
    "Add Video": "Wideo goşmak",
    Category: "Kategoriýa",
    Gallery: "Galeriýa",
    "Add Gallery": "Galeriýa goşmak",
    Login: "Içeri girmek",
    Password: "Kod",
    "Active User": "Ulanyjy aktiw",
    "Add User": "Ulanyjy goşmak",
    Role: "Roly",
    Users: "Ulanyjylar",
    Logout: "Çykmak",
    Dashboard: "Esasy",
    No: "Ýok",
    FullName: "Ady we Familýasy",
    "Total Price": "Jemi Bahasy",
    Pikir: "Pikir",
    "Categories are division of restaurant foods. Here you can manage them.":
      "Kategoriýalar restoran naharlarynyp bölünme toparydyr we ony dolandyryp bilersiňiz.",
    "Foods are main products of restaurant and each food has own categories.":
      "Naharlar restoranyň esasy harydy bolup her bir naharyň özüne degişli kategoriýasy bardyr.",
    "When it comes to ordering food, it's like stepping into a doorway that leads to a world of culinary delights. It's an experience that tantalizes your taste buds, stirs your senses, and satisfies both hunger and cravings.":
      "Iýmit sargyt etmek barada aýdylanda, aşpez lezzetleri dünýäsine alyp barýan gapydan giren ýaly. Bu, tagamyňyzy güýçlendirýän, duýgyňyzy güýçlendirýän we açlygy we islegleri kanagatlandyrýan tejribe.",
    "Delivery Charge": "Eltip bermek",
    "Total Foods": "Jemi Naharlar",
    "Total Orders": "Jemi Sargytlar",
    completed: "ugradyldy",
    cancelled: "ugradylmady",
    waiting: "garaşylýar",
    "on the way": "ýolda",
    "<- Back": "<- Yza",
    Notification: "Notification",
    DeliveryDate: "Eltip Beriş Wagty",
    Restaurant: "Restoranlar",
  },
  ru: {
    Foods: "Продукты питания",
    "Add Food": "Добавить еду",
    Name: "Имя",
    Category: "Категория",
    Active: "Активный",
    Popular: "Популярный",
    Discount: "Скидка",
    False: "Ложь",
    True: "Истинный",
    "Delete Food": "Удалить еду",
    "Are you sure?": "Bы Уверены?",
    Yes: "Да",
    Orders: "Заказы",
    Address: "Адрес",
    Name: "Имя",
    PhoneNumber: "Номер телефона",
    Price: "Цена",
    Date: "Дата",
    Pay: "Платить",
    DeliveryTime: "Срок поставки",
    Status: "Положение дел",
    Order: "Заказ",
    Image: "Изображение",
    Video: "Bидео",
    "Add Video": "Добавлять видео",
    "Add Category": "Добавить категорию",
    Gallery: "Галерея",
    "Add Gallery": "Добавить галерею",
    Login: "Авторизоваться",
    Password: "Пароль",
    "Active User": "Активный пользователь",
    Role: "Роль",
    No: "Нет",
    "Add User": "Добавить Пользователь",
    Users: "Пользователи",
    Logout: "Выйти",
    Dashboard: "Панель  ",
    Pikir: "Пикир",
    FullName: "Полное имя",
    "Total Price": "Итоговая цена",
    "Categories are division of restaurant foods. Here you can manage them.":
      "Категории - это разделение ресторанных блюд. Здесь вы можете управлять ими.",
    "Foods are main products of restaurant and each food has own categories.":
      "Блюда - это основная продукция ресторана, и каждая еда имеет свои категории.",
    "When it comes to ordering food, it's like stepping into a doorway that leads to a world of culinary delights. It's an experience that tantalizes your taste buds, stirs your senses, and satisfies both hunger and cravings.":
      "Когда дело доходит до заказа еды, это все равно, что войти в дверь, ведущую в мир кулинарных изысков. Это опыт, который дразнит ваши вкусовые рецепторы, возбуждает ваши чувства и утоляет голод и тягу.",
    "Delivery Charge": "Плата за доставку",
    "Total Foods": "Всего продуктов",
    "Total Orders": "Всего заказов",
    completed: "завершенный",
    cancelled: "отменен",
    waiting: "ожидающий",
    "on the way": "в пути",
    "<- Back": "<- назад",
    Notification: "Notification",
    DeliveryDate: "Dostawka",
    Restaurant: "Рестораны",
  },
};
const dataKeys = document.querySelectorAll("[data-key]");
const lang = document.querySelector("html").getAttribute("lang");
for (let index = 0; index < dataKeys.length; index++) {
  const element = dataKeys[index];
  element.textContent = locales[lang][element.getAttribute("data-key")];
}
