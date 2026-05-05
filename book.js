
const WAGON_PRICES = {
  "Купе": 45,
  "СВ": 65,
  "Плацкарт": 25,
  "Бизнес-класс": 90,
};

const WAGON_DESCS = {
  "Купе": "Купейный вагон, 4 места в купе",
  "СВ": "Спальный вагон, 2 места в купе",
  "Плацкарт": "Плацкартный вагон, открытые полки",
  "Бизнес-класс": "Повышенный комфорт, широкие кресла",
};

let trainNumber = "";
let trainData = null;
let wagonsData = [];
let selectedWagon = null;
let passengerCount = 1;
let currentStep = 1;

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  trainNumber = decodeURIComponent(params.get("train") || "").trim();

 
  const today = new Date();
  const months = ["января","февраля","марта","апреля","мая","июня",
                  "июля","августа","сентября","октября","ноября","декабря"];
  document.getElementById("orderDate").textContent =
    `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;


  fetch("trains.xml")
    .then(r => {
      if (!r.ok) throw new Error("fetch failed");
      return r.text();
    })
    .then(str => {
      const xml = new DOMParser().parseFromString(str, "text/xml");
      const trains = xml.getElementsByTagName("train");
      for (let t of trains) {
        const numEl = t.getElementsByTagName("number")[0];
        if (!numEl) continue;
        const num = numEl.textContent.trim();
        if (num === trainNumber) {
          const getText = tag => t.getElementsByTagName(tag)[0]?.textContent.trim() || "";
          trainData = {
            number: num,
            from: getText("from"),
            to:   getText("to"),
            dep:  getText("departureTime"),
            arr:  getText("arrivalTime"),
            dur:  getText("duration"),
          };

          wagonsData = [];
          const wagonsEl = t.getElementsByTagName("wagons")[0];
          if (wagonsEl) {
            const wagonEls = wagonsEl.getElementsByTagName("wagon");
            for (let w of wagonEls) {
              const name = w.textContent.trim();
              wagonsData.push({
                name,
                desc: WAGON_DESCS[name] || "",
                price: WAGON_PRICES[name] || 30,
              });
            }
          }
          break;
        }
      }

      if (!trainData) {
        document.getElementById("bookingSubtitle").textContent = "Поезд не найден";
        document.getElementById("wagonContainer").innerHTML =
          '<div style="color:#ef4444;">Поезд не найден. <a href="schedule.html" style="color:#2563eb;">← Назад к расписанию</a></div>';
        return;
      }

      initPage();
    })
    .catch(() => {
      
      loadFallbackData();
    });
});


function loadFallbackData() {
  const TRAINS = {
    "601Б": { from:"Минск", to:"Брест", dep:"08:00", arr:"11:45", dur:"3ч 45мин",
      wagons:[{name:"Плацкарт",desc:"Плацкартный вагон, открытые полки",price:25},
              {name:"Купе",desc:"Купейный вагон, 4 места в купе",price:45},
              {name:"СВ",desc:"Спальный вагон, 2 места в купе",price:65}]},
    "803Г": { from:"Минск", to:"Витебск", dep:"10:30", arr:"13:45", dur:"3ч 15мин",
      wagons:[{name:"Плацкарт",desc:"Плацкартный вагон, открытые полки",price:25}]},
    "702М": { from:"Минск", to:"Гомель", dep:"09:15", arr:"13:30", dur:"4ч 15мин",
      wagons:[{name:"Бизнес-класс",desc:"Повышенный комфорт, широкие кресла",price:90},
              {name:"Купе",desc:"Купейный вагон, 4 места в купе",price:45}]},
    "904В": { from:"Минск", to:"Гродно", dep:"12:00", arr:"15:20", dur:"3ч 20мин",
      wagons:[{name:"Плацкарт",desc:"Плацкартный вагон, открытые полки",price:25},
              {name:"Купе",desc:"Купейный вагон, 4 места в купе",price:45}]},
    "205П": { from:"Минск", to:"Могилёв", dep:"13:45", arr:"16:00", dur:"2ч 15мин",
      wagons:[{name:"Плацкарт",desc:"Плацкартный вагон, открытые полки",price:25}]},
    "306Л": { from:"Гомель", to:"Минск", dep:"14:20", arr:"18:30", dur:"4ч 10мин",
      wagons:[{name:"Купе",desc:"Купейный вагон, 4 места в купе",price:45},
              {name:"Бизнес-класс",desc:"Повышенный комфорт, широкие кресла",price:90}]},
    "407О": { from:"Витебск", to:"Минск", dep:"15:50", arr:"18:20", dur:"2ч 30мин",
      wagons:[{name:"Плацкарт",desc:"Плацкартный вагон, открытые полки",price:25},
              {name:"Купе",desc:"Купейный вагон, 4 места в купе",price:45}]},
    "508Ж": { from:"Минск", to:"Брест", dep:"16:30", arr:"20:40", dur:"4ч 10мин",
      wagons:[{name:"Плацкарт",desc:"Плацкартный вагон, открытые полки",price:25}]},
  };

  const data = TRAINS[trainNumber];
  if (!data) {
    document.getElementById("bookingSubtitle").textContent = "Поезд не найден";
    return;
  }

  trainData = { number: trainNumber, from: data.from, to: data.to,
                dep: data.dep, arr: data.arr, dur: data.dur };
  wagonsData = data.wagons;
  initPage();
}


function initPage() {
  document.getElementById("bookingSubtitle").textContent =
    `Поезд №${trainData.number} · ${trainData.from} → ${trainData.to}`;
  document.title = `Бронирование — Поезд №${trainData.number}`;

  document.getElementById("orderRoute").textContent = `${trainData.from} → ${trainData.to}`;
  document.getElementById("orderTime").textContent = `${trainData.dep} - ${trainData.arr}`;
  document.getElementById("orderDuration").textContent = trainData.dur;

  renderWagons();
  renderPassengerForm();
}


function renderWagons() {
  const container = document.getElementById("wagonContainer");
  container.innerHTML = "";

  wagonsData.forEach((w) => {
    const el = document.createElement("div");
    el.className = "wagon-option";
    el.innerHTML = `
      <div class="w-info">
        <div class="w-name">${w.name}</div>
        <div class="w-desc">${w.desc}</div>
      </div>
      <div class="w-price">${w.price} BYN</div>
    `;
    el.onclick = () => {
      document.querySelectorAll(".wagon-option").forEach(o => o.classList.remove("selected"));
      el.classList.add("selected");
      selectedWagon = w;
      document.getElementById("btn1").disabled = false;
      updateTotal();
    };
    container.appendChild(el);
  });

  document.getElementById("btn1").onclick = () => goStep(2);
}


function onPassengerCountChange(val) {
  passengerCount = parseInt(val);
  renderPassengerForm();
}

function renderPassengerForm() {
  const form = document.getElementById("passengerForm");
  form.innerHTML = "";

  for (let i = 0; i < passengerCount; i++) {
    const block = document.createElement("div");
    block.className = "passenger-block";
    block.innerHTML = `
      <h3>Пассажир ${i + 1}</h3>
      <div class="form-row">
        <div class="form-group">
          <label>Имя</label>
          <input type="text" placeholder="Иван" class="p-first">
        </div>
        <div class="form-group">
          <label>Фамилия</label>
          <input type="text" placeholder="Иванов" class="p-last">
        </div>
      </div>
      <div class="form-row" style="margin-top:12px;">
        <div class="form-group" style="grid-column:1/-1;">
          <label>Номер паспорта</label>
          <input type="text" placeholder="AB1234567" class="p-passport">
        </div>
      </div>
    `;
    form.appendChild(block);
  }

  document.getElementById("orderPassengers").textContent = passengerCount;
  updateTotal();
}


function updateTotal() {
  if (!selectedWagon) return;
  const total = selectedWagon.price * passengerCount;

  document.getElementById("ticketItems").innerHTML = `
    <div class="ticket-item">
      <span>${selectedWagon.name} × ${passengerCount}</span>
      <span>${total} BYN</span>
    </div>
  `;
  document.getElementById("orderTotal").textContent = total + " BYN";
  document.getElementById("payBtnPrice").textContent = total + " BYN";
}


function goStep(n) {
  if (currentStep === 2 && n === 3) {
    if (!validatePassengers()) return;
  }


  const prevEl = document.getElementById("stepEl" + currentStep);
  prevEl.classList.remove("active");
  prevEl.classList.add("done");
  prevEl.querySelector(".step-circle").textContent = "✓";

  if (currentStep <= 2) {
    document.getElementById("line" + currentStep).classList.add("done");
  }

  document.getElementById("step" + currentStep).classList.remove("active");

  currentStep = n;

  document.getElementById("step" + n).classList.add("active");
  document.getElementById("stepEl" + n).classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBack(toStep) {
  
  const curEl = document.getElementById("stepEl" + currentStep);
  curEl.classList.remove("active");

  
  const prevEl = document.getElementById("stepEl" + toStep);
  prevEl.classList.remove("done");
  prevEl.classList.add("active");
  prevEl.querySelector(".step-circle").textContent = toStep;


  if (toStep <= 2) {
    document.getElementById("line" + toStep).classList.remove("done");
  }

  document.getElementById("step" + currentStep).classList.remove("active");
  currentStep = toStep;
  document.getElementById("step" + toStep).classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}


function validatePassengers() {
  let ok = true;
  document.querySelectorAll(".passenger-block").forEach(block => {
    ["p-first", "p-last", "p-passport"].forEach(cls => {
      const inp = block.querySelector("." + cls);
      if (!inp) return;
      if (!inp.value.trim()) {
        inp.classList.add("error");
        ok = false;
      } else {
        inp.classList.remove("error");
      }
    });
  });
  if (!ok) alert("Пожалуйста, заполните все поля пассажиров.");
  return ok;
}


function formatCard(inp) {
  let v = inp.value.replace(/\D/g, "").slice(0, 16);
  inp.value = v.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(inp) {
  let v = inp.value.replace(/\D/g, "").slice(0, 4);
  if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
  inp.value = v;
}


function confirmPayment() {
  const num = document.getElementById("cardNumber").value.replace(/\s/g, "");
  const exp = document.getElementById("cardExpiry").value;
  const cvv = document.getElementById("cardCvv").value;
  const name = document.getElementById("cardName").value.trim();

  if (num.length < 16 || exp.length < 5 || cvv.length < 3 || !name) {
    alert("Пожалуйста, заполните данные карты корректно.");
    return;
  }


  const el3 = document.getElementById("stepEl3");
  el3.classList.remove("active");
  el3.classList.add("done");
  el3.querySelector(".step-circle").textContent = "✓";
  document.getElementById("line2").classList.add("done");

  document.getElementById("step3").classList.remove("active");

 
  const code = "БЛР-" + Math.random().toString(36).slice(2, 10).toUpperCase();
  document.getElementById("bookingCode").textContent = code;

  const today = new Date();
  const months = ["января","февраля","марта","апреля","мая","июня",
                  "июля","августа","сентября","октября","ноября","декабря"];
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  document.getElementById("sucTrain").textContent = "№" + trainData.number;
  document.getElementById("sucRoute").textContent = `${trainData.from} → ${trainData.to}`;
  document.getElementById("sucDate").textContent = `${dateStr}, ${trainData.dep}`;
  document.getElementById("sucWagon").textContent = selectedWagon ? selectedWagon.name : "—";
  document.getElementById("sucPassengers").textContent = passengerCount;
  document.getElementById("sucTotal").textContent =
    (selectedWagon ? selectedWagon.price * passengerCount : 0) + " BYN";

  document.getElementById("successScreen").classList.add("show");
  window.scrollTo({ top: 0, behavior: "smooth" });
}