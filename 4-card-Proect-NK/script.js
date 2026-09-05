document.addEventListener("DOMContentLoaded", () => {
  //====================================
  // 1. Бургер-меню
  //=====================================
  const burgerBtn = document.querySelector(".header__burger");
  const navWrapper = document.querySelector(".header__nav-wrapper");
  const navLinks = document.querySelectorAll(".nav-menu__link");
  const closeBtn = document.querySelector(".header__nav-close");

  if (burgerBtn) {
    burgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navWrapper.classList.toggle("is-active");
      document.body.classList.toggle("page__body_lock");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      navWrapper.classList.remove("is-active");
      document.body.classList.remove("page__body_lock");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navWrapper) {
        navWrapper.classList.remove("is-active");
      }
      document.body.classList.remove("page__body_lock");
    });
  });

  // Закрытие при клике вне области бургер меню
  document.addEventListener("click", (e) => {
    // Проверяем, открыто ли менб
    if (
      navWrapper &&
      navWrapper.classList.contains("is-active") &&
      !navWrapper.contains(e.target) &&
      !burgerBtn.contains(e.target)
    ) {
      navWrapper.classList.remove("is-active");
      document.body.classList.remove("page__body_lock");
    }
  });

  //========================================
  // 2. Sticky / Fixed Header
  //========================================
  const header = document.querySelector(".header");

  if (header) {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Фиксируем шапку при прокрутке ниже 50px
      if (currentScrollY > 50) {
        header.classList.add("header_scrolled");
      } else {
        header.classList.remove("header_scrolled");
      }

      // 2. Логика скрытия/показа при скролле вверх/вниз
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скроллим вниз — прячем шапку
        header.classList.add("header_hidden");
      } else {
        // Скроллим вверх — показываем шапку
        header.classList.remove("header_hidden");
      }

      // Запоминаем текущее положение
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
  }

  //=====================================
  // 3. Плавный скролл к якорям (CSS-подход)
  //=====================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Если шапка была скрыта при скролле вниз, показываем её
          if (header && header.classList.contains("header_hidden")) {
            header.classList.remove("header_hidden");
          }

          // Если открыто бургер-меню — закрываем его
          if (navWrapper && navWrapper.classList.contains("is-active")) {
            navWrapper.classList.remove("is-active");
            document.body.classList.remove("page__body_lock");
          }
          
          // Сам скролл браузер выполнит автоматически благодаря CSS!
        }
      }
    });
  });

  //=====================================
  // 4. Кнопка прокрутки наверх (.btn-scroll-top)
  //=====================================
  const scrollTopBtn = document.querySelector(".btn-scroll-top");

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  //==========================================
  // 5. Reveal Плавное появление
  //==========================================
  const reveals = document.querySelectorAll(".reveal");
  const obsOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observerCallback = function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal_active");
      } else {
        entry.target.classList.remove("reveal_active");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, obsOptions);
  reveals.forEach((reveal) => {
    observer.observe(reveal);
  });

  //==========================================
  // 6.Логика мультиязычности и работы меню
  //==========================================
  const defaultLang = "cz";

  function setLanguage(lang) {
    // Проверяем наличие словаря переводов
    if (!window.translations || !window.translations[lang]) {
      console.warn(`Переводы для языка "${lang}" не найдены в window.translations`);
      return;
    }

    document.documentElement.lang = lang;

    // 1. Меняем текст у всех элементов с data-i18n
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (window.translations[lang][key]) {
        el.innerHTML = window.translations[lang][key];
      }
    });

    // 2. Обновляем текст текущего языка во всех кнопках
    document.querySelectorAll(".header__lang-current").forEach((el) => {
      el.textContent = lang.toUpperCase();
    });

    // 3. Подсвечиваем активный язык в меню
    document.querySelectorAll(".header__lang-link").forEach((btn) => {
      btn.classList.toggle("header-link--active", btn.dataset.lang === lang);
    });

    // 4. Сохраняем выбранный язык
    localStorage.setItem("preferred_lang", lang);
  }

  // Единый обработчик кликов
  document.addEventListener("click", (e) => {
    const langBtn = e.target.closest(".header__lang-link");
    const toggleBtn = e.target.closest(".header__lang-btn");

    // 1. Клик по конкретному языку (CZ, RU, EN)
    if (langBtn) {
      const selectedLang = langBtn.dataset.lang;
      setLanguage(selectedLang);

      // Закрываем выпадающий список после выбора
      document.querySelectorAll(".header__lang").forEach((el) => {
        el.classList.remove("is-open");
      });
      return;
    }

    // 2. Клик по кнопке открытия/закрытия списка
    if (toggleBtn) {
      const parent = toggleBtn.closest(".header__lang");
      if (parent) {
        parent.classList.toggle("is-open");
      }
      return;
    }

    // 3. Клик мимо блока языков — закрываем список
    if (!e.target.closest(".header__lang")) {
      document.querySelectorAll(".header__lang").forEach((el) => {
        el.classList.remove("is-open");
      });
    }
  });

  // Загружаем сохраненный язык при старте
  document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("preferred_lang") || defaultLang;
    setLanguage(savedLang);
  });
  // Добавляем автоматическое закрытие при уводе мыши с контейнера
  document.querySelectorAll(".header__lang").forEach((container) => {
    container.addEventListener("mouseleave", () => {
      container.classList.remove("is-open");
    });
  });
  /*====================================================== 
    //=====================================
  // . Модальное окно если понадобиться
  //=====================================
  const modal = document.querySelector(".modal");
  const modalOpenBtns = document.querySelectorAll(".button_type_open-modal");
  const modalCloseBtn = document.querySelector(".modal__close");

  if (modal) {
    const openModal = () => {
      modal.classList.add("modal_is-open");
      document.body.classList.add("page__body_lock");
    };

    const closeModal = () => {
      modal.classList.remove("modal_is-open");
      document.body.classList.remove("page__body_lock");
    };

    modalOpenBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("modal_is-open")) {
        closeModal();
      }
    });
  }
  ======================================================   */

});
