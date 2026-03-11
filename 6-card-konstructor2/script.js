// Ждем загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  // 1. Находим нужные элементы
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-image");
  const closeBtn = document.querySelector(".modal__close");
  const triggers = document.querySelectorAll(".js-gallery-trigger");

  // 2. Функция открытия модального окна
  function openModal(largeImageUrl) {
    modalImg.src = largeImageUrl; // Подсвечиваем путь к большой картинке

    modal.classList.add("is-visible"); //Показываем окно
  }

  // 3. Функция закрытия модального окна
  function closeModal() {
    modal.classList.remove("is-visible"); //Убираем окно
    modalImg.src = ""; //Очищаем путь к картинке
  }

  // 4. Вешаем клик на все превью в галерее
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.preventDefault(); // На всякий случай, если это ссылка
      const largeImageUrl = this.getAttribute("data-large"); //Берем путь из

      openModal(largeImageUrl); // Вызываем функцию открытия
    });
  });
  // 5. Вешаем клик на кнопку открытия
  closeBtn.addEventListener("click", closeModal);

  // 6. Вешаем клик на фон модалки
  modal.addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // 7. Закрытие по нажатию Esc

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-visible")) {
      closeModal();
    }
  });
});
