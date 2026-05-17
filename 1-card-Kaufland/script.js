//==============================================================================
//===============================================================================
// 1. Глобальные Данные (имитация базы данных)
const products = [
  {
    id: 1,
    name: "Okurky (Огурцы) (кг)",
    price: 19.9,
    oldPrice: 29.9, // старая цена
    category: "zelenina",
    img: "https://cdn-icons-png.flaticon.com/512/2329/2329865.png",
  },
  {
    id: 2,
    name: "Vepřová krkovice (Свинина)",
    price: 119.9,
    oldPrice: 189.9, // старая цена
    unit: "1kg",
    lastUpdated: "14.05.2026",
    category: "Maso",
    img: "https://cdn-icons-png.flaticon.com/512/1041/1041315.png",
  },
  {
    id: 3,
    name: "Mléko 1,5% (молоко)",
    price: 14.9,
    category: "Mléčné výrobky",
    img: "https://cdn-icons-png.flaticon.com/512/2405/2405479.png",
  },
  {
    id: 4,
    name: "Cigarety (сигареты)",
    price: 154.0,
    category: "18+",
    isRestricted: true,
    img: "https://cdn-icons-png.flaticon.com/512/2825/2825644.png",
  },
  {
    id: 5,
    name: "Máslo K-Classic (Масло)",
    price: 39.9,
    unit: "250g",
    lastUpdated: "14.05.2026",
  },
];

let cart = JSON.parse(localStorage.getItem("kaufland_cart")) || []; // Это значит возьми данные из памяти

// И сразу после этого вызови обновление
updateCartUI();
// ================================================================================
//=================================================================================
// 2. Функция отрисовки  (Интерфейс)
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
    <p class="card__price">${product.price}Kč</p>
    <button class="card__button" onclick="addToCart(${product.id})">В корзину</button>
    `;
    grid.appendChild(productCard);
  });
}
//=====================================================================================

//=====================================================================================
function updateCartUI() {
  // обновляем список внутри модалки
  const itemsContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  itemsContainer.innerHTML = ``;

  let total = 0;
  let totalItems = 0;
  let savings = 0; // Новая переменая для экономии

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
  <span>${itemTotal.toFixed(2)}Kč</span>
  <button class="delete-btn" onclick="removeFromCart(${index})" style="background:none; border:none; color:red; margin-left:10px; cursor:pointer;">
  &times;</button>
  </div>
  </div>
  `;
  });
  totalContainer.innerText = `${total.toFixed(2)}`;
  cartCount.innerText = totalItems;
  saveCart();
}
//===================================================================================
//==================================================================================
// 3. Логика работы корзины (Действия)
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
//======================================================================================
function removeFromCart(index) {
  // Удаляем 1 елемент по индексу
  cart.splice(index, 1);
  // Сразу обновляем интерфейс, чтобы товар исчез
  updateCartUI();
}
//=======================================================================================
function clearCart() {
  if (confirm("opravdu chcete vymazat cely kosik?")) {
    cart = [];
    updateCartUI();
  }
}
//======================================================================================
function toggleCart() {
  const modal = document.getElementById("cart-modal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

//======================================================================================
//=======================================================================================
// 4. Инструменты фильтрации и поиска
function searchProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  // Фильтруем
  const filteredProducts = products.filter((product) => {
    // Переводим имя товара
    const productName = product.name.toLowerCase();
    //Проверяем, входит ли поисковое слово в название
    return productName.includes(searchTerm);
  });

  renderProducts(filteredProducts);
}
//=======================================================================================
function filterByCategory(categoryName) {
  if (categoryName === "all") {
    //Если выбрано Все, просто рисуем все товары
    renderProducts(products);
  } else {
    //Фильтруем масив: оставляем только те товары, у которых категория совпадает с нажатой кнопкой
    const filtered = products.filter(
      (product) => product.category === categoryName,
    );
    renderProducts(filtered);
  }
}
// Запускаем приложение
renderProducts();

//======================================================================================
//=======================================================================================
// 5. Сохранение и финал
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
    `Спасибо за заказ! сумма к оплате: ${total.toFixed(2)}Kč. Ваш чек сохранен.`,
  );

  //очищаем корзину в коде
  cart = [];

  // Обновляем интерфейс (это автоматически сохранит пустую корзину в память)
  updateCartUI();

  // Закрываем модальное окно
  toggleCart();
}
//===================================================================
//                    ЛОГИКА БЛОКНОТА ЗАМЕТОК
//==================================================================
// ==== 1. Создаем отделный масив
// Звгружаем сохраненные заметки, а если в памяти пусть - создаем чисты ма
let notes = JSON.parse(localStorage.getItem("myShoppingNotes")) || [];

// ==== 2. Функция добавления новой заметки
function addNote() {
  const noteInput = document.getElementById("noteInput");
  const noteText = noteInput.value.trim(); // trim() - убирает случаные побелы
  // Проверяем, что поле не пустое
  if (noteText === "") {
    alert("Napište text poznámky!(Напишите текст заметки!)");
    return;
  }
  //Добаляем текс заметки в наш массив
  notes.push(noteText);
  // Очищаем поле ввода, чтобы оно было готово для новой записи
  noteInput.value = "";
  //Отрисовываем обновленный список на экране
  renderNotes();
}
// 3. Функция Художник - выводит заметки на экран
function renderNotes() {
  const notesList = document.getElementById("note-list");

  if (!notesList) return; // Защита: если список не найден, останавливаем код
  // Полностью очищаем старый список перед перерисовкой
  notesList.innerHTML = "";
  //Проходимся по массиву заметок циклом
  notes.forEach((note, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
  <span>${note}</span>
  <button class="delete-note-btn"
   onclick="deleteNote(${index})">x</button>
  `;
    notesList.appendChild(li);
  });
  // Сохранение: Переводим массив заметок в текст и записываем в память
  localStorage.setItem("myShoppingNotes", JSON.stringify(notes));
}
// 4. Функция удаления конкретной заметки
function deleteNote(index) {
  // Удаляем 1 элемент из массива по его индексу
  notes.splice(index, 1);
  //Переписываем список, чтобы удаленная заметка исчезла
  renderNotes();
}
renderNotes();
