document.addEventListener('DOMContentLoaded', () => {
  //====================================
  // 1. Бургер-меню
  //=====================================
  const burgerBtn = document.querySelector('.header__burger');
  const navWrapper = document.querySelector('.header__nav-wrapper');
  const navLinks = document.querySelectorAll('.nav-menu__link');
  const closeBtn = document.querySelector('.header__nav-close');

  // Открытие / закрытие по клику на бургер
  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      navWrapper.classList.toggle('is-active');
      document.body.classList.toggle('page__body_lock');
    });
  }

  // Закрытие по клику на крестик
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            navWrapper.classList.remove('is-active');
            document.body.classList.remove('page__body_lock');
        });
    }

  // Закрытие меню при клике на любую ссылку
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navWrapper) {
        navWrapper.classList.remove('is-active');
      }
      document.body.classList.remove('page__body_lock');
    });
  });

  //========================================
  // 2. Sticky / Fixed Header
  //========================================
  const header = document.querySelector('.header');

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('header_scrolled');
      } else {
        header.classList.remove('header_scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
  }

  //===================================
  // 3. Плавный скролл к якорям
  //=====================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          event.preventDefault();

          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  //=====================================
  // 4. Кнопка прокрутки наверх (.btn-scroll-top)
  //=====================================
  const scrollTopBtn = document.querySelector('.btn-scroll-top');

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  //=====================================
  // 5. Модальное окно
  //=====================================
  const modal = document.querySelector('.modal');
  const modalOpenBtns = document.querySelectorAll('.button_type_open-modal');
  const modalCloseBtn = document.querySelector('.modal__close');

  if (modal) {
    const openModal = () => {
      modal.classList.add('modal_is-open');
      document.body.classList.add('page__body_lock');
    };

    const closeModal = () => {
      modal.classList.remove('modal_is-open');
      document.body.classList.remove('page__body_lock');
    };

    modalOpenBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('modal_is-open')) {
        closeModal();
      }
    });
  }
  //==========================================
  // 6. reveal Плавное появление 
  //==========================================
  // Находим все элементы с классom reveal
  const reveals = document.querySelectorAll('.reveal');
  // Настройки наблюдения
  const obsOptions = {
    root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px"
  };
  // Функция, которая выполняется, когда элемент пересекает границу
  const observerCallback = function (entries, observer) {
    entries.forEach(entry => {
      // Если элемент попал в область видимости
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal_active');
      } else {
        entry.target.classList.remove('reveal_active');
      }
    });
  };
  // Создаем сам наблюдатель 
  const observer = new IntersectionObserver(observerCallback, obsOptions);
  // Запускаем наблюдение за каждой найденной секцией
  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
});