document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".project-card");
  const follower = document.querySelector(".cursor-follower");
  const hero = document.querySelector(".hero");

  // 1. ПЛАВНОЕ ПОЯВЛЕНИЕ HERO (Заголовка)
  if (hero) {
    setTimeout(() => {
      hero.classList.add("is-visible");
    }, 200);
  }

  // 2. КАСТОМНЫЙ КУРСОР
  // Сначала прячем, чтобы не прыгал из угла
  follower.style.opacity = "0";

  document.addEventListener("mousemove", (e) => {
    follower.style.opacity = "1";
    requestAnimationFrame(() => {
      // Центрируем за счет translate3d (самый быстрый способ)
      follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });
  });

  // 3. ИНДИКАТОР СКРОЛЛА (Полоска сверху)
  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const progressBar = document.querySelector(".scroll-progress");
    if (progressBar) {
      progressBar.style.width = scrolled + "%";
    }
  });

  // 4. ЛОГИКА КАРТОЧЕК (3D Наклон и Spotlight)
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Наклон (Tilt)
      const rotateX = (((y - centerY) / centerY) * -12).toFixed(2);
      const rotateY = (((x - centerX) / centerX) * 12).toFixed(2);

      // Передаем координаты для CSS (световое пятно)
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // Применяем 3D трансформацию
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Увеличиваем курсор при наведении
      follower.classList.add("cursor-active");
    });

    card.addEventListener("mouseleave", () => {
      // Возвращаем в исходное состояние
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      follower.classList.remove("cursor-active");
    });
  });

  // 5. АНИМАЦИЯ ПОЯВЛЕНИЯ КАРТОЧЕК ПРИ СКРОЛЛЕ
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => observer.observe(card));
});
