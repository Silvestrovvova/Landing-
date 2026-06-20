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

  /*========= 3. Smooth Scroll (Плавныи скролл для всех якорных сыллок и кнопок) ========== */
  // Добавили в выборку и кнопки ссылки из Hero (button --secondary, button--primary)
  const smoothLinks = document.querySelectorAll(
    ".header__link, .button--primary, .button--secondary",
  );
  smoothLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  /* ============ 4. FAQ Accordion (Надежное закрытие других спойлеров) ============== */
  const faqSummaries = document.querySelectorAll(".faq__summary");

  faqSummaries.forEach((summary) => {
    summary.addEventListener("click", (e) => {
      const currentDetails = summary.parentElement;
      // Если собираемся отрыть этот споилер
      if (!currentDetails.open) {
        document.querySelectorAll(".faq__details").forEach((details) => {
          if (details !== currentDetails) {
            details.open = false; // Закрываем все остальное
          }
        });
      }
    });
  });

  /* ======= 5. TimeLine Item Delay =========*/
  const timelineItems = document.querySelectorAll(".timeline__item");
  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.3}s`; //0.3s комфортнее
  });

  /* ========== 6. Scroll Reveal (Плавное появление секции) =================== */
  let numbersAnimated = false; // флаг, чтобы цифры крутились 1 раз

  const revealSections = () => {
    const sections = document.querySelectorAll(".reveal");

    sections.forEach((section) => {
      const windowHeight = window.innerHeight;
      const elementTop = section.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        section.classList.add("reveal--active");
        // Интеграция: если активировалась секция , запускаем цифры
        if (section.classList.contains("about") && !numbersAnimated) {
          animateNumbers();
          numbersAnimated = true;
        }
      }
    });
  };

  window.addEventListener("scroll", revealSections);
  revealSections();

  /* ============ 7. Animate Numbers (бегущие цифры - исправлено время) ============== */
  function animateNumbers() {
    const stats = document.querySelectorAll(".stat-item__number");

    stats.forEach((counter) => {
      const targetAttr = counter.getAttribute("data-target");
      if (!targetAttr) return;

      const target = parseInt(targetAttr.replace(/\D/g, ""), 10);
      if (isNaN(target)) return;

      const duration = 2500; // cекунды появления проектов
      const frameRate = 1000 / 60;
      const totalFrames = Math.round(duration / frameRate);
      let currenFrame = 0;

      const updateCount = () => {
        currenFrame++;
        const progress = currenFrame / totalFrames;
        const easeProgress = progress * (2 - progress);
        const currentCount = Math.ceil(easeProgress * target);

        if (currenFrame < totalFrames) {
          counter.innerText = currentCount;
          setTimeout(updateCount, frameRate);
        } else {
          counter.innerText = target + "+";
        }
      };

      updateCount();
    });
  }

  /* ============  ============*/
});
