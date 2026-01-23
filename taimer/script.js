//======================================================
//1. КОНСТАНТЫ И DOM-ЭЛЕМЕНТЫ (ВЕРХ ФАЙЛА)

// --- Настройки таймера (в секундах) ---
const WORK_TIME = 25 * 60; //25 минут
const SHORT_BREAK = 5 * 60; //5 минут
const LONG_BREAK = 15 * 60; // 15 минут
//=========================================================
// --- Звуковые оповещение ---
const bell = new Audio("bell.mp3"); // Предлагаем, что у вас есть файл bell.mp3

// --- ссылки на DOM-элементы ---
const timerDisplay = document.getElementById("timer-display");
const startPauseBtn = document.getElementById("start-pause-btn");
const resetBtn = document.getElementById("reset-btn");
const workBtn = document.getElementById("work-btn");
const shortBreakBtn = document.getElementById("short-break-btn");

// --- Переменные состояния ---
let currentSeconds = WORK_TIME;
let isRunning = false;
let timerInterval; // здесь будем хранить ID таймера setInterval
let currentMode = "work";
let workCycles = 0; //считает , сколько рабочих циклов завершено
//===================================
//2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
//===================================
//Функция для обновления отображения времени на экране.
// @param {number} totalSeconds -общее количество секунд.
function updateDisplay(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  // Форматирование: добавление ведущего нуля
  const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  timerDisplay.textContent = formattedTime;
  document.title = formattedTime + "- Pomodoro";
}

// Устанавливаем начальное время при загрузке
updateDisplay(currentSeconds);
//=========================================
//3. ОСНОВНЫЕ ФУНКЦИИ ЛОГИКИ ТАЙМЕРА
//=========================================
//Функции для сброса таймера к начальному времени текущего режима.
function resetTimer() {
  clearInterval(timerInterval);
  //Определяем время для сброса на основе текущего режима
  let initialTime;
  if (currentMode === "work") initialTime = WORK_TIME;
  else if (currentMode === "short-break") initialTime = SHORT_BREAK;
  else if (currentMode === "long-break") initialTime = LONG_BREAK;

  isRunning = false;
  currentSeconds = initialTime;

  startPauseBtn.textContent = "Старт";
  updateDisplay(currentSeconds);
}
//Главная функция, вызываемая каждую секунду (тик таймера).
function tick() {
  currentSeconds--;
  updateDisplay(currentSeconds);

  if (currentSeconds <= 0) {
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = "Старт";
    bell.play(); //Проигрываем звук!
    if (Notification.permission === "granted") {
      const title =
        currentMode === "work" ? "Время перерыва!" : "Время работы!";
      const bodyText =
        currentMode === "work"
          ? "Начинаеться перерыв."
          : "Начинайте новый рабочий цикл!";

      new Notification(title, {
        body: bodyText,
        //icon: 'bell.png'
        //опционально: Можно добавить путь к иконке
      });
    }
    //==========================================================
    // Определяем, на какой режим переключиться
    if (currentMode === "work") {
      workCycles++;
      // Если 4 цикла работы завершены, переключаемся на ДЛИННЫЙ перерыв
      if (workCycles % 4 === 0) {
        setMode("long-break");
      } else {
        //Иначе - на КОРОТКИЙ перерыв
        setMode("short-break");
      }
    } else {
      // Если был перерыв (короткий или длиный), всегда переключаемся на РАБОТУ
      setMode("work");
    }
    //Автоматический запуск следующего цикла
    startPauseTimer();
  }
}
//==============================================================================
//Ваш следующий шаг:
//1. Добаьть функцию StartPauseTimer()
//2. Добавить функцию resetTimer()
//3. Добавить обработчики событий (Event Listeners) для кнопок
//=================================================================================
// Функция для запуска или паузы таймера.
function startPauseTimer() {
  //1. Логика паузы/запуска
  if (isRunning) {
    // Если запускаем таймер, запрашиваем разрешение, если оно еще не получено
    clearInterval(timerInterval);
    startPauseBtn.textContent = "Старт";
  } else {
    // 2. логика запуска
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }
    startPauseBtn.textContent = "Пауза";
    //Используем setInterval, чтобы уменьшать время каждую секунду
    timerInterval = setInterval(tick, 1000);
  }
  //Инвертируем состояние
  isRunning = !isRunning;
}
//=========================================================================
// ... (после resetTimer)
// Функция для установки нового режима таймера
//@param {string} mode - 'work' или 'short-break'.
function setMode(mode) {
  if (currentMode === mode && !isRunning) {
    //сбрасываем текущий таймер, если он запущен, перед сменой режима
    return;
  }
  //1. Устанавливаем новое время и режим
  currentMode = mode;
  let newtime;
  if (mode === "work") {
    newTime = WORK_TIME;
  } else if (mode === "short-break") {
    newTime = SHORT_BREAK;
  } else if (mode === "long-break") {
    newTime = LONG_BREAK;
  }
  //2. Сбрасываем текущее время и обновляем диспей
  currentSeconds = newTime;
  updateDisplay(currentSeconds);

  //3. Управление активными стилями кнопок
  workBtn.classList.remove("active");
  shortBreakBtn.classList.remove("active");

  if (mode === "work") {
    workBtn.classList.add("active");
  } else if (mode === "short-break" || mode === "long-break") {
    shortBreakBtn.classList.add("active");
  }
}
//=========================================================================
//4. ОБРАБОТЧИКИ СОБЫТИЙ (КОНЕЦ ФАЙЛА)
//=========================================================================
startPauseBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Обработчики для переключения режимов
workBtn.addEventListener("click", () => setMode("work"));
shortBreakBtn.addEventListener("click", () => setMode("short-break"));
