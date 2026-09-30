const MAX_FOCUS_TABS = 3;

const focusTabSelect = document.getElementById("focusTab");
const languageSelect = document.getElementById("language");

const setupPanel = document.getElementById("setupPanel");
const activePanel = document.getElementById("activePanel");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetTimerButton = document.getElementById("resetTimerButton");

const activeFocusTabs = document.getElementById("activeFocusTabs");
const focusTime = document.getElementById("focusTime");
const distractionTime = document.getElementById("distractionTime");
const warningMessage = document.getElementById("warningMessage");
const selectionCount = document.getElementById("selectionCount");

const themeClasses = [
  "theme-runes",
  "theme-greek",
  "theme-glyphs",
  "theme-cuneiform"
];

let tabsCache = [];
let selectedFocusTabIds = new Set();

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

function getSelectedFocusTabIds() {
  return [...selectedFocusTabIds];
}

function updateSelectionCount(message = "") {
  const selectedCount = selectedFocusTabIds.size;

  selectionCount.textContent = message ||
    `${selectedCount} of ${MAX_FOCUS_TABS} focus tabs selected`;

  selectionCount.classList.toggle(
    "selection-count-warning",
    selectedCount === 0 || selectedCount > MAX_FOCUS_TABS || Boolean(message)
  );
}

function syncSelectWithSavedSelection() {
  for (const option of focusTabSelect.options) {
    option.selected = selectedFocusTabIds.has(Number(option.value));
  }
}

function makeOption(tab) {
  const option = document.createElement("option");

  option.value = tab.id;

  option.textContent = tab.active
    ? `★ ${tab.title}`
    : tab.title;

  return option;
}

function renderActiveFocusTabs(focusTabIds) {
  activeFocusTabs.innerHTML = "";

  const selectedTabs = tabsCache.filter((tab) =>
    focusTabIds.includes(tab.id)
  );

  if (selectedTabs.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Focus tabs are no longer open.";
    activeFocusTabs.appendChild(item);
    return;
  }

  for (const tab of selectedTabs) {
    const item = document.createElement("li");
    item.textContent = tab.title || "Untitled tab";
    activeFocusTabs.appendChild(item);
  }
}

function getClickedOption(event) {
  const rect = focusTabSelect.getBoundingClientRect();

  const optionHeight = focusTabSelect.clientHeight /
    Math.min(focusTabSelect.size, focusTabSelect.options.length);

  const optionIndex = Math.floor(
    (event.clientY - rect.top) / optionHeight
  );

  if (
    optionIndex < 0 ||
    optionIndex >= focusTabSelect.options.length
  ) {
    return null;
  }

  return focusTabSelect.options[optionIndex];
}

function handleFocusTabMouseDown(event) {
  const option = getClickedOption(event);

  if (!option) {
    return;
  }

  event.preventDefault();

  const tabId = Number(option.value);

  if (!Number.isInteger(tabId)) {
    return;
  }

  const isAlreadySelected = selectedFocusTabIds.has(tabId);

  /*
    Clicking an already-selected option removes only that option.
    Clicking an unselected option adds it, preserving previous choices.
  */
  if (isAlreadySelected) {
    selectedFocusTabIds.delete(tabId);
    syncSelectWithSavedSelection();
    updateSelectionCount();
    return;
  }

  if (selectedFocusTabIds.size >= MAX_FOCUS_TABS) {
    syncSelectWithSavedSelection();

    updateSelectionCount(
      `You can select up to ${MAX_FOCUS_TABS} focus tabs. Click a selected tab to remove it first.`
    );

    return;
  }

  selectedFocusTabIds.add(tabId);

  syncSelectWithSavedSelection();
  updateSelectionCount();
}

function updatePopup(data) {
  const { state, tabs } = data;

  tabsCache = tabs;

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

    renderActiveFocusTabs(state.focusTabIds || []);

    focusTime.textContent = formatTime(state.focusTimeMs);
    distractionTime.textContent = formatTime(state.distractionTimeMs);

    warningMessage.classList.toggle("hidden", !state.fadeMode);

    return;
  }

  setupPanel.classList.remove("hidden");
  activePanel.classList.add("hidden");

  /*
    Only choose the active tab automatically if the user has not
    selected any focus tabs manually yet.
  */
  if (selectedFocusTabIds.size === 0) {
    const activeTab = tabs.find((tab) => tab.active);

    if (activeTab) {
      selectedFocusTabIds.add(activeTab.id);
    }
  }

  /*
    Remove IDs if a tab was closed while the popup was open.
  */
  const openTabIds = new Set(tabs.map((tab) => tab.id));

  selectedFocusTabIds = new Set(
    [...selectedFocusTabIds].filter((tabId) => openTabIds.has(tabId))
  );

  syncSelectWithSavedSelection();
  updateSelectionCount();
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

focusTabSelect.addEventListener(
  "mousedown",
  handleFocusTabMouseDown
);

startButton.addEventListener("click", async () => {
  const selectedLanguage = languageSelect.value;
  const focusTabIds = getSelectedFocusTabIds();

  if (focusTabIds.length === 0) {
    updateSelectionCount("Select at least one focus tab first.");
    return;
  }

  if (focusTabIds.length > MAX_FOCUS_TABS) {
    updateSelectionCount(
      `Select no more than ${MAX_FOCUS_TABS} focus tabs.`
    );

    return;
  }

  applyPopupTheme(selectedLanguage);

  const response = await chrome.runtime.sendMessage({
    type: "START_FOCUS_SESSION",
    focusTabIds,
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
    selectedFocusTabIds.clear();
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