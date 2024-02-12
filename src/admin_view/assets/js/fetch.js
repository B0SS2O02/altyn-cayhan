let loading = document.getElementById("loading");
var ValidationParamsUser = ["login", "password", "fullName", "role"];
var ValidationParamsNotification = ["title", "desc"];
var ValidationParamsVideo = [
  "translations.tm.title",
  "translations.ru.title",
  "image",
  "video",
  "videoDuration",
];
var ValidationParamsGallery = [
  "image",
  "translations.tm.title",
  "translations.ru.title",
  "type",
];
var ValidationParamsFood = [
  "prodCategoryId",
  "translations.tm.description",
  "translations.ru.description",
  "image",
  "translations.tm.title",
  "translations.ru.title",
  "price",
  "popular",
  "discount",
];

var ValidationParamsCategory = [
  "translations.tm.title",
  "translations.ru.title",
  "image",
];

let url = {
  restaurant: "/api/v1/restaurant",
  video: "/api/v1/video",
  gallery: "/api/v1/gallery",
  user: "/api/v1/auth",
  notification: "/api/v1/send-notification",
  food: "/api/v1/product",
  category: "/api/v1/product/category",
  order: "/api/v1/order",
};

function cleanValidationInputs(params) {
  params.forEach((item) => {
    const ValidationTagByObjectKey = document.getElementById(
      `${item}Validation`
    );
    if (ValidationTagByObjectKey.textContent) {
      ValidationTagByObjectKey.textContent = "";
      ValidationTagByObjectKey.previousElementSibling.classList.remove(
        "border-[#ff000094]"
      );
    }
  });
}

function putValidationInputs(params) {
  Object.keys(params).forEach((item) => {
    if (params[item]) {
      const ValidationTagByObjectKey = document.getElementById(
        `${item}Validation`
      );
      ValidationTagByObjectKey.textContent = params[item];
      ValidationTagByObjectKey.previousElementSibling.classList.add(
        "border-[#ff000094]"
      );
    }
  });
}

function userValues() {
  return {
    login: document.getElementById("login").value,
    password: document.getElementById("password").value,
    fullName: document.getElementById("fullName").value,
    role: document.getElementById("role").value,
  };
}
function notificationValues() {
  return {
    title: document.getElementById("title").value,
    desc: document.getElementById("desc").value,
  };
}
function videoValues() {
  return {
    "translations.tm.title": document.getElementById("titleTm").value,
    "translations.ru.title": document.getElementById("titleRu").value,
    videoDuration: document.getElementById("videoDuration").value,
    image: document.getElementById("image").files[0],
    video: document.getElementById("video").files[0],
  };
}
function galleryValues() {
  return {
    "translations.tm.title": document.getElementById("titleTm").value,
    "translations.ru.title": document.getElementById("titleRu").value,
    image: document.getElementById("image").files[0],
    type: document.getElementById("type").value,
  };
}

function foodValues() {
  return {
    price: document.getElementById("price").value,
    popular: document.getElementById("popular").checked,
    image: document.getElementById("image").files[0],
    discount: document.getElementById("discount").value,
    prodCategoryId: parseInt(document.getElementById("prodCategoryId").value),
    "translations.tm.title": document.getElementById("titleTm").value,
    "translations.ru.title": document.getElementById("titleRu").value,
    "translations.tm.description":
      document.getElementById("descriptionTm").value,
    "translations.ru.description":
      document.getElementById("descriptionRu").value,
  };
}
function categoryValues() {
  return {
    image: document.getElementById("image").files[0],
    "translations.tm.title": document.getElementById("titleTm").value,
    "translations.ru.title": document.getElementById("titleRu").value,
  };
}

function redirectToFormKey(value) {
  let newValue = value;
  if (newValue.includes(".")) {
    newValue = newValue.replaceAll(".", "][");
    newValue = newValue.replace("]", "");
    newValue += "]";
  }
  return newValue;
}

function getAllInputsInTagsAndAppendFormData(cb, params) {
  const INPUTS = cb();
  const formData = new FormData();
  params.forEach((item) => {
    formData.append(redirectToFormKey(item), INPUTS[item]);
    // }
  });
  return formData;
}

function getAllInputsInTagsAndConvertJSON(cb, params) {
  const INPUTS = cb();
  return INPUTS;
}

// create shop category
function postCategory(e) {
  e.preventDefault();
  loading.classList.remove("hidden");

  cleanValidationInputs(ValidationParamsCategory);
  const formData = getAllInputsInTagsAndAppendFormData(
    categoryValues,
    ValidationParamsCategory
  );

  fetch(`${url.category}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("File too large")) {
        return alert("Image size should be less than 20Kb");
      }
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/category";
    });
}

// edit shop-category
function editCategory(e, id) {
  e.preventDefault();
  loading.classList.remove("hidden");

  cleanValidationInputs(ValidationParamsCategory);
  const formData = getAllInputsInTagsAndAppendFormData(
    categoryValues,
    ValidationParamsCategory
  );
  fetch(`${url.category}/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("File too large")) {
        return alert("Image size should be less than 20Kb");
      }
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/category";
    });
}

// edit restaurant
function editRestaurant(e, id) {
  e.preventDefault();
  loading.classList.remove("hidden");

  

  cleanValidationInputs(ValidationParamsCategory);
  const formData = getAllInputsInTagsAndAppendFormData(
    categoryValues,
    ValidationParamsCategory
  );
  fetch(`${url.restaurant}/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("File too large")) {
        return alert("Image size should be less than 20Kb");
      }
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/restaurant";
    });
}

// create shop category item
function postFood(e) {
  e.preventDefault();
  loading.classList.remove("hidden");
  cleanValidationInputs(ValidationParamsFood);

  const formData = getAllInputsInTagsAndAppendFormData(
    foodValues,
    ValidationParamsFood
  );
  fetch(`${url.food}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("File too large")) {
        return alert("Image size should be less than 20Kb");
      }
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/foods";
    });
}

// edit shop-category-item

function editFood(e, id) {
  e.preventDefault();

  loading.classList.remove("hidden");
  cleanValidationInputs(ValidationParamsFood);

  const formData = getAllInputsInTagsAndAppendFormData(
    foodValues,
    ValidationParamsFood
  );

  fetch(`${url.food}/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("File too large")) {
        return alert("Image size should be less than 20Kb");
      }
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/foods/";
    });
}

function putStatusFood(id, target) {
  const formData = new FormData();
  loading.classList.remove("hidden");
  formData.append(target.name, target.value);
  fetch(`${url.food}/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
    })
    .catch((err) => {
      alert("Yalnyshlyk yuze cykdy");
    });
  loading.classList.add("hidden");
}

function putStatusOrder(id, target, oldColor) {
  console.log("----");
  loading.classList.remove("hidden");
  fetch(`${url.order}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      status: target.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      let tr = target.parentNode.parentNode.parentNode;
      let color = target.value;
      const values = ["completed", "cancelled", "waiting"];
      values.map((item) => {
        tr.classList.remove(item);
      });
      if (color === "on the way") color = "waiting";
      tr.classList.add(color);
      loading.classList.add("hidden");
    })
    .catch((err) => {
      console.log(err);
      alert("Yalnyshlyk yuze cykdy");
    });
}

function strToDate(dtStr) {
  if (!dtStr) return null;
  let dateParts = dtStr.split("/");
  let timeParts = dateParts[2].split(" ")[1].split(":");
  dateParts[2] = dateParts[2].split(" ")[0];
  return (dateObject = new Date(
    +dateParts[2],
    dateParts[1] - 1,
    +dateParts[0],
    timeParts[0],
    timeParts[1],
    timeParts[2]
  ));
}

// create user
function postUser(e) {
  e.preventDefault();

  loading.classList.remove("hidden");
  cleanValidationInputs(ValidationParamsUser);
  const data = getAllInputsInTagsAndConvertJSON(
    userValues,
    ValidationParamsUser
  );
  fetch(`${url.user}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/users";
    });
}

function sendNotication(e) {
  e.preventDefault();
  loading.classList.remove("hidden");
  cleanValidationInputs(ValidationParamsNotification);
  const data = getAllInputsInTagsAndConvertJSON(
    notificationValues,
    ValidationParamsNotification
  );
  fetch(`${url.notification}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin";
    });
}

function editUserById(e, id) {
  e.preventDefault();

  loading.classList.remove("hidden");
  cleanValidationInputs(ValidationParamsUser);
  const data = getAllInputsInTagsAndConvertJSON(
    userValues,
    ValidationParamsUser
  );
  fetch(`${url.user}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/users";
    });
}

// create gallery
function postGallery(e) {
  e.preventDefault();
  loading.classList.remove("hidden");
  cleanValidationInputs(ValidationParamsGallery);
  const formData = getAllInputsInTagsAndAppendFormData(
    galleryValues,
    ValidationParamsGallery
  );
  fetch(`${url.gallery}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("File too large")) {
        return alert("Image size should be less than 20Kb");
      }
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/gallery";
    });
}

// edit gallery
function editGallery(e, id) {
  e.preventDefault();

  loading.classList.remove("hidden");
  cleanValidationInputs(ValidationParamsGallery);
  const formData = getAllInputsInTagsAndAppendFormData(
    galleryValues,
    ValidationParamsGallery
  );
  fetch(`${url.gallery}/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      loading.classList.add("hidden");
      if (response.message && response.message.includes("File too large")) {
        return alert("Image size should be less than 20Kb");
      }
      if (response.message && response.message.includes("Validation Failure")) {
        putValidationInputs(response.validationErrors);
      } else window.location.href = "/admin/gallery";
    });
}
