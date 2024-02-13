const staticStatusOrder = ["completed", "cancelled", "on the way", "waiting"];
// const timeOfDay = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']
const paymentStatus = {
  pending: "garasylyar",
  failure: "yatyryldy",
  success: "pul tolendi",
};
function format(date) {
  var today = new Date(date);
  var day = today.getDate() + "";
  var month = today.getMonth() + 1 + "";
  var year = today.getFullYear() + "";
  var hour = today.getHours() + "";
  var minutes = today.getMinutes() + "";
  var seconds = today.getSeconds() + "";

  day = checkZero(day);
  month = checkZero(month);
  year = checkZero(year);
  let hours = "";
  hour = checkZero(hour);
  minutes = checkZero(minutes);
  seconds = checkZero(seconds);
  hours = hour + ":" + minutes + ":" + seconds;
  return day + "." + month + "." + year + " " + hours;
  function checkZero(data) {
    if (data.length == 1) {
      data = "0" + data;
    }
    return data;
  }
}

function connect() {
  var ws = new WebSocket("ws://localhost:3002");
  ws.onmessage = async function (event) {
    console.log("messagemessage.........");
    const sound = document.getElementById("sound");
    if (sound) sound.click();
    let item = JSON.parse(event.data);
    console.log(item, "----");
    if (window.location.pathname === "/admin/orders") {
      if (item.event == "order") {
        item = item.data;
        let tbody = document.getElementsByTagName("tbody")[0],
          text = `
        <tr class="border-2 border-[#DBDFEA] border-solid ${
          item.status === "completed"
            ? "completed"
            : item.status === "cancelled"
            ? "cancelled"
            : "waiting"
        }">
            <td class="p-3 border-t-2" id="table_number">
                1
            </td>
            <td class="p-3 border-t-2">
                ${item.fullName}
            </td>
            <td class="p-3 border-t-2">
                ${item.address}
            </td>
            <td class="p-3 border-t-2">
                ${item.phoneNumber}
            </td>
            <td class="p-3 border-t-2">
                ${item.totalPrice}
            </td>
            <td id="getTimeToDate" class="p-3 border-t-2">
                ${format(item.createdAt.trim())}
            </td>
            <td class="p-3 border-t-2">
            <span id="getTimeToDateOnlyDays">
                ${item.deliveryTime}
            </span>
            </td>
            <td class="p-3 border-t-2" data-orderid="${item.id}">
                ${item.paymentMethod}
                ${
                  item.paymentMethod == "card"
                    ? `
                    <span class="bg-white">
                        ${paymentStatus[item.payments.status]}
                    </span>  
                `
                    : ""
                }
            </td>
    
            <td class="py-3 border-t-2">
                <div>
                    <select name="status"
                        onchange="putStatusOrder(${item.id},this,'${
            item.status
          }')"
                        id="status"
                        class="bg-gray-50 border  border-[#DBDFEA]  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-9/12 py-2.5 ">
                        ${staticStatusOrder
                          .map(
                            (status) =>
                              `
                            <option  data-key="${status}"  value="${status}" ${
                                status === item.status && "selected"
                              }
                                >${status}
                            </option>
                            `
                          )
                          .join("")} 
                         </select>
                </div>
            </td>
            <td class="border-t-2">
                <div onclick="openModalOrder(${item.id})">
                    <img class="w-auto h-[20px] active:bg-white"
                        src="/assets/images/folder.png" alt="" /> </div>
            </td>
            <td class="border-t-2 text-[red] cursor-pointer"
                onclick="openModal('/api/v1/order/',${
                  item.id
                },'Delete Order',2,this)" >
    
                <img class="w-auto h-[20px] active:bg-white"
                    src="/assets/images/delete.png" alt="" />
            </td>
        </tr>
        `;
        tbody += tbody.insertAdjacentHTML("afterbegin", text);

        const locales = {
          tm: {
            completed: "ugradyldy",
            cancelled: "ugradylmady",
            waiting: "garaşylýar",
            "on the way": "ýolda",
          },
          ru: {
            completed: "завершенный",
            cancelled: "отменен",
            waiting: "ожидающий",
            "on the way": "в пути",
          },
        };
        const dataKeys = document
          .getElementsByTagName("tr")[1]
          .querySelectorAll("[data-key]");
        const lang = document.querySelector("html").getAttribute("lang");
        for (let index = 0; index < dataKeys.length; index++) {
          const element = dataKeys[index];
          element.textContent = locales[lang][element.getAttribute("data-key")];
        }
        let num = 0;
        const tableItemNumber = document.querySelectorAll("#table_number");
        for (let index = 0; index < tableItemNumber.length; index++) {
          const element = tableItemNumber[index];
          element.textContent = index + 1;
        }
        // const times = document.querySelectorAll('#getTimeToDate')
        // for (let i = 0; i < times.length; i++) {
        //     times[i].textContent = format(times[i].textContent.trim(),true)
        // }
      } else if (item.event == "payment") {
        const dataOrderId = document.querySelector(
          `[data-orderid="${item.data.orderId}"]`
        );
        if (dataOrderId) {
          const textPaymentStatus = dataOrderId.querySelector("span");

          if (textPaymentStatus)
            textPaymentStatus.textContent =
              "-" + paymentStatus[item.data.status] + "-";
        }
      }
    } else {
      let notificationOrders = document.getElementById("notification-orders");
      document.getElementById("count-orders").style.display = "block";
      const countOrders =
        parseInt(document.getElementById("count-orders").textContent) || 0;
      document.getElementById("count-orders").textContent = countOrders + 1;
      const textt = `
                <li>
                    <div href="#" class="flex text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2 font-bold">
                    <p>${item.data.address} | </p>
    
                    <p>${format(item.data.createdAt.trim())}</p>
                    </div>
                </li>
            `;
      notificationOrders += notificationOrders.insertAdjacentHTML(
        "afterbegin",
        textt
      );
    }
    const isViewedIds = [item.id];
    await fetch("http://localhost:3001/api/v1/order", {
      method: "PUT",
      body: JSON.stringify(isViewedIds),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(event.data);
  };
  ws.onopen = function (event) {
    console.log("Connected", event);
  };

  ws.onclose = function (event) {
    console.log(
      "Socket is closed. Reconnect will be attempted in 1 second.",
      event.reason
    );
    setTimeout(function () {
      connect();
    }, 1000);
  };

  ws.onerror = function (err) {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };
}

connect();
