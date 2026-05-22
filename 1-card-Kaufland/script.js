//==============================================================================
// Инициация хранилища данных из localStorage на самом старте
//=============================================================================
let cart = JSON.parse(localStorage.getItem("kaufland_cart")) || []; // Это значит возьми данные из памяти
let notes = JSON.parse(localStorage.getItem("myShoppingNotes")) || [];
let purchaseHistory =
  JSON.parse(localStorage.getItem("shopPurchaseHistory")) || [];
let editNoteIndex = null; //хранит индекс заметки, которую мы изменяем
let currentReceiptText = ""; // Переменная для хранения текстовои версии чека

// И сразу после этого вызови обновление
updateCartUI();
// ================================================================================
// 2. Функция отрисовки  (Интерфейс)
//==================================================================================
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
function updateCartUI() {
  // обновляем список внутри модалки
  const itemsContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  itemsContainer.innerHTML = ``;

  if (!itemsContainer || !totalContainer || !cartCount) return;
  itemsContainer.innerHTML = "";

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
// 3. Логика работы корзины (Действия)
//==================================================================================
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
  if (!modal) return;
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}
//======================================================================================
function saveCart() {
  localStorage.setItem("kaufland_cart", JSON.stringify(cart));
}
//=======================================================================================
// 4. Инструменты фильтрации и поиска
//=======================================================================================
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
      (product) => product.category === categoryName.toLowerCase(),
    );
    renderProducts(filtered);
  }
}
//=======================================================================================
// Функция оформления заказа
//=======================================================================================
function checkout() {
  // Если корзина пустая, ничего не делаем
  if (cart.length === 0) {
    alert("Vaše nákupni košik je prázdný! (Ваша корзина пуста!)");
    return;
  }
  /*========= 1. считаем финальную сумму корзины прямо сеичас ======== */
  const finalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  /* ======= 2. Получаем финальную сумму корзины прямо сейчас ======*/
  const now = new Date();
  const formattedDate =
    now.toLocaleDateString("cs-CZ") +
    " " +
    now.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
  /* ======= 3. Создаем обьект покупки и добавляем в масив истории =====*/
  purchaseHistory.push({
    date: formattedDate,
    amount: finalAmount,
  });
  /* ======== 4.Обновляем блок истории на экране ============== */
  renderHistory();
  // ГЕНЕРИРУЕМ ВИЗУАЛЬНЫИ ЧЕК
  const receiptBody = document.getElementById("receipt-body");
  //Начинаем собирать текстовую версию
  currentReceiptText = `=== KAUFLAND Učtenka ===\nDatum: ${formattedDate}\n--------------\n`;
  // Собираем HTML структуру для экрана
  let htmlContent = `
  <div class="receipt-modal__line"><strong>Kaufland Czechia</strong></div>
  <div class="receipt-modal__line"><span>Datum:</span>${formattedDate}</span></div>
  <div class="receipt-modal__divider"></div>
  `;
  // Циклом перебираем товары из корзины и добавляем в чек
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    // HTML строка для модалки
    htmlContent += `
    <div class="receipt-modal__line">
    <span>${item.name}</span>
    </div>
    <div class="receipt-modal__line" style="padding-left: 10px; color: #555; font-size: 0.85rem;">
    <span>${item.quantity}x ${item.price.toFixed(2)} Kč</span>
    <span>${itemTotal.toFixed(2)} Kč</span>
    </div>
    `;
    // Текстовая строка для буфнра обмена
    currentReceiptText += `${item.name}\n  ${item.quantity}x ${item.price.toFixed(2)} Kč = ${itemTotal.toFixed(2)} Kč\n`;
  });
  // Дописываем финал (Итоговую сумму)
  htmlContent += `
  <div class="receipt-modal__divider" style="border-top-style: solid; margin-top: 15px;"></div>
  <div class="receipt-modal__line" style="justify-content: center; font-weight: bold; margin-top: 5px;">Děkujeme za nákup!</div>
  `;

  currentReceiptText += `-------------\nCELKEM: ${finalAmount.toFixed(2)} Kč\nDěkujeme za nákup!`;
  // Вставляем сгенерированный чек в HTML
  if (receiptBody) receiptBody.innerHTML = htmlContent;

  //очищаем корзину в коде
  cart = [];
  // Обновляем интерфейс (это автоматически сохранит пустую корзину в память)
  updateCartUI();
  // Закрываем модальное окно
  toggleCart();

  // Показываем готовое окно чека на экране!
  const receiptModal = document.getElementById("receipt-modal");
  if (receiptModal) receiptModal.style.display = "flex";
}
// =============== Функция закрытия окна чека ====================
function closeReceipt() {
  const receiptModal = document.getElementById("receipt-modal");
  if (receiptModal) receiptModal.style.display = "none";
}
// ============== Функция копирования текстового чека в буфер обмена телефона
function copyReceiptToClipboard() {
  if (!currentReceiptText) return;

  navigator.clipboard
    .writeText(currentReceiptText)
    .then(() => {
      alert(
        "Učtenka byla zkopírována! (Чек успешно скопирован в буфер обмена!)",
      );
    })
    .catch((err) => {
      alert("Chyba při kopírovaní: ", err);
    });
}
//===================================================================
//                    ЛОГИКА БЛОКНОТА ЗАМЕТОК
//==================================================================
/* =============== Функция добавления новой заметки  ============= */
function addNote() {
  const noteInput = document.getElementById("noteInput");
  const noteText = noteInput.value.trim(); // trim() - убирает случаные побелы
  // Проверяем, что поле не пустое
  if (noteText === "") {
    alert("Napište text poznámky!(Напишите текст заметки!)");
    return;
  }
  //ПРОВЕРКА: мы редактируем или создаем?
  if (editNoteIndex !== null) {
    // Если редактируем - заменяемстарыи текст на измененныи
    notes[editNoteIndex] = noteText;
    editNoteIndex = null; // Сбрасываем маркер после редактирования
    // Возвращаем кнопке стандартныи текст, если ты менял его в верстке
    const addBtn = document.querySelector(".notepad-input-group button");
    if (addBtn) addBtn.innerText = "Přidat";
  } else {
    // Если маркер null - просто добавляем новую заметку, как обычно
    notes.push(noteText);
  }
  // Очищаем поле ввода, чтобы оно было готово для новой записи
  noteInput.value = "";
  //Отрисовываем обновленный список на экране
  renderNotes();
}
//======================================================================================
function addTemplateNote(text) {
  notes.push(text);
  renderNotes();
}
/* =========  Функция Художник - выводит заметки на экран =======*/
function renderNotes() {
  const notesList = document.getElementById("note-list");
  if (!notesList) return; // Защита: если список не найден, останавливаем код
  // Полностью очищаем старый список перед перерисовкой
  notesList.innerHTML = "";
  //Проходимся по массиву заметок циклом
  notes.forEach((note, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
  <span onclick="findNoteInShop('${note}')" 
  class="notepad-list__text">
  ${note}</span>
  <div class="notepad-list__controls">
  <button class="edit-note-btn"
  onclick="prepareEditNote(${index})" title="Upravit">
  <i class="fa-solid fa-pen-to-square"></i></button>
  <button class="delete-note-btn"
   onclick="deleteNote(${index})" title="Smazat">
   <i class="fa-solid fa-trash-can"></i></button>
   </div>
  `;
    notesList.appendChild(li);
  });
  // Сохранение: Переводим массив заметок в текст и записываем в память
  localStorage.setItem("myShoppingNotes", JSON.stringify(notes));
}
//======================================================================
function prepareEditNote(index) {
  const noteInput = document.getElementById("noteInput");
  if (!noteInput) return;
  // Заносим текущии текст в инпут для дописывания
  noteInput.value = notes[index];
  // Запоминаем индекс этои заметки, чтобы обновить именно ее
  editNoteIndex = index;
  // Переводим фокус на поле ввода, чтобы клавиатура на Андроиде сразу открылась
  noteInput.focus();
}
//======================================================================
/* ============ 4. Функция удаления конкретной заметки =============*/
function deleteNote(index) {
  // Удаляем 1 элемент из массива по его индексу
  notes.splice(index, 1);
  editNoteIndex = null; //Сбрасываем маркер, если редактируемая замена была удалена
  const noteInput = document.getElementById("noteInput");
  if (noteInput) {
    noteInput.value = "";
  }
  //Переписываем список, чтобы удаленная заметка исчезла
  renderNotes();
}
/* ============ 5. Функция связи findNoteInShop (JS) ===============*/
function findNoteInShop(noteText) {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  // 1.Вставляем текст заметки в поле поиска
  searchInput.value = noteText;
  // 2. Вызываем твою готовую функцию поиска, чтобы обновить витрину
  searchProducts();
}
/* ================================================================= 
 ============ 7. Логика истории расходов ========================= 
 ================================================================= */
function renderHistory() {
  const historyList = document.getElementById("history-list");
  const historyTotal = document.getElementById("history-total");
  if (!historyList || !historyTotal) return;

  historyList.innerHTML = "";
  let totalSpent = 0;

  // Идем по истории задом наперед, чтобы новые покупки были СВЕРХУ списка
  purchaseHistory
    .slice()
    .reverse()
    .forEach((order) => {
      const li = document.createElement("li");
      li.innerHTML = `
    <span><i class="fa-solid fa-calendar-days" style="margin-right: 5px;
    color: #555;"></i>${order.date}</span>
    <strong>${order.amount.toFixed(2)} Kč</strong>
    `;
      historyList.appendChild(li);
      totalSpent += order.amount;
    });
  // Обновляем общую сумму на экране
  historyTotal.innerText = `${totalSpent.toFixed(2)} Kč`;
  //Сохраняем в localStorage
  localStorage.setItem("shopPurchaseHistory", JSON.stringify(purchaseHistory));
}
/* =========  Функция очистки истории ============*/
function clearHistory() {
  if (
    confirm(
      "Opravdu chcete smazat celou historii? (Вы уверены, что хотите удалить всю историю?)",
    )
  ) {
    purchaseHistory = [];
    renderHistory();
  }
}

/* ================================================================= 
 ========   Инициация и запуск приложения при старте  ============== 
 ================================================================= */
renderProducts();
updateCartUI();
renderNotes();
renderHistory();
