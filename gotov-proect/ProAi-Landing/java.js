//Находим нужные элементы по их классам/ID
const demoButton = document.querySelector(".btn-cta-demo");
const modalBackdrop = document.getElementById("videoModal");
const closeButton = document.querySelector(".close-button");
// --- 1. Функция открытия ---
function openModal() {
  modalBackdrop.classList.add("open");
}
// --- 2. Функция закрытия ---
function closeModal() {
  modalBackdrop.classList.remove("open");
}
// --- 3. Слушатели событий ---
//--- Открытие по клику на кнопку
demoButton.addEventListener("click", openModal);
//--- Закрытие по клику на кнопку "Х"
closeButton.addEventListener("click", closeModal);
//--- Закрытие по клику на затемненны фон
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});
// --- Закрытие по нажатию клаивиши ESC ---
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalBackdrop.classList.contains("open")) {
    closeModal();
  }
});
// --- 4. Логика переключения тарифов ---
const priceToggle = document.getElementById("priceToggle");
const priceValues = document.querySelectorAll(".price-value");
const monthlyLabel = document.getElementById("monthlyLabel");
const annuallyLabel = document.getElementById("annuallyLabel");

priceToggle.addEventListener("change", function () {
  //Определяем, включен ли переключатель (Годовой режим)
  const isAnnually = this.checked;
  // Обновляем цены
  priceValues.forEach((priceSpan) => {
    if (isAnnually) {
      //Если включен, берем цену из data-annually
      priceSpan.textContent = priceSpan.getAttribute("data-annually");
    } else {
      // Если выключен, берем цену из data-monthly
      priceSpan.textContent = priceSpan.getAttribute("data-monthly");
    }
  });
  // Обновляем активные метки
  if (isAnnually) {
    monthlyLabel.classList.remove("active");
    annuallyLabel.classList.add("active");
  } else {
    monthlyLabel.classList.add("active");
    annuallyLabel.classList.remove("active");
  }
});
// --- 5. Логика Аккордиона ---
const accordionHeaders = document.querySelectorAll(".accordion-header");
accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.closest(".accordion-item");
    const content = item.querySelector(".accordion-content");
    const isExpanded = header.getAttribute("aria-expanded") === "true";
    // --- 1. Переключение класса
    item.classList.toggle("active");
    // --- 2. Управление атрибутом Accessibility (доступность)
    header.setAttribute("aria-expanded", !isExpanded);
    // --- 3. Управление высотой (для планого css-перехода)
    if (isExpanded) {
      content.computedStyleMap.maxHeight = 0;
    } else {
      content.scrollHeight = content.scrollHeight + "px";
    }
  });
});
// --- 6. Логика переключения языка ---
const langButtons = document.querySelectorAll(".lang-btn");
const translatableElements = document.querySelectorAll(
  "[data-lang-en], [data-lang-ru], [data-lang-cs]"
);
const defaultLang = "en";
let currentLang = localStorage.getItem("lang") || defaultLang;
// --- Функция для применения перевода к элементам.
function applyTranslation(langCode) {
  langButtons.forEach((button) => {
    if (button.getAttribute("data-lang-code") === langCode) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
  // --- 2. Обновляем текстовое содержимое элементов
  translatableElements.forEach((Element) => {
    const translationAttribute = `data-lang-${langCode}`;
    //Получаем текст из атрибута
    const translatedText = Element.getAttribute(translationAttribute);
    // Получаем оригинальный текст
    const originalText = Element.textContent.trim();
    if (translatedText) {
      Element.textContent = translatedText;
    }
  });
}
//--- 3. Обаработчик событий для кнопок
langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const newLang = button.getAttribute("data-lang-code");
    // Сохраняем новый язык и применяем перевод
    localStorage.setItem("lang", newLang);
    currentLang = newLang;
    applyTranslation(currentLang);
  });
});
//--- 4. Применяем перевод при загрузке страницы
applyTranslation(currentLang);
