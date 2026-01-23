let slideIndex = 1;
let currentImages = [];
// --- 1. Открытие галереи ---
function openGallery(imagePaths, captions) {
  currentImages = imagePaths;
  //Получаем контейнеры
  const sliderContainer = document.getElementById("slider-container");
  const thumbnailRow = document.getElementById("thumbnail-row");
  // Очищаем старые слайды и миниатюры
  sliderContainer.innerHTML = "";
  thumbnailRow.innerHTML = "";
  // --- 2. Генерация слайдов и миниатюр ---
  for (let i = 0; i < currentImages.length; i++) {
    const imagePath = currentImages[i];
    const caption = captions[i] || `Фото ${i + 1}`;
    const slideDiv = document.createElement("div");
    slideDiv.className = "mySlides";
    slideDiv.innerHTML = `<div class="numbertext">${i + 1} / ${
      currentImages.length
    }</div> <img src="${imagePath}" style="width:100%"> `;
    sliderContainer.appendChild(slideDiv);
    //Создаем Миниатюру
    const columnDiv = document.createElement("div");
    columnDiv.className = "column";
    columnDiv.innerHTML = `<img class="demo cursor" src="${imagePath}" style="width:100%" onclick="currentSlide(${
      i + 1
    })" alt="${caption}"> `;
    thumbnailRow.appendChild(columnDiv);
  }
  // --- 3. Показываем модальное окно и перевый слайд
  document.getElementById("myModal").style.display = "block";
  setTimeout(function () {
    showSlides(slideIndex);
  }, 50);
}
// --- 4. Функции управления Слайдером ---
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
function plusSlides(n) {
  showSlides((slideIndex += n));
}
function currentSlide(n) {
  showSlides((slideIndex = n));
}
function showSlides(n) {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("demo");
  const captionText = document.getElementById("caption");
  // Проверка границ
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  // Скрываем, отображаем
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  if (slides.length > 0) {
    slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0) {
      for (let i = 0; i < dots.length; i++) {
        dots[i].className.replace(" active", "");
      }
      dots[slideIndex - 1].className += " active";
      //Проверка для избежания ошибок
      const captionText = document.getElementById("caption");
      captionText.innerHTML = dots[slideIndex - 1].alt;
    }
  }
}
