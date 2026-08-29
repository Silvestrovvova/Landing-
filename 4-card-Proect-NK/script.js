document.addEventListener("DOMContentLoaded", () => {
  //====================================
  // 1. Бургер-меню
  //=====================================
  const burgerBtn = document.querySelector(".header__burger");
  const navWrapper = document.querySelector(".header__nav-wrapper");
  const navLinks = document.querySelectorAll(".nav-menu__link");
  const closeBtn = document.querySelector(".header__nav-close");

  if (burgerBtn) {
    burgerBtn.addEventListener("click", () => {
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

  //========================================
  // 2. Sticky / Fixed Header
  //========================================
  const header = document.querySelector(".header");

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("header_scrolled");
      } else {
        header.classList.remove("header_scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
  }

  //===================================
  // 3. Плавный скролл к якорям
  //=====================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          event.preventDefault();

          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
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

  //=====================================
  // 5. Модальное окно
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

  //==========================================
  // 6. Reveal Плавное появление
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
  // 7. Логика мультиязычности (Перевод)
  //==========================================
  const defaultLang = "cz";

  function setLanguage(lang) {
    if (!window.translations || !window.translations[lang]) return;
    document.documentElement.lang = lang;

    // 1. Меняем текст у всех элементов с data-i18n
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (window.translations[lang][key]) {
        el.innerHTML = window.translations[lang][key];
      }
    });

    // 2. Обновляем плашку с текущим языком (напр. CZ) во всех кнопках
    document.querySelectorAll(".header__lang-current").forEach((el) => {
      el.textContent = lang.toUpperCase();
    });

    // 3. Подсвечиваем активный язык в списке
    document.querySelectorAll(".header__lang-link").forEach((btn) => {
      btn.classList.toggle("header-link--active", btn.dataset.lang === lang);
    });

    // 4. Сохраняем язык в браузере
    localStorage.setItem("preferred_lang", lang);
  }

  // Делегирование событий для переключателя языков
  document.addEventListener("click", (e) => {
    // Выбор языка
    const langBtn = e.target.closest(".header__lang-link");
    if (langBtn) {
      const selectedLang = langBtn.dataset.lang;
      setLanguage(selectedLang);
      document
        .querySelectorAll(".header__lang")
        .forEach((el) => el.classList.remove("is-open"));
      return;
    }

    // Открытие/закрытие списка языков
    const toggleBtn = e.target.closest(".header__lang-btn");
    if (toggleBtn) {
      const parent = toggleBtn.closest(".header__lang");
      parent.classList.toggle("is-open");
      return;
    }

    // Закрытие выпадающего списка при клике мимо
    if (!e.target.closest(".header__lang")) {
      document
        .querySelectorAll(".header__lang")
        .forEach((el) => el.classList.remove("is-open"));
    }
  });

  // Загружаем сохраненный язык при загрузке страницы
  const savedLang = localStorage.getItem("preferred_lang") || defaultLang;
  setLanguage(savedLang);
});
