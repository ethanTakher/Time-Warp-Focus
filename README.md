# Time Warp Focus

Time Warp Focus is a Chrome extension designed to make tab-based distractions less tempting.

The user chooses one focus tab. That tab remains readable. Other normal web tabs are visually transformed into historic-looking character systems such as Viking runes, Greek-style letters, or hieroglyph-like glyphs.

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