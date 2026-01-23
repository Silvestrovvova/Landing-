document.addEventListener("DOMContentLoaded", () => {
  // 1. Находим элементы (используем новые классы из твоей сетки)
  const cards = document.querySelectorAll(".work-item");
  const modal = document.getElementById("projectModal");
  const progressBar = document.querySelector(".scroll-progress");

  // Элементы внутри модалки
  const mImg = document.getElementById("modalImg");
  const mTitle = document.getElementById("modalTitle");
  const mDesc = document.getElementById("modalDesc");
  const closeBtn = document.querySelector(".modal__close");

  // 2. Индикатор скролла
  window.addEventListener("scroll", () => {
    if (progressBar) {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    }
  });

  // 3. Логика модального окна
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Проверяем, есть ли модалка вообще
      if (!modal) return;

      // Вытягиваем данные из кликнутой карточки
      const title = card.querySelector("h3")?.innerText || "Project";
      const desc = card.querySelector("p")?.innerText || "";
      const imgSrc = card.querySelector("img")?.src || "";

      // Заполняем модалку данными
      if (mTitle) mTitle.innerText = title;
      if (mDesc) mDesc.innerText = desc;
      if (mImg) mImg.src = imgSrc;

      // Показываем окно
      modal.classList.add("modal--active");
      document.body.style.overflow = "hidden"; // замок на скролл
    });
  });

  // 4. Закрытие
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("modal--active");
      document.body.style.overflow = "auto";
    });
  }

  // Закрытие по фону
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("modal--active");
      document.body.style.overflow = "auto";
    }
  });
});
