document.addEventListener("DOMContentLoaded", () => {
  const previews = document.querySelectorAll(".preview");
  const modal = document.getElementById("modalContainer");
  const closeBtn = document.getElementById("closeBtn");
  const allGrids = document.querySelectorAll(".album-grid");

  //Элементы для просмотра одного фото
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  //Открытие нужного альбома
  previews.forEach((preview) => {
    preview.addEventListener("click", () => {
      const albumId = preview.getAttribute("data-album");
      allGrids.forEach((grid) => grid.classList.remove("album-grid--active"));
      const targetGrid = document.getElementById(albumId);
      if (targetGrid) {
        targetGrid.classList.add("album-grid--active");
        modal.classList.add("modal--active");
        document.body.style.overflow = "hidden";

        //Находим все фотки в этом открытом альбоме
        const photos = targetGrid.querySelectorAll(".album-grid__photo");
        photos.forEach((photo) => {
          photo.onclick = (e) => {
            e.stopPropagation();
            //чтобы не закрыть весь альбом случайно
            lightboxImg.src = photo.src;
            //Копируем путь к фото
            lightbox.classList.add("lightbox--active");
          };
        });
      }
    });
    //Закрытие полноэкранного фото
    lightbox.onclick = () => {
      lightbox.classList.remove("lightbox--active");
      lightboxImg.src = "";
    };
    //Закрытие альбома
    closeBtn.onclick = () => {
      modal.classList.remove("modal--active");
      document.body.style.overflow = "";
    };
  });
});
