
const TRAINS_DATA = {
  "601Б": {
    number: "601Б", type: "Межрегиональный", typeClass: "regional",
    from: "Минск", to: "Брест",
    departureTime: "08:00", arrivalTime: "11:45", duration: "3ч 45мин",
    platform: "3", status: "ok",
    wagons: ["Плацкарт", "Купе", "СВ"],
    services: ["Кондиционер", "Розетки", "Wi-Fi"],
    stations: [
      { name: "Минск", departure: "08:00", platform: "3", start: true },
      { name: "Барановичи", arrival: "09:40", departure: "09:45", stop: "5 мин", platform: "2" },
      { name: "Брест", arrival: "11:45", platform: "5", end: true },
    ]
  },
  "803Г": {
    number: "803Г", type: "Эконом", typeClass: "econom",
    from: "Минск", to: "Витебск",
    departureTime: "10:30", arrivalTime: "13:45", duration: "3ч 15мин",
    platform: "7", status: "delay",
    wagons: ["Плацкарт"],
    services: ["Wi-Fi", "Ресторан"],
    stations: [
      { name: "Минск", departure: "10:30", platform: "7", start: true },
      { name: "Орша", arrival: "12:50", departure: "12:55", stop: "5 мин", platform: "1" },
      { name: "Витебск", arrival: "13:45", platform: "3", end: true },
    ]
  },
  "702М": {
    number: "702М", type: "Бизнес-класс", typeClass: "business",
    from: "Минск", to: "Гомель",
    departureTime: "09:15", arrivalTime: "13:30", duration: "4ч 15мин",
    platform: "1", status: "ok",
    wagons: ["Бизнес-класс", "Купе"],
    services: ["Питание включено", "Wi-Fi", "Розетки", "Кондиционер"],
    stations: [
      { name: "Минск", departure: "09:15", platform: "1", start: true },
      { name: "Жлобин", arrival: "11:50", departure: "11:55", stop: "5 мин", platform: "2" },
      { name: "Гомель", arrival: "13:30", platform: "4", end: true },
    ]
  },
  "904В": {
    number: "904В", type: "Межрегиональный", typeClass: "regional",
    from: "Минск", to: "Гродно",
    departureTime: "12:00", arrivalTime: "15:20", duration: "3ч 20мин",
    platform: "2", status: "ok",
    wagons: ["Плацкарт", "Купе"],
    services: ["Wi-Fi", "Розетки"],
    stations: [
      { name: "Минск", departure: "12:00", platform: "2", start: true },
      { name: "Молодечно", arrival: "13:10", departure: "13:15", stop: "5 мин", platform: "1" },
      { name: "Лида", arrival: "14:20", departure: "14:25", stop: "5 мин", platform: "2" },
      { name: "Гродно", arrival: "15:20", platform: "3", end: true },
    ]
  },
  "205П": {
    number: "205П", type: "Эконом", typeClass: "econom",
    from: "Минск", to: "Могилёв",
    departureTime: "13:45", arrivalTime: "16:00", duration: "2ч 15мин",
    platform: "4", status: "ok",
    wagons: ["Плацкарт"],
    services: ["Wi-Fi"],
    stations: [
      { name: "Минск", departure: "13:45", platform: "4", start: true },
      { name: "Осиповичи", arrival: "15:00", departure: "15:05", stop: "5 мин", platform: "1" },
      { name: "Могилёв", arrival: "16:00", platform: "2", end: true },
    ]
  },
  "306Л": {
    number: "306Л", type: "Бизнес-класс", typeClass: "business",
    from: "Гомель", to: "Минск",
    departureTime: "14:20", arrivalTime: "18:30", duration: "4ч 10мин",
    platform: "5", status: "ok",
    wagons: ["Бизнес-класс", "Купе"],
    services: ["Питание включено", "Wi-Fi", "Кондиционер"],
    stations: [
      { name: "Гомель", departure: "14:20", platform: "5", start: true },
      { name: "Жлобин", arrival: "16:00", departure: "16:05", stop: "5 мин", platform: "3" },
      { name: "Минск", arrival: "18:30", platform: "1", end: true },
    ]
  },
  "407О": {
    number: "407О", type: "Межрегиональный", typeClass: "regional",
    from: "Витебск", to: "Минск",
    departureTime: "15:50", arrivalTime: "18:20", duration: "2ч 30мин",
    platform: "6", status: "delay",
    wagons: ["Плацкарт", "Купе"],
    services: ["Wi-Fi", "Розетки"],
    stations: [
      { name: "Витебск", departure: "15:50", platform: "6", start: true },
      { name: "Орша", arrival: "16:50", departure: "16:55", stop: "5 мин", platform: "2" },
      { name: "Минск", arrival: "18:20", platform: "4", end: true },
    ]
  },
  "508Ж": {
    number: "508Ж", type: "Эконом", typeClass: "econom",
    from: "Минск", to: "Брест",
    departureTime: "16:30", arrivalTime: "20:40", duration: "4ч 10мин",
    platform: "8", status: "ok",
    wagons: ["Плацкарт"],
    services: ["Wi-Fi"],
    stations: [
      { name: "Минск", departure: "16:30", platform: "8", start: true },
      { name: "Барановичи", arrival: "18:15", departure: "18:20", stop: "5 мин", platform: "1" },
      { name: "Брест", arrival: "20:40", platform: "2", end: true },
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const trainNumber = decodeURIComponent(params.get("train") || "").trim();
  const train = TRAINS_DATA[trainNumber];

  if (!train) {
    document.body.innerHTML = '<div style="padding:60px;text-align:center;"><h2>Поезд не найден</h2><a href="schedule.html" style="color:#2563eb;">← Расписание</a></div>';
    return;
  }

  document.getElementById("trainNumber").textContent = "Поезд №" + train.number;

  const typeEl = document.getElementById("trainType");
  typeEl.textContent = train.type;
  typeEl.className = "badge " + train.typeClass;

  document.getElementById("fromCity").textContent = train.from;
  document.getElementById("toCity").textContent = train.to;
  document.getElementById("departureTime").textContent = train.departureTime;
  document.getElementById("arrivalTime").textContent = train.arrivalTime;
  document.getElementById("duration").textContent = "⏱ " + train.duration;
  document.getElementById("platform").textContent = "Платформа: " + train.platform;

  const statusEl = document.getElementById("trainStatus");
  if (train.status === "delay") {
    statusEl.textContent = "⚠ Задерживается (+25 мин)";
    statusEl.className = "status delay";
  } else {
    statusEl.textContent = "✔ Вовремя";
    statusEl.className = "status ok";
  }

  const wagonBlock = document.getElementById("wagonBlock");
  wagonBlock.innerHTML = "<h3>Типы вагонов</h3>";
  train.wagons.forEach(w => { wagonBlock.innerHTML += `<p>• ${w}</p>`; });

  const serviceBlock = document.getElementById("serviceBlock");
  serviceBlock.innerHTML = "<h3>Услуги</h3>";
  train.services.forEach(s => { serviceBlock.innerHTML += `<p>• ${s}</p>`; });

  const container = document.getElementById("routeContainer");
  container.innerHTML = "";
  train.stations.forEach(stop => {
    const div = document.createElement("div");
    div.className = "station" + (stop.start || stop.end ? " active" : "");
    div.innerHTML = `
      <div class="line"></div>
      <div class="dot"></div>
      <div class="station-content">
        <h3>${stop.name}</h3>
        ${stop.departure ? `<p>Отправление: <b>${stop.departure}</b></p>` : ""}
        ${stop.arrival   ? `<p>Прибытие: <b>${stop.arrival}</b></p>` : ""}
        ${stop.stop      ? `<p>Стоянка: <b>${stop.stop}</b></p>` : ""}
        <p>Платформа: <b>${stop.platform}</b></p>
      </div>
    `;
    container.appendChild(div);
  });

  const buyLink = document.getElementById("buyLink");
  if (buyLink) {
    buyLink.href = `book.html?train=${encodeURIComponent(train.number)}`;
  }
});