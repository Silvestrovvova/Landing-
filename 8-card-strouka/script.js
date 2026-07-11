document.addEventListener("DOMContentLoaded", () => {
  const previews = document.querySelectorAll(".preview");
  const modal = document.getElementById("modalContainer");
  const closeBtn = document.getElementById("closeBtn");
  const allGrids = document.querySelectorAll(".album-grid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  // Функция закрытия всего (используем при нажатии системной кнопки Назад)
  function closeAll() {
    if (lightbox.classList.contains("lightbox--active")) {
      lightbox.classList.remove("lightbox--active");
      lightboxImg.src = "";
    } else if (modal.classList.contains("modal--active")) {
      modal.classList.remove("modal--active");
      document.body.style.overflow = "";
    }
  }

  // Открытие нужного альбома
  previews.forEach((preview) => {
    preview.addEventListener("click", () => {
      const albumId = preview.getAttribute("data-album");
      allGrids.forEach((grid) => grid.classList.remove("album-grid--active"));

      const targetGrid = document.getElementById(albumId);
      if (targetGrid) {
        targetGrid.classList.add("album-grid--active");
        modal.classList.add("modal--active");
        document.body.style.overflow = "hidden";

        // Добавляем фейковую точку в историю браузера
        history.pushState({ box: "modal" }, "");

        // Находим все фотки в этом открытом альбоме
        const photos = targetGrid.querySelectorAll(".album-grid__photo");
        photos.forEach((photo) => {
          photo.onclick = (e) => {
            e.stopPropagation();
            lightboxImg.src = photo.src;
            lightbox.classList.add("lightbox--active");

            // Добавляем еще одну точку для лайтбокса
            history.pushState({ box: "lightbox" }, "");
          };
        });
      }
    });
  });

  // Закрытие полноэкранного фото по клику на оверлей
  lightbox.onclick = () => {
    // Если пользователь кликнул сам, имитируем нажатие "Назад" в браузере,
    // чтобы убрать добавленный pushState
    history.back();
  };

  // Закрытие альбома по кнопке "Назад" в интерфейсе
  closeBtn.onclick = () => {
    history.back();
  };

  // Главный перехватчик кнопки "Назад" (на смартфоне или в браузере)
  window.addEventListener("popstate", () => {
    closeAll();
  });
});
