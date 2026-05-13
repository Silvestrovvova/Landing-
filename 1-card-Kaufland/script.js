// 1. Данные (имитация базы данных)
const products = [
  {
    id: 1,
    name: "Огурцы (кг)",
    price: 0.89,
    category: "Овощи",
    img: "https://cdn-icons-png.flaticon.com/512/2329/2329865.png",
  },
  {
    id: 2,
    name: "Говядина стейк",
    price: 12.5,
    category: "Мясо",
    img: "https://cdn-icons-png.flaticon.com/512/1041/1041315.png",
  },
  {
    id: 3,
    name: "Молоко 1,5%",
    price: 1.15,
    category: "Молочные",
    img: "https://cdn-icons-png.flaticon.com/512/2405/2405479.png",
  },
  {
    id: 4,
    name: "Сигареты",
    price: 8.2,
    category: "18+",
    isRestricted: true,
    img: "https://cdn-icons-png.flaticon.com/512/2825/2825644.png",
  },
];

let cart = JSON.parse(localStorage.getItem("kaufland_cart")) || []; // Это значит возьми данные из памяти

// И сразу после этого вызови обновление
updateCartUI();
// ================================================================================
// 2. Функция отрисовки товаров (теперь она универсальная)
function renderProducts(list = products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  list.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "card";
    productCard.innerHTML = `
    <img src="${product.img}" alt="${product.name}" class="card__image">
    <small style="color: ${product.isRestricted ? "red" : "gray"}; font-weight: bold;"> ${product.category}</small>
    <h3>${product.name}
    <p class="card__price">${product.price}€</p>
    <button class="card__button" onclick="addToCart(${product.id})">В корзину</button>
    `;
    grid.appendChild(productCard);
  });
}
//===================================================================================
// 3. Логика корзины
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  // Проверка на категорию 18+
  if (product.isRestricted) {
    const confirmAge = confirm(
      `Товар ${product.name} только для лиц старше 18 лет. Вам есть 18?`,
    );
    if (!confirmAge) {
      alert("Ивините, мы не можем продать этот товар.");
      return; //Прерываем функцию, в корзину ничего не попадает
    }
  }

  // Ищем, есть ли уже такой товар в корзине
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    // Если есть -увеличиваем счетчик
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}
//=====================================================================================
function updateCartUI() {
  // обновляем список внутри модалки
  const itemsContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  itemsContainer.innerHTML = ``;

  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity; // считываем сумму за позицию

    total += itemTotal;
    totalItems += item.quantity;

    itemsContainer.innerHTML += `
  <div class="cart-item">
  <div class="cart-item__info">
  <span>${item.name}</span>
  <div class="cart-item__controls">
  <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
  <span class="qty-num">${item.quantity}</span>
  <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
  </div>
  </div>
  <div class="cart-item__price">
  <span>${itemTotal.toFixed(2)}€</span>
  <button class="delete-btn" onclick="removeFromCart(${index})" style="background:none; border:none; color:red; margin-left:10px; cursor:pointer;">
  &times;</button>
  </div>
  </div>
  `;
  });
  totalContainer.innerText = `${total.toFixed(2)}€`;
  cartCount.innerText = totalItems;
  saveCart();
}
//======================================================================================
function toggleCart() {
  const modal = document.getElementById("cart-modal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}
//======================================================================================
function removeFromCart(index) {
  // Удаляем 1 елемент по индексу
  cart.splice(index, 1);
  // Сразу обновляем интерфейс, чтобы товар исчез
  updateCartUI();
}
//=======================================================================================
// Логика Поиска
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", (e) => {
  const text = e.target.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(text),
  );

  renderProducts(filteredProducts); // Переписываем только найденое
});
//=======================================================================================
function saveCart() {
  localStorage.setItem("kaufland_cart", JSON.stringify(cart));
}
//=======================================================================================
// Функция оформления заказа
function checkout() {
  if (cart.length === 0) {
    alert("Ваша корзина пуста!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  //Вывоим финальное сообщение
  alert(
    `Спасибо за заказ! сумма к оплате: ${total.toFixed(2)}€. Ваш чек сохранен.`,
  );

  //очищаем корзину в коде
  cart = [];

  // Обновляем интерфейс (это автоматически сохранит пустую корзину в память)
  updateCartUI();

  // Закрываем модальное окно
  toggleCart();
}
//=======================================================================================
// Функция изменения количества
function changeQuantity(index, delta) {
  // delta может быть +1 или -1
  cart[index].quantity += delta;

  // Если количество стало 0 или меньше - удаляем товар совсем
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCartUI();
}
//=======================================================================================
// Запускаем приложение
renderProducts();
