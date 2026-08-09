document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.querySelector('.header__burger');
    const navMenu = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__link');

    if (burgerBtn & navMenu) {
        //Переключение состояния по клику на бургер
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('header__nav_active');
            navMenu.classList.toggle('header__nav_active');
            document.body.classList.toggle('page__body_lock');// запрет покрутки фотки 
        });
        // Закрытие меню при клике на любую из ссылок
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('header__burger_active');
                navMenu.classList.remove('header__nav_active');
                document.body.classList.remove('page__body_lock');
            });
        });
        }
});