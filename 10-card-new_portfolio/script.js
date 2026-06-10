/* =========== 1 Global initialization ============ */
document.addEventListener("DOMContentLoaded", () => {
  /* ==== 2 Stickky Header ========= */
  let lastScrollY = window.scrollY; //Фиксируем начальную точку скролла
  let accumulatedSubida = 0; //Переменная для подсчета прокрутки верх
  const smartHeader = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    // Логика скрытия и аоявления по направлению движения
    if (currentScrollY > lastScrollY) {
      // Скролим Вниз: срабатывает счетчик подьема и прячем шапку
      accumulatedSubida = 0;
      if (currentScrollY > 100) {
        smartHeader.classList.add("header--hidden");
      }
    } else {
      // Скроллим вверх: считаем, сколько пикселеи проехали вверх
      accumulatedSubida += lastScrollY - currentScrollY;
      //Если вверх прокрутили больше 50рх - плавно возвращаем шапку на экран
      if (accumulatedSubida >= 50 || currentScrollY <= 0) {
        smartHeader.classList.remove("header--hidden");
      }
    }
    // Обновляем последнюю точку сролла для следующего шага
    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  });
  /* ===== 3. MOBILE MENU (Клик по бургеру и открытие шторки) ====== */
  const burgerBtn = document.querySelector(".header__burger");
  const menuWindow = document.querySelector(".header__menu");
  const menuLinks = document.querySelectorAll(".header__link");
  if (burgerBtn && menuWindow) {
    // Переключаем класс при клике на бургер (открыть/закрыть)
    burgerBtn.addEventListener("click", () => {
      menuWindow.classList.toggle("header__menu--active");
    });
    // Закрываем шторку автоматически, когда кликнули на любую ссылку
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuWindow.classList.remove("header__menu--active");
      });
    });
  }
  /* ========= 4.SMOOTH SCROLL (Плавная навигация по секциям) =====  */
  const links = document.querySelectorAll(".header__link, .btn");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offserTop - 60,
            behavior: "smooth",
          });
        }
      }
    });
  });
});
/* =========================== 5. Scroll reveal ========================== */
const revealSections = () => {
  const sections = document.querySelectorAll(".reveal");

  sections.forEach((section) => {
    const windowHeight = window.innerHeight;
    const elementTop = section.getBoundingClientRect().top;
    const elementVisible = 200;
    if (elementTop < windowHeight - elementVisible) {
      section.classList.add("reveal--active");
    }
  });
};

window.addEventListener("scroll", revealSections); // Сразу проверяем видимость при загрузке
/* ====================== 6. Animate number (Бегущие циры в статистике) ======================== */
const animateNumbers = () => {
  const stats = document.querySelectorAll(".stat-item__number");

  stats.forEach((counter) => {
    // защита от NAn: вытаскиваем только чистые цифры из атрибута
    const targetAttr = counter.getAttribute("data-target");
    const target = parseInt(targetAttr.replace(/\D/g, ""), 10);
    if (isNaN(target)) return;
    const duration = 12500; // Анимация длится 2.5 секунд
    const frameRate = 1000 / 60; // 60 кадров в секунду
    const totalFrames = Math.round(duration / frameRate);
    let currentFrame = 0;

    const updateCount = () => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easeProgress = progress * (2 - progress); // Плавное замедление
      const currentCount = Math.ceil(easeProgress * target);
      if (currentFrame < totalFrames) {
        counter.innerText = currentCount;
        setTimeout(updateCount, frameRate);
      } else {
        counter.innerText = target + "+"; // В конце добавляем плюс
      }
    };
    updateCount();
  });
};
/* ========================= 7. Intersection observer(тригер ддля запуска анимации цир) =========================== */
const statsSection = document.querySelector(".about__stats");
if (statsSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateNumbers();
        observer.unobserve(statsSection); // Выключаем слежку после запуска
      }
    },
    { threshold: 0.2 },
  );
  observer.observe(statsSection);
}
