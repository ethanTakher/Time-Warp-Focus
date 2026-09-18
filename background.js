const DEFAULT_STATE = {
  enabled: false,
  focusTabId: null,
  language: "runes",
  focusTimeMs: 0,
  distractionTimeMs: 0,
  lastActiveTabId: null,
  lastTimestamp: Date.now(),
  fadeMode: false
};

async function getState() {
  const stored = await chrome.storage.local.get(DEFAULT_STATE);

  return {
    ...DEFAULT_STATE,
    ...stored
  };
}

async function saveState(partialState) {
  await chrome.storage.local.set(partialState);
}

async function updateTimeTracking() {
  const state = await getState();
  const now = Date.now();

  if (!state.enabled || !state.lastActiveTabId) {
    await saveState({
      lastTimestamp: now
    });
    return;
  }

  const elapsed = Math.max(0, now - state.lastTimestamp);

  if (state.lastActiveTabId === state.focusTabId) {
    state.focusTimeMs += elapsed;
  } else {
    state.distractionTimeMs += elapsed;
  }

  const minimumFocusForWarning = 15_000;

  const shouldFade =
    state.focusTimeMs >= minimumFocusForWarning &&
    state.distractionTimeMs >= state.focusTimeMs * 2;

  await saveState({
    focusTimeMs: state.focusTimeMs,
    distractionTimeMs: state.distractionTimeMs,
    fadeMode: shouldFade,
    lastTimestamp: now
  });

  await refreshAllTabs();
}

async function getAllNormalTabs() {
  const tabs = await chrome.tabs.query({});

  return tabs.filter((tab) => {
    if (!tab.id || !tab.url) {
      return false;
    }

    return (
      tab.url.startsWith("http://") ||
      tab.url.startsWith("https://")
    );
  });
}

async function sendTabMode(tab) {
  const state = await getState();

  if (!tab.id) {
    return;
  }

  const isFocusTab = tab.id === state.focusTabId;
  const shouldTranslate = state.enabled && !isFocusTab;

  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: "SET_TIME_WARP_MODE",
      enabled: shouldTranslate,
      language: state.language,
      fadeMode: state.fadeMode
    });
  } catch (error) {
    // The tab may still be loading, may not support content scripts,
    // or Chrome may block script access on that page.
  }
}

async function refreshAllTabs() {
  const tabs = await getAllNormalTabs();

  for (const tab of tabs) {
    await sendTabMode(tab);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const state = await chrome.storage.local.get();

  if (!Object.keys(state).length) {
    await chrome.storage.local.set(DEFAULT_STATE);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await updateTimeTracking();

  await saveState({
    lastActiveTabId: tabId,
    lastTimestamp: Date.now()
  });

  await refreshAllTabs();
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  await updateTimeTracking();

  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await saveState({
      lastActiveTabId: null,
      lastTimestamp: Date.now()
    });

    return;
  }

  const [activeTab] = await chrome.tabs.query({
    active: true,
    windowId
  });

  await saveState({
    lastActiveTabId: activeTab?.id ?? null,
    lastTimestamp: Date.now()
  });

  await refreshAllTabs();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    await updateTimeTracking();
    await sendTabMode(tab);
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const state = await getState();

  if (tabId === state.focusTabId) {
    await saveState({
      enabled: false,
      focusTabId: null,
      fadeMode: false,
      lastActiveTabId: null,
      lastTimestamp: Date.now()
    });

    await refreshAllTabs();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message.type === "GET_STATE") {
      await updateTimeTracking();

      const state = await getState();
      const tabs = await getAllNormalTabs();

      sendResponse({
        success: true,
        state,
        tabs: tabs.map((tab) => ({
          id: tab.id,
          title: tab.title || "Untitled tab",
          url: tab.url,
          active: tab.active
        }))
      });

      return;
    }

    if (message.type === "START_FOCUS_SESSION") {
      await updateTimeTracking();

      const focusTabId = Number(message.focusTabId);

      if (!Number.isInteger(focusTabId)) {
        sendResponse({
          success: false,
          error: "Please choose a valid focus tab."
        });

        return;
      }

      const activeTabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      await saveState({
        enabled: true,
        focusTabId,
        language: message.language || "runes",
        focusTimeMs: 0,
        distractionTimeMs: 0,
        fadeMode: false,
        lastActiveTabId: activeTabs[0]?.id ?? null,
        lastTimestamp: Date.now()
      });

      await refreshAllTabs();

      sendResponse({
        success: true
      });

      return;
    }

    if (message.type === "STOP_FOCUS_SESSION") {
      await updateTimeTracking();

      await saveState({
        enabled: false,
        focusTabId: null,
        fadeMode: false,
        lastTimestamp: Date.now()
      });

      await refreshAllTabs();

      sendResponse({
        success: true
      });

      return;
    }

    if (message.type === "CHANGE_LANGUAGE") {
      await saveState({
        language: message.language
      });

      await refreshAllTabs();

      sendResponse({
        success: true
      });

      return;
    }

    if (message.type === "RESET_TIMER") {
      const activeTabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      await saveState({
        focusTimeMs: 0,
        distractionTimeMs: 0,
        fadeMode: false,
        lastActiveTabId: activeTabs[0]?.id ?? null,
        lastTimestamp: Date.now()
      });

      await refreshAllTabs();

      sendResponse({
        success: true
      });
    }
  })();

  return true;
});