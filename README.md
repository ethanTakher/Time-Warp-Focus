# Time Warp Focus

Time Warp Focus is a Chrome extension designed to make tab-based distractions less tempting.

The user chooses one focus tab. That tab remains readable. Other normal web tabs are visually transformed into historic-looking character systems such as Viking runes, Greek-style letters, or hieroglyph-like glyphs.

## Data

The extension does not use data from the user, it has all the languages stored on it.
It doesn't use AI

## Main idea

The extension creates useful friction when a user switches to distracting tabs.

It does not permanently block websites. It does not delete content. It does not collect browsing information. Instead, it makes non-focus tabs less convenient to read until the user returns to their selected focus tab.

## Features

- Select one readable focus tab.
- Transform text on other HTTP and HTTPS web tabs.
- Choose Viking Runes, Greek-style Letters, or Hieroglyph-like Glyphs.
- Track time on focus tabs and translated tabs.
- Activate fade mode if translated-tab time becomes twice focus-tab time.
- Restore all original text when the session ends.
- Store settings only in Chrome local storage.
- Send no browsing data to advertisers, buyers, analytics platforms, or third parties.

## Important wording

Time Warp Focus uses visual character substitution.

It does not claim to accurately translate English into Ancient Greek, Old Norse, or Egyptian hieroglyphics. The writing systems are used as a visual focus barrier and historical aesthetic.

## Folder files

```text
time-warp-focus/
├── manifest.json
├── background.js
├── main.js
├── style.css
├── index.html
├── popup.css
├── popup.js
├── README.md
├── ROADMAP.md
├── PRIVACY.md
├── DESIGN.md
├── CONTRIBUTING.md
└── icons/
    └── icon.svg
```

## Install locally

1. Open Google Chrome.
2. Go to `chrome://extensions`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Choose the `time-warp-focus` project folder.
6. Pin the extension from Chrome's Extensions menu.
7. Open more than one normal website.
8. Click the Time Warp Focus icon.
9. Choose the tab you want to focus on.
10. Choose a translation style.
11. Click Begin Focus Session.

## Testing

- Test on blogs, news websites, Wikipedia pages, and simple normal websites.
- Reload tabs that were already open before installing or reloading the extension.
- Test all three visual styles.
- Test turning focus mode on and off.
- Test closing the chosen focus tab.
- Test the timer and fade-mode behavior.

## Limitations

Chrome extensions cannot inject code into every type of page.

The extension cannot transform:

- `chrome://` pages.
- Chrome Web Store pages.
- Browser settings pages.
- Extension pages.
- Some protected, sandboxed, or restricted websites.
- PDF viewer pages in some Chrome configurations.

The extension avoids changing text in form fields, text areas, select menus, buttons, code blocks, and editable elements.

## Permissions

The extension uses:

- `tabs` to identify the selected focus tab and other open tabs.
- `storage` to save local session settings and timers.
- Access to HTTP and HTTPS sites so the extension can apply the reversible visual transformation.

## Privacy

Time Warp Focus does not use a server, user accounts, ads, analytics, tracking pixels, or third-party data sharing.

## Data, Storage, and System Requirements

### What data does this tool need?

Time Warp Focus needs only the minimum browser-session data required to run a focus session:

- Whether focus mode is currently enabled.
- The ID of the selected focus tab.
- The selected writing style:
  - Viking Runes.
  - Greek-style Letters.
  - Egyptian Hieroglyph-like Glyphs.
  - Sumerian Cuneiform.
- Time spent on the selected readable focus tab.
- Time spent on translated non-focus tabs.
- The ID of the most recently active tab.
- The most recent timestamp used for timer calculations.
- Whether fade mode is active after the user spends at least twice as long on translated tabs as on the focus tab.

The extension also temporarily reads open-tab information, including tab IDs, titles, URLs, and active-tab status. It uses this information to populate the focus-tab dropdown and decide which ordinary web tabs should receive the visual transformation.

The tool does not need page contents, typed text, passwords, search queries, account information, payment information, location data, contacts, browsing-history records, or advertising identifiers.

### Where is the data stored?

Session settings and timer data are stored locally in the user's Chrome browser through `chrome.storage.local`.

The data is stored in the user’s local Chrome profile, not in an external database or cloud service.

The extension does not send this data to:

- A developer server.
- An AI service.
- An analytics provider.
- An advertiser.
- A data broker.
- An online buyer.
- Any other third party.

### Is the data temporary or persistent?

The extension uses both temporary and persistent data.

| Data type | Examples | Storage behavior |
|---|---|---|
| Temporary browser data | Current tab list, current tab titles, current URLs, active-tab status | Read from Chrome when needed; not intentionally saved as a browsing history |
| Persistent local extension data | Selected language, focus-session state, timer totals, fade-mode state | Saved in `chrome.storage.local` so the extension can continue working after the popup closes or Chrome restarts |
| Page text transformation memory | Original visible text from a webpage while that page is translated | Held temporarily in the page’s content script; removed when the page reloads, closes, or focus mode is turned off |

The extension does not create a permanent list of websites visited by the user.

### Does the system need memory between sessions?

Yes, but only limited local memory.

The extension needs to remember its selected writing style, whether a focus session is active, which tab is the selected focus tab, timer totals, and fade-mode status. This allows the session to continue if the user closes and reo