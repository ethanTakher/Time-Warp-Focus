const focusTabSelect = document.getElementById("focusTab");
const languageSelect = document.getElementById("language");

const setupPanel = document.getElementById("setupPanel");
const activePanel = document.getElementById("activePanel");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetTimerButton = document.getElementById("resetTimerButton");

const activeFocusTab = document.getElementById("activeFocusTab");
const focusTime = document.getElementById("focusTime");
const distractionTime = document.getElementById("distractionTime");
const warningMessage = document.getElementById("warningMessage");

const themeClasses = [
  "theme-runes",
  "theme-greek",
  "theme-glyphs",
  "theme-cuneiform"
];

function applyPopupTheme(language) {
  document.body.classList.remove(...themeClasses);

  document.body.classList.add(`theme-${language || "runes"}`);
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function makeOption(tab) {
  const option = document.createElement("option");

  option.value = tab.id;

  option.textContent = tab.active
    ? `★ ${tab.title}`
    : tab.title;

  return option;
}

function updatePopup(data) {
  const { state, tabs } = data;

  focusTabSelect.innerHTML = "";

  for (const tab of tabs) {
    focusTabSelect.appendChild(makeOption(tab));
  }

  const selectedLanguage = state.language || "runes";

  languageSelect.value = selectedLanguage;

  applyPopupTheme(selectedLanguage);

  if (state.enabled) {
    setupPanel.classList.add("hidden");
    activePanel.classList.remove("hidden");

    const focusTab = tabs.find((tab) => tab.id === state.focusTabId);

    activeFocusTab.textContent = focusTab
      ? focusTab.title
      : "Focus tab was closed";

    focusTime.textContent = formatTime(state.focusTimeMs);
    distractionTime.textContent = formatTime(state.distractionTimeMs);

    warningMessage.classList.toggle("hidden", !state.fadeMode);

    return;
  }

  setupPanel.classList.remove("hidden");
  activePanel.classList.add("hidden");

  const activeTab = tabs.find((tab) => tab.active);

  if (activeTab) {
    focusTabSelect.value = String(activeTab.id);
  }
}

async function getCurrentData() {
  return chrome.runtime.sendMessage({
    type: "GET_STATE"
  });
}

async function refreshPopup() {
  const response = await getCurrentData();

  if (response?.success) {
    updatePopup(response);
  }
}

startButton.addEventListener("click", async () => {
  const selectedLanguage = languageSelect.value;

  applyPopupTheme(selectedLanguage);

  const response = await chrome.runtime.sendMessage({
    type: "START_FOCUS_SESSION",
    focusTabId: Number(focusTabSelect.value),
    language: selectedLanguage
  });

  if (response?.success) {
    await refreshPopup();
  }
});

stopButton.addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage({
    type: "STOP_FOCUS_SESSION"
  });

  if (response?.success) {
    await refreshPopup();
  }
});

resetTimerButton.addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage({
    type: "RESET_TIMER"
  });

  if (response?.success) {
    await refreshPopup();
  }
});

languageSelect.addEventListener("change", async () => {
  const selectedLanguage = languageSelect.value;

  applyPopupTheme(selectedLanguage);

  const response = await chrome.runtime.sendMessage({
    type: "CHANGE_LANGUAGE",
    language: selectedLanguage
  });

  if (response?.success) {
    await refreshPopup();
  }
});

refreshPopup();

setInterval(refreshPopup, 1000);