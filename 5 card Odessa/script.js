// 1. Функция для времени (Одесса)
function startClock() {
  const clockEl = document.getElementById("local-time");
  if (clockEl) {
    setInterval(() => {
      clockEl.textContent = new Date().toLocaleTimeString("ru-RU", {
        timeZone: "Europe/Kyiv",
      });
    }, 1000);
  }
}

// 2. Функция для автоматической темы
function setAutoTheme() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) {
    document.body.classList.add("day-theme");
    document.body.classList.remove("night-theme");
  } else {
    document.body.classList.add("night-theme");
    document.body.classList.remove("day-theme");
  }
}

// 3. Карта
function loadMap() {
  const coords = [46.4846, 30.7326];
  const map = L.map("map").setView(coords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  L.marker(coords).addTo(map).bindPopup("Одесса-мама!").openPopup();
}

// 4. До лета
function countdown() {
  const now = new Date();
  const summer = new Date(now.getFullYear(), 5, 1);
  if (now > summer) summer.setFullYear(summer.getFullYear() + 1);
  const diff = Math.floor((summer - now) / (1000 * 60 * 60 * 24));
  const countEl = document.getElementById("countdown");
  if (countEl)
    countEl.innerHTML = `<i class="fa-solid fa-sun"></i> До лета: ${diff} дней`;
}

// 5. Погода
async function getRealWeather() {
  try {
    const response = await fetch("https://wttr.in/Odessa?format=j1");
    const data = await response.json();
    const current = data.current_condition[0];
    const temp = current.temp_C;
    const desc = current.lang_ru
      ? current.lang_ru[0].value
      : current.weatherDesc[0].value;

    document.getElementById("temp").textContent = `${
      temp > 0 ? "+" : ""
    }${temp}°C`;
    document.getElementById("weather-desc").textContent = desc;

    const icon = document.getElementById("weather-icon");
    if (temp > 20) icon.className = "fa-solid fa-sun";
    else if (temp > 0) icon.className = "fa-solid fa-cloud-sun";
    else icon.className = "fa-solid fa-snowflake";
  } catch (error) {
    console.log("Ошибка погоды:", error);
  }
}

// ГЛАВНЫЙ ЗАПУСК (Все функции внутри)
window.addEventListener("DOMContentLoaded", () => {
  startClock();
  setAutoTheme();
  loadMap();
  countdown();
  getRealWeather();

  // Логика кнопки фактов
  const btn = document.getElementById("vibe-btn");
  const messageEl = document.getElementById("vibe-message");
  const retroBtn = document.getElementById("retro-btn");
  const accordionHeaders = document.querySelectorAll(".acc-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      // Опционально: закрываем все остальные вкладки перед открытием новой
      document.querySelectorAll(".acc-item").forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });
      // Переключаем класс active у текущего элемента
      item.classList.toggle("active");
    });
  });

  retroBtn.onclick = () => {
    document.body.classList.toggle("sepia-mode");
    retroBtn.textContent = document.body.classList.contains("sepia-mode")
      ? "Вернуться в 2026"
      : "Включить 19-й век";
  };

  if (btn && messageEl) {
    const facts = [
      "В Одессе находится самая длинная в мире лестница в стиле классицизма — Потемкинская.",
      "Одесса была первым городом, где появился асфальт.",
      "Под городом раскинулись катакомбы протяженностью более 2500 километров.",
      "Первый в мире фуникулер был открыт именно в Одессе в 1902 году.",
      "Оперный театр обладает акустикой, где шепот со сцены слышен в любом углу зала.",
    ];

    btn.onclick = () => {
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      messageEl.innerHTML = `
                <div style="background: rgba(255,204,0,0.1); padding: 15px; border-radius: 10px; margin-top: 15px; border-left: 4px solid var(--gold); animation: fadeIn 0.5s;">
                    <p style="margin:0; font-style: italic;">— ${randomFact}</p>
                </div>
            `;
    };
  }
});
