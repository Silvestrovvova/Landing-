function updateTime() {
  const timeDisplay = document.getElementById("local-time");
  if (timeDisplay) {
    timeDisplay.textContent = new Date().toLocaleTimeString("ru-RU", {
      timeZone: "Europe/Kyiv",
    });
  }
}

function applyTheme() {
  const hour = new Date().getHours();
  document.body.className =
    hour >= 6 && hour < 18 ? "day-theme" : "night-theme";
}

function initMap() {
  const coords = [46.4846, 30.7326];
  const map = L.map("map").setView(coords, 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  L.marker(coords).addTo(map).bindPopup("Одесса-мама!").openPopup();
}

window.onload = () => {
  updateTime();
  setInterval(updateTime, 1000);
  applyTheme();
  initMap();

  // Фразочки
  const btn = document.getElementById("vibe-btn");
  if (btn) {
    const phrases = ["Таки да!", "Шоб вы так жили!", "Не делайте мне нервы!"];
    btn.onclick = () => {
      const msg = phrases[Math.floor(Math.random() * phrases.length)];
      document.getElementById(
        "vibe-message"
      ).innerHTML = `<p style="color:var(--gold)">— ${msg}</p>`;
    };
  }
};
