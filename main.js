(() => {
  const ORIGINAL_TEXT = new WeakMap();

  const EXCLUDED_TAGS = new Set([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "TEXTAREA",
    "INPUT",
    "SELECT",
    "OPTION",
    "BUTTON",
    "CODE",
    "PRE",
    "KBD",
    "SAMP"
  ]);

  const greekMap = {
    a: "α",
    b: "β",
    c: "ϲ",
    d: "δ",
    e: "ε",
    f: "ϝ",
    g: "γ",
    h: "η",
    i: "ι",
    j: "ϳ",
    k: "κ",
    l: "λ",
    m: "μ",
    n: "ν",
    o: "ο",
    p: "ρ",
    q: "θ",
    r: "π",
    s: "σ",
    t: "τ",
    u: "υ",
    v: "ϝ",
    w: "ω",
    x: "χ",
    y: "ψ",
    z: "ζ"
  };

  const runeMap = {
    a: "ᚨ",
    b: "ᛒ",
    c: "ᚲ",
    d: "ᛞ",
    e: "ᛖ",
    f: "ᚠ",
    g: "ᚷ",
    h: "ᚺ",
    i: "ᛁ",
    j: "ᛃ",
    k: "ᚲ",
    l: "ᛚ",
    m: "ᛗ",
    n: "ᚾ",
    o: "ᛟ",
    p: "ᛈ",
    q: "ᚲ",
    r: "ᚱ",
    s: "ᛋ",
    t: "ᛏ",
    u: "ᚢ",
    v: "ᚹ",
    w: "ᚹ",
    x: "ᚲᛋ",
    y: "ᛃ",
    z: "ᛉ"
  };

  const glyphMap = {
    a: "𓄿",
    b: "𓃀",
    c: "𓎡",
    d: "𓂧",
    e: "𓇌",
    f: "𓆑",
    g: "𓎼",
    h: "𓉔",
    i: "𓇋",
    j: "𓆓",
    k: "𓎡",
    l: "𓃭",
    m: "𓅓",
    n: "𓈖",
    o: "𓂝",
    p: "𓊪",
    q: "𓈎",
    r: "𓂋",
    s: "𓋴",
    t: "𓏏",
    u: "𓅱",
    v: "𓆑",
    w: "𓅱",
    x: "𓐍",
    y: "𓇌",
    z: "𓊃"
  };

  const cuneiformMap = {
    a: "𒀀",
    b: "𒁀",
    c: "𒅗",
    d: "𒁺",
    e: "𒂊",
    f: "𒉺",
    g: "𒄖",
    h: "𒄭",
    i: "𒄿",
    j: "𒍣",
    k: "𒆠",
    l: "𒇻",
    m: "𒈠",
    n: "𒉡",
    o: "𒌋",
    p: "𒉺",
    q: "𒆠",
    r: "𒊑",
    s: "𒊭",
    t: "𒋾",
    u: "𒌑",
    v: "𒉿",
    w: "𒉿",
    x: "𒍑",
    y: "𒅀",
    z: "𒍣"
  };

  let extensionEnabled = false;
  let selectedLanguage = "runes";
  let fadeMode = false;
  let observer = null;
  let pageUpdateTimer = null;

  function isEditable(element) {
    if (!element) {
      return false;
    }

    return (
      element.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT", "OPTION"].includes(element.tagName)
    );
  }

  function shouldIgnoreTextNode(node) {
    const parent = node.parentElement;

    if (!parent) {
      return true;
    }

    if (EXCLUDED_TAGS.has(parent.tagName)) {
      return true;
    }

    if (isEditable(parent)) {
      return true;
    }

    if (parent.closest("[data-time-warp-ignore]")) {
      return true;
    }

    if (parent.closest("svg")) {
      return true;
    }

    return false;
  }

  function getMap(language) {
    if (language === "greek") {
      return greekMap;
    }

    if (language === "glyphs") {
      return glyphMap;
    }

    if (language === "cuneiform") {
      return cuneiformMap;
    }

    return runeMap;
  }

  function transformText(text, language) {
    const map = getMap(language);

    return text.replace(/[A-Za-z]/g, (character) => {
      const replacement = map[character.toLowerCase()] || character;

      return character === character.toUpperCase()
        ? replacement.toUpperCase()
        : replacement;
    });
  }

  function transformNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }

    if (shouldIgnoreTextNode(node)) {
      return;
    }

    const currentText = node.nodeValue || "";

    if (!currentText.trim()) {
      return;
    }

    if (!ORIGINAL_TEXT.has(node)) {
      ORIGINAL_TEXT.set(node, currentText);
    }

    const originalText = ORIGINAL_TEXT.get(node);

    node.nodeValue = transformText(originalText, selectedLanguage);
  }

  function restoreNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }

    if (!ORIGINAL_TEXT.has(node)) {
      return;
    }

    node.nodeValue = ORIGINAL_TEXT.get(node);
    ORIGINAL_TEXT.delete(node);
  }

  function walkTextNodes(root, callback) {
    if (!root) {
      return;
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    for (const node of nodes) {
      callback(node);
    }
  }

  function applyLanguageTheme() {
    document.documentElement.classList.remove(
      "time-warp-runes",
      "time-warp-greek",
      "time-warp-glyphs",
      "time-warp-cuneiform"
    );

    document.documentElement.classList.add(
      `time-warp-${selectedLanguage}`
    );
  }

  function translatePage() {
    walkTextNodes(document.body, transformNode);

    document.documentElement.classList.add("time-warp-active");

    document.documentElement.classList.toggle(
      "time-warp-fade",
      fadeMode
    );

    applyLanguageTheme();
  }

  function restorePage() {
    walkTextNodes(document.body, restoreNode);

    document.documentElement.classList.remove(
      "time-warp-active",
      "time-warp-fade",
      "time-warp-runes",
      "time-warp-greek",
      "time-warp-glyphs",
      "time-warp-cuneiform"
    );
  }

  function startObserver() {
    if (observer) {
      return;
    }

    observer = new MutationObserver((mutations) => {
      if (!extensionEnabled) {
        return;
      }

      clearTimeout(pageUpdateTimer);

      pageUpdateTimer = setTimeout(() => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
              transformNode(node);
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
              if (isEditable(node)) {
                continue;
              }

              walkTextNodes(node, transformNode);
            }
          }
        }
      }, 150);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function stopObserver() {
    if (!observer) {
      return;
    }

    observer.disconnect();
    observer = null;
  }

  function setMode({ enabled, language, fadeMode: nextFadeMode }) {
    extensionEnabled = Boolean(enabled);
    selectedLanguage = language || "runes";
    fadeMode = Boolean(nextFadeMode);

    if (extensionEnabled) {
      translatePage();
      startObserver();
      return;
    }

    stopObserver();
    restorePage();
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== "SET_TIME_WARP_MODE") {
      return;
    }

    setMode(message);
  });
})();