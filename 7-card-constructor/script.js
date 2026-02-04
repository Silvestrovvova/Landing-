let currentIndex = 0;
const images = document.querySelectorAll(".gallery-item img");

function updateCounter() {
  const counterElement = document.getElementById("photo-counter");
  counterElement.innerText = `${currentIndex + 1} / ${images.length}`;
}

function openModal(element) {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("imgFull");

  // Находим индекс нажатой картинки
  const clickedImg = element.querySelector("img");
  currentIndex = Array.from(images).indexOf(clickedImg);

  modal.style.display = "flex";
  modalImg.src = clickedImg.src;
  updateCounter();
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
  updateCounter();
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

document.addEventListener("keydown", function (event) {
  const modal = document.getElementById("myModal");
  if (modal.style.display === "flex") {
    if (event.key === "ArrowLeft") {
      changeImage(-1);
    } else if (event.key === "ArrowRight") {
      changeImage(1);
    } else if (event.key === "Escape") {
      closeModal();
    }
  }
});
