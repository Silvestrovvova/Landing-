let currentIndex = 0;
const images = document.querySelectorAll(".gallery-item img");

function openModal(element) {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("imgFull");

  // Находим индекс нажатой картинки
  const clickedImg = element.querySelector("img");
  currentIndex = Array.from(images).indexOf(clickedImg);

  modal.style.display = "flex";
  modalImg.src = clickedImg.src;
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

// Функция для переключения фото
function changeImage(step) {
  currentIndex += step;
  if (currentIndex >= images.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = images.length - 1;
  document.getElementById("imgFull").src = images[currentIndex].src;
}

// Логика свайпа для телефона
let touchstartX = 0;
let touchendX = 0;

const modal = document.getElementById("myModal");
modal.addEventListener(
  "touchstart",
  (e) => (touchstartX = e.changedTouches[0].screenX),
);
modal.addEventListener("touchend", (e) => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
});

function handleGesture() {
  if (touchendX < touchstartX - 50) changeImage(1); // Свайп влево -> след. фото
  if (touchendX > touchstartX + 50) changeImage(-1); // Свайп вправо -> пред. фото
}
