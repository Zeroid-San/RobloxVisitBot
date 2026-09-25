const $ = (id) => document.getElementById(id);

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
  });
});

const defaults = { threads: 10, loop: "true", delay: 10 };
const saved = JSON.parse(localStorage.getItem("rvb-dashboard-settings") || "null") || defaults;

function loadSettings() {
  $("threads").value = saved.threads;
  $("loop").value = saved.loop;
  $("delay").value = saved.delay;
}
loadSettings();

$("saveBtn").addEventListener("click", () => {
  const threads = Number($("threads").value);
  const delay = Number($("delay").value);
  if (!Number.isInteger(threads) || threads < 1 || threads > 100) {
    $("saveMessage").textContent = "Threads must be a whole number from 1 to 100.";
    return;
  }
  if (!Number.isFinite(delay) || delay < 0 || delay > 3600) {
    $("saveMessage").textContent = "Delay must be between 0 and 3600 seconds.";
    return;
  }
  const settings = { threads, loop: $("loop").value, delay };
  localStorage.setItem("rvb-dashboard-settings", JSON.stringify(settings));
  $("saveMessage").textContent = "Saved successfully in this browser.";
});

$("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("rvb-dashboard-settings");
  Object.assign(saved, defaults);
  loadSettings();
  $("saveMessage").textContent = "Settings reset to defaults.";
});

function updateClock() {
  $("clock").textContent = new Date().toLocaleTimeString();
}
updateClock();
setInterval(updateClock, 1000);

function healthCheck() {
  const secure = location.protocol === "https:" || location.hostname === "localhost";
  $("healthLine").textContent = "● BROWSER READY";
  $("statusBadge").textContent = "ONLINE";
  $("saveMessage").textContent = secure
    ? "Health check passed. HTTPS/local development environment detected."
    : "Health check passed. Static dashboard is running.";
}
$("healthBtn").addEventListener("click", healthCheck);
healthCheck();

$("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("rvb-theme", document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem("rvb-theme") === "light") document.body.classList.add("light");