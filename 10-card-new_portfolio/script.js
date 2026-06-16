// ==================================================================
document.addEventListener("DOMContentLoaded", () => {
  /* ============== 1. Sticky Header (Изменение шапки при скролле) ============*/
  let lastScrollY = window.scrollY;
  let accumulatedSubida = 0;
  const smartHeader = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;

    if (currentScrollY > lastScrollY) {
      accumulatedSubida = 0;
      if (currentScrollY > 100) {
        smartHeader.classList.add("header--hidden");
      }
    } else {
      accumulatedSubida += lastScrollY - currentScrollY;
      if (accumulatedSubida >= 50 || currentScrollY <= 0) {
        smartHeader.classList.remove("header--hidden");
      }
    }
    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  });

  /* =========== 2. Mobile Menu (Клик по бургеру и открытие шторки)=============== */
  const burgerBtn = document.querySelector(".header__burger");
  const menuWindow = document.querySelector(".header__menu");
  const menuLinks = document.querySelectorAll(".header__link");

  if (burgerBtn && menuWindow) {
    burgerBtn.addEventListener("click", () => {
      menuWindow.classList.toggle("header__menu--active");
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuWindow.classList.remove("header__menu--active");
      });
    });
  }

  /* ========= 3. Smooth Scroll (Плавныи скролл для всех якорных сыллок и кнопок) ========== */

  /* ========== 6. Scroll Reveal (Плавное появление секции) =================== */
  const revealSections = () => {
    const sections = document.querySelectorAll(".reveal");

    sections.forEach((section) => {
      const windowHeight = window.innerHeight;
      const elementTop = section.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        section.classList.add("reveal--active");
      }
    });
  };

  window.addEventListener("scroll", revealSections);
  revealSections();
  /* ============ 7. Animate Numbers (бегущие цифры - исправлено время) ============== */
});
