/**
 * 1. ЧАСЫ И ВРЕМЯ
 * Функция запускает каждую секунду обновление времени с учетом часового пояса Одессы.
 */
function startClock() {
  const clockEl = document.getElementById("local-time");
  // Проверяем, есть ли элемент на странице, чтобы избежать ошибок
  if (clockEl) {
    setInterval(() => {
      clockEl.textContent = new Date().toLocaleTimeString("ru-RU", {
        timeZone: "Europe/Kyiv",
      });
    }, 1000);
  }
}

/**
 * 2. АВТОМАТИЧЕСКАЯ СМЕНА ТЕМЫ (ДЕНЬ/НОЧЬ)
 * Определяет текущий час и вешает соответствующий БЭМ-модификатор на блок page.
 */
function setAutoTheme() {
  const hour = new Date().getHours();
  // Ищем корневой блок page, который у нас висит на теге body
  const pageEl = document.querySelector(".page");

  if (pageEl) {
    // С 6 утра до 18 вечера включаем дневную тему
    if (hour >= 6 && hour < 18) {
      pageEl.classList.add("page_theme_day");
      pageEl.classList.remove("page_theme_night");
    } else {
      // В остальное время — ночную
      pageEl.classList.add("page_theme_night");
      pageEl.classList.remove("page_theme_day");
    }
  }
}

/**
 * 3. МИНИ-КАРТА (Инициализация при загрузке)
 * Выводит карту во фрейме с координатами Одессы.
 */
function loadMap() {
  const coords = [46.4846, 30.7326]; // Координаты центра Одессы
  const mapContainer = document.getElementById("map");

  // Инициализируем карту только если контейнер существует
  if (mapContainer) {
    const map = L.map("map").setView(coords, 13);

    // Подключаем бесплатные тайлы OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    // Добавляем маркер с приветственным поп-апом
    L.marker(coords).addTo(map).bindPopup("Одесса-мама!").openPopup();
  }
}

/**
 * 4. ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ДО ЛЕТА
 * Вычисляет разницу в днях между текущей датой и 1 июня.
 */
function countdown() {
  const now = new Date();
  let summer = new Date(now.getFullYear(), 5, 1); // 5 — это июнь (индексация с 0)

  // Если 1 июня в этом году уже прошло, считаем до следующего года
  if (now > summer) {
    summer.setFullYear(summer.getFullYear() + 1);
  }

  // Переводим миллисекунды в дни
  const diff = Math.ceil((summer - now) / (1000 * 60 * 60 * 24));
  const countEl = document.getElementById("countdown");

  if (countEl) {
    countEl.innerHTML = `<i class="fa-solid fa-sun"></i> До лета: ${diff} дней`;
  }
}

/**
 * 5. ЗАГРУЗКА РЕАЛЬНОЙ ПОГОДЫ
 * Асинхронно запрашивает данные с wttr.in в формате JSON.
 */
async function getRealWeather() {
  try {
    const response = await fetch("https://wttr.in/Odessa?format=j1");
    if (!response.ok) throw new Error("Сеть ответила с ошибкой");

    const data = await response.json();
    const current = data.current_condition[0];
    const temp = current.temp_C;
    // Проверяем наличие русского описания погоды, иначе берем английское
    const desc = current.lang_ru
      ? current.lang_ru[0].value
      : current.weatherDesc[0].value;

    // Выводим температуру со знаком плюс, если тепло
    const tempEl = document.getElementById("temp");
    if (tempEl) {
      tempEl.textContent = `${temp > 0 ? "+" : ""}${temp}°C`;
    }

    const descEl = document.getElementById("weather-desc");
    if (descEl) {
      descEl.textContent = desc;
    }

    // Меняем иконку в зависимости от температурного режима
    const icon = document.getElementById("weather-icon");
    if (icon) {
      if (temp > 20) icon.className = "fa-solid fa-sun weather__icon";
      else if (temp > 0) icon.className = "fa-solid fa-cloud-sun weather__icon";
      else icon.className = "fa-solid fa-snowflake weather__icon";
    }
  } catch (error) {
    console.log("Ошибка при получении погоды:", error);
    const descEl = document.getElementById("weather-desc");
    if (descEl) descEl.textContent = "Не удалось загрузить прогноз";
  }
}

/**
 * 6. ФОТОГАЛЕРЕЯ (МОДАЛЬНОЕ ОКНО С АЛЬБОМОМ)
 * Массив путей к картинкам (дубликаты Потемкинской лестницы удалены).
 */
const odessaAlbum = [
  "img/caption.jpg",
  "img/bulvar.jpg",
  "img/deribas-1.jpg",
  "img/ekaterina.jpg",
  "img/Gorsadderebas.jpg",
  "img/image.webp",
  "img/mesta-odessa13.jpg",
  "img/morvokzal.jpg",
  "img/odessa-sights-2.jpg",
  "img/opernyj-teatr-tour-v-odessy.jpg",
  "img/palaces-of-odessa-4.jpg",
  "img/pamytnik-jena-provozaet.jpg",
  "img/potemkin.jpg",
  "img/potemkinskay-lestnica.jpg",
  "img/vid-na-potemkinsky.jpg",
  "img/vid-s-verh.jpg",
];

let currentIndex = 0; // Переменная для отслеживания текущего слайда

// Открытие модального окна альбома
function openAlbum(index) {
  currentIndex = index;
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const counter = document.querySelector(".modal-gallery__counter");

  if (modal && modalImg && counter) {
    modal.style.display = "flex";
    modalImg.src = odessaAlbum[currentIndex];
    counter.innerText = `${currentIndex + 1} / ${odessaAlbum.length}`;
  }
}

// Листание фото (вперед / назад)
function changePhoto(step) {
  currentIndex += step;

  // Зацикливаем слайдер, если вышли за пределы массива
  if (currentIndex >= odessaAlbum.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = odessaAlbum.length - 1;

  const modalImg = document.getElementById("img01");
  const counter = document.querySelector(".modal-gallery__counter");

  if (modalImg) modalImg.src = odessaAlbum[currentIndex];
  if (counter)
    counter.innerHTML = `${currentIndex + 1} / ${odessaAlbum.length}`;
}

// Закрытие модального окна альбома
function closeModal() {
  const modal = document.getElementById("myModal");
  if (modal) modal.style.display = "none";
}

// Управление галереей с клавиатуры (Escape, Стрелочки)
document.addEventListener("keydown", function (event) {
  const modal = document.getElementById("myModal");
  // Срабатывает, только если модалка сейчас открыта (отображается как flex)
  if (modal && modal.style.display === "flex") {
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft") changePhoto(-1);
    if (event.key === "ArrowRight") changePhoto(1);
  }
});

/**
 * 7. МОДАЛЬНОЕ ОКНО С БОЛЬШОЙ КАРТОЙ
 */
let myMap; // Глобальная переменная для экземпляра большой карты

function openMap() {
  const mapModal = document.getElementById("mapModal");
  if (mapModal) {
    mapModal.style.display = "flex";

    // Инициализируем большую карту единожды при первом открытии
    if (!myMap) {
      myMap = L.map("map-large").setView([46.4825, 30.7233], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(myMap);

      // Таймаут необходим Leaflet, чтобы правильно рассчитать ширину блока внутри модалки
      setTimeout(() => {
        myMap.invalidateSize();
      }, 250);
    }
  }
}

function closeMap() {
  const mapModal = document.getElementById("mapModal");
  if (mapModal) mapModal.style.display = "none";
}

/**
 * 8. ГЛАВНЫЙ СЛУШАТЕЛЬ ЗАГРУЗКИ DOM
 * Срабатывает, когда вся разметка прочитана браузером.
 */
window.addEventListener("DOMContentLoaded", () => {
  // Запускаем базовые фичи
  startClock();
  setAutoTheme();
  loadMap();
  countdown();
  getRealWeather();

  // --- ЛОГИКА ДЛЯ АККОРДЕОНА (БЭМ-СТИЛЬ) ---
  const accordionHeaders = document.querySelectorAll(".accordion__header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const currentItem = header.parentElement; // Получаем родительский .accordion__item

      // Закрываем все остальные открытые вкладки аккордеона
      document.querySelectorAll(".accordion__item").forEach((item) => {
        if (item !== currentItem) {
          item.classList.remove("accordion__item_active");
        }
      });

      // Переключаем класс-модификатор у текущего элемента
      currentItem.classList.toggle("accordion__item_active");
    });
  });

  // --- КНОПКА РЕТРО-РЕЖИМА (19-й век) ---
  const retroBtn = document.getElementById("retro-btn");
  const pageEl = document.querySelector(".page");

  if (retroBtn && pageEl) {
    retroBtn.onclick = () => {
      // Тогглим БЭМ-модификатор сепии на блоке page
      pageEl.classList.toggle("page_theme_sepia");
      retroBtn.textContent = pageEl.classList.contains("page_theme_sepia")
        ? "Вернуться в 2026"
        : "Включить 19-й век";
    };
  }

  // --- ГЕНЕРАТОР ИНТЕРЕСНЫХ ФАКТОВ ---
  const factBtn = document.getElementById("vibe-btn");
  const messageEl = document.getElementById("vibe-message");

  if (factBtn && messageEl) {
    const facts = [
      "В Одессе находится самая длинная в мире лестница в стиле классицизма — Потёмкинская.",
      "Одесса была первым городом Российской империи (в бытность тех веков), где появился асфальт.",
      "Под городом раскинулись знаменитые катакомбы протяженностью более 2500 километров.",
      "Первый в Украине фуникулер был открыт именно в Одессе в 1902 году.",
      "Оперный театр обладает уникальной акустикой: шепот со сцены отчетливо слышен в любом углу зала.",
    ];

    factBtn.onclick = () => {
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      // Выводим факт со встроенной анимацией fadeIn, настроенной в CSS
      messageEl.innerHTML = `
        <div style="background: rgba(255,204,0,0.1); padding: 15px; border-radius: 10px; margin-top: 15px; border-left: 4px solid var(--gold); animation: fadeIn 0.5s;">
          <p style="margin:0; font-style: italic;">— ${randomFact}</p>
        </div>
      `;
    };
  }
});
