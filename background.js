const MAX_FOCUS_TABS = 3;

const DEFAULT_STATE = {
  enabled: false,
  focusTabIds: [],
  language: "runes",
  focusTimeMs: 0,
  distractionTimeMs: 0,
  lastActiveTabId: null,
  lastTimestamp: Date.now(),
  fadeMode: false
};

async function getState() {
  const stored = await chrome.storage.local.get(DEFAULT_STATE);

  const focusTabIds = Array.isArray(stored.focusTabIds)
    ? stored.focusTabIds
    : [];

  return {
    ...DEFAULT_STATE,
    ...stored,
    focusTabIds
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

  if (state.focusTabIds.includes(state.lastActiveTabId)) {
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

  const isFocusTab = state.focusTabIds.includes(tab.id);

  const shouldTranslate = state.enabled && !isFocusTab;

  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: "SET_TIME_WARP_MODE",
      enabled: shouldTranslate,
      language: state.language,
      fadeMode: state.fadeMode
    });
  } catch (error) {
    // A tab may still be loading or Chrome may block extension access
    // to that particular page.
  }
}

async function refreshAllTabs() {
  const tabs = await getAllNormalTabs();

  for (const tab of tabs) {
    await sendTabMode(tab);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get();

  if (!Object.keys(stored).length) {
    await chrome.storage.local.set(DEFAULT_STATE);
    return;
  }

  /*
    Upgrade support:
    Earlier versions stored one focus tab as focusTabId.
    This converts it into the new focusTabIds array.
  */
  if (
    !Array.isArray(stored.focusTabIds) &&
    Number.isInteger(stored.focusTabId)
  ) {
    await chrome.storage.local.set({
      focusTabIds: [stored.focusTabId]
    });

    await chrome.storage.local.remove("focusTabId");
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

  if (!state.focusTabIds.includes(tabId)) {
    return;
  }

  const remainingFocusTabIds = state.focusTabIds.filter(
    (focusTabId) => focusTabId !== tabId
  );

  /*
    If the user closes one of multiple focus tabs, the remaining focus
    tabs continue working. If they close the final focus tab, the
    session ends and all other tabs are restored.
  */
  if (remainingFocusTabIds.length > 0) {
    await saveState({
      focusTabIds: remainingFocusTabIds,
      lastTimestamp: Date.now()
    });

    await refreshAllTabs();

    return;
  }

  await saveState({
    enabled: false,
    focusTabIds: [],
    fadeMode: false,
    lastActiveTabId: null,
    lastTimestamp: Date.now()
  });

  await refreshAllTabs();
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

      const requestedFocusTabIds = Array.isArray(message.focusTabIds)
        ? message.focusTabIds
        : [];

      const cleanFocusTabIds = [
        ...new Set(
          requestedFocusTabIds
            .map((tabId) => Number(tabId))
            .filter((tabId) => Number.isInteger(tabId))
        )
      ].slice(0, MAX_FOCUS_TABS);

      if (cleanFocusTabIds.length === 0) {
        sendResponse({
          success: false,
          error: "Choose at least one focus tab."
        });

        return;
      }

      const normalTabs = await getAllNormalTabs();

      const allowedTabIds = new Set(
        normalTabs
          .map((tab) => tab.id)
          .filter((tabId) => Number.isInteger(tabId))
      );

      const validFocusTabIds = cleanFocusTabIds.filter((tabId) =>
        allowedTabIds.has(tabId)
      );

      if (validFocusTabIds.length === 0) {
        sendResponse({
          success: false,
          error: "Choose at least one normal website tab."
        });

        return;
      }

      const activeTabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      await saveState({
        enabled: true,
        focusTabIds: validFocusTabIds,
        language: message.language || "runes",
        focusTimeMs: 0,
        distractionTimeMs: 0,
        fadeMode: false,
        lastActiveTabId: activeTabs[0]?.id ?? null,
        lastTimestamp: Date.now()
      });

      await refreshAllTabs();

      sendResponse({
        success: true,
        focusTabIds: validFocusTabIds
      });

      return;
    }

    if (message.type === "STOP_FOCUS_SESSION") {
      await updateTimeTracking();

      await saveState({
        enabled: false,
        focusTabIds: [],
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
        language: message.language || "runes"
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