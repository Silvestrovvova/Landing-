document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. STICKY HEADER & PROGRESS BAR
       ========================================================================== */
  let lastScrollY = window.scrollY;
  let accumulatedSubida = 0;
  const smartHeader = document.querySelector(".header");
  const progressBar = document.querySelector(".progress-bar");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;

    // Полоса прогресса чтения
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    if (windowHeight > 0) {
      const scrolled = (window.scrollY / windowHeight) * 100;
      if (progressBar) progressBar.style.width = scrolled + "%";
    }

    // Логика скрытия шапки
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

  /* ==========================================================================
       2. MOBILE MENU & BODY SCROLL LOCK
       ========================================================================== */
  const burgerBtn = document.querySelector(".header__burger");
  const menuWindow = document.querySelector(".header__menu");
  const menuLinks = document.querySelectorAll(".header__link");

  if (burgerBtn && menuWindow) {
    burgerBtn.addEventListener("click", () => {
      menuWindow.classList.toggle("header__menu--active");
      // Если меню открыто — запрещаем скроллить сайт на фоне
      document.body.style.overflow = menuWindow.classList.contains(
        "header__menu--active",
      )
        ? "hidden"
        : "";
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuWindow.classList.remove("header__menu--active");
        document.body.style.overflow = ""; // Возвращаем скролл при переходе
      });
    });
  }

  /* ==========================================================================
       3. SMOOTH SCROLL
       ========================================================================== */
  const smoothLinks = document.querySelectorAll(
    ".header__link, .button--primary, .button--secondary, .cta__button",
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

  /* ==========================================================================
       4. FAQ ACCORDION
       ========================================================================== */
  const faqSummaries = document.querySelectorAll(".faq__summary");

  faqSummaries.forEach((summary) => {
    summary.addEventListener("click", () => {
      const currentDetails = summary.parentElement;
      if (!currentDetails.open) {
        document.querySelectorAll(".faq__details").forEach((details) => {
          if (details !== currentDetails) {
            details.open = false;
          }
        });
      }
    });
  });

  /* ==========================================================================
       5. TIMELINE ITEMS DELAY
       ========================================================================== */
  const timelineItems = document.querySelectorAll(".timeline__item");
  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.3}s`;
  });

  /* ==========================================================================
       6. SCROLL REVEAL
       ========================================================================== */
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

  /* ==========================================================================
       7. ANIMATE NUMBERS (Время изменено на оптимальные 2 секунды)
       ========================================================================== */
  const animateNumbers = () => {
    const stats = document.querySelectorAll(".stat-item__number");

    stats.forEach((counter) => {
      const targetAttr = counter.getAttribute("data-target");
      if (!targetAttr) return;

      const target = parseInt(targetAttr.replace(/\D/g, ""), 10);
      if (isNaN(target)) return;

      const duration = 2000; // 2000мс = 2 секунды (плавная комфортная анимация)
      const frameRate = 1000 / 60;
      const totalFrames = Math.round(duration / frameRate);
      let currentFrame = 0;

      const updateCount = () => {
        currentFrame++;
        const progress = currentFrame / totalFrames;
        const easeProgress = progress * (2 - progress);
        const currentCount = Math.ceil(easeProgress * target);

        if (currentFrame < totalFrames) {
          counter.innerText = currentCount;
          setTimeout(updateCount, frameRate);
        } else {
          counter.innerText = target + "+";
        }
      };

      updateCount();
    });
  };

  /* ==========================================================================
       8. INTERSECTION OBSERVER FOR STATS
       ========================================================================== */
  const statsSection = document.querySelector(".about__stats");

  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateNumbers();
          observer.unobserve(statsSection);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(statsSection);
  }
  /* ================  ========================== */
});
