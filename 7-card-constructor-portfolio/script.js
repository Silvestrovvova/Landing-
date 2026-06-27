/* ============= Открываем DOM-Контент =========== */
document.addEventListener("DOMContentLoaded", () => {
  /* ====== Находим все необходимые элементы на страницу ======== */
  const cards = document.querySelectorAll(".portfolio-item");
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn = document.getElementById("modal-prev");
  const nextBtn = document.getElementById("modal-next");
  const modalCounter = document.getElementById("modal-counter");
  const thumbnailsContainer = document.getElementById("modal-thumbnails"); //Для поиска ленты

  let currentImages = []; // Сюда сохраняем массив картинок текущей карточки
  let currentIndex = 0; // Индекс текущей активной картинки

  /* ====== Открытие модального окна ======= */
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const imagesString = card.getAttribute("data-images");
      currentImages = imagesString.split(",");
      currentIndex = 0; // Всегда начинаем просмотр с первой картинки
      // Генерируем миниатюры для текущего альбома
      renderThumbnails();

      modalImg.src = currentImages[currentIndex];
      modalCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
      modal.classList.add("modal_active");

      // === Добавляем запись в историю для перехвата кнопки назад ===
      history.pushState({ modalOpen: true }, "");
    });
  });
  /* ====== Функция рендера миниатюр снизу ========== */
  function renderThumbnails() {
    thumbnailsContainer.innerHTML = ""; // Очищаем старые миниатюры
    currentImages.forEach((src, index) => {
      const thumb = document.createElement("img");
      thumb.src = src;
      thumb.classList.add("modal__thumb");
      if (index === currentIndex) {
        thumb.classList.add("modal__thumb_active");
      }
      // Клик по миниатюре переключает на эту фотку
      thumb.addEventListener("click", () => {
        currentIndex = index;
        updateImage(currentIndex);
      });

      thumbnailsContainer.appendChild(thumb);
    });
  }
  /* ====== Функция для обновления картинки ====== */
  function updateImage(index) {
    // сбрасываем анимацию, временно отключая ее
    modalImg.style.animation = "none";
    modalImg.src = currentImages[index];
    modalCounter.textContent = `${index + 1} / ${currentImages.length}`;
    // Трюк для браузера, чтобы он заметил сброс стилей
    void modalImg.offsetWidth;
    // Возвращаем анимацию обратно - теперь она проиграется заново для нового фото
    modalImg.style.animation = "";
    // Обьявляем активный класс у миниатюр
    const thumbs = thumbnailsContainer.querySelectorAll(".modal__thumb");
    thumbs.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add("modal__thumb_active");
      } else {
        thumb.classList.remove("modal__thumb_active");
      }
    });
  }
  /* ======= Навигация внутри слайдера ======== */
  // Клик вперед
  nextBtn.addEventListener("click", () => {
    currentIndex = currentIndex + 1;
    if (currentIndex >= currentImages.length) {
      currentIndex = 0;
    }
    updateImage(currentIndex);
  });
  // Клик назад
  prevBtn.addEventListener("click", () => {
    currentIndex = currentIndex - 1;
    if (currentIndex < 0) {
      currentIndex = currentImages.length - 1;
    }
    updateImage(currentIndex);
  });
  /* ======= Функция закрытия модалки ======= */
  function closeModalWithHistory() {
    if (modal.classList.contains("modal_active")) {
      modal.classList.remove("modal_active");

      if (history.state && history.state.modalOpen) {
        history.back();
      }
    }
  }
  /* ===== закрытие модального окна и клика на фон ========= */
  closeBtn.addEventListener("click", () => {
    closeModalWithHistory();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModalWithHistory();
    }
  });
  /* ======= Функция для подсчета колиства фотографий ======== */
  function calculateTotalImages() {
    let total = 0;

    cards.forEach((card) => {
      const imagesString = card.getAttribute("data-images");
      if (imagesString) {
        const imagesArray = imagesString.split(",");
        const albumCount = imagesArray.length;
        total += albumCount;

        const cardCountElement = card.querySelector(".portfolio-item__count");
        if (cardCountElement) {
          cardCountElement.textContent = ` (${albumCount} фото)`;
        }
      }
    });

    const totalCountElement = document.querySelector(".portfolio__total-count");
    if (totalCountElement) {
      totalCountElement.textContent = total;
    }
  }
  calculateTotalImages();
  /* ====== Перехват системной кнопки назад на ANDROID ======== */
  window.addEventListener("popstate", () => {
    if (modal.classList.contains("modal_active")) {
      modal.classList.remove("modal_active");
    }
  });
  /* ======================================== */
});
