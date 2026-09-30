# Time Warp Focus

Time Warp Focus is a Chrome extension designed to make tab-based distractions less tempting.

The user chooses one, two, or three focus tabs. Selected focus tabs stay readable. Other normal web tabs are visually transformed into historical-looking character systems such as Viking runes, Greek-style letters, Egyptian hieroglyph-like glyphs, or Sumerian cuneiform.

## Main Idea

The extension creates useful friction when a user switches to distracting tabs.

It does not permanently block websites. It does not delete content. It does not collect browsing information. Instead, it makes non-focus tabs less convenient to read until the user intentionally ends the focus session.

## Features

- Select between one and three readable focus tabs.
- Keep every selected focus tab readable.
- Transform text on other eligible HTTP and HTTPS web tabs.
- Choose Viking Runes with a page background of exactly `#808080`.
- Choose Greek-style letters with a marble visual theme.
- Choose Egyptian hieroglyph-like glyphs with a sandstone visual theme.
- Choose Sumerian Cuneiform with a fired-clay visual theme.
- Track time spent on all selected focus tabs combined.
- Track time spent on translated tabs.
- Activate fade mode if translated-tab time becomes twice the total focus-tab time.
- Continue the session if one selected focus tab is closed and another selected focus tab remains open.
- Automatically stop the session if all selected focus tabs are closed.
- Restore all original text when the session ends.
- Store settings only in Chrome local storage.
- Send no browsing data to advertisers, buyers, analytics platforms, or third parties.

## Choosing Focus Tabs

The focus-tab list allows one, two, or three tabs to be selected.

- On Windows or Linux, hold `Ctrl` while clicking tabs to select more than one.
- On macOS, hold `Command` while clicking tabs to select more than one.
- The extension will not allow more than three tabs.
- If one focus tab is closed, remaining selected focus tabs continue to be readable.
- If the final selected focus tab is closed, focus mode turns off and translated tabs are restored.

## Popup Themes

The extension popup changes appearance depending on the selected writing style.

| Writing style | Popup background | Decorative landmark |
|---|---|---|
| Viking Runes | Dark metal and silver | Longship |
| Greek-style Letters | White and gray marble | Greek shield |
| Egyptian Glyphs | Ancient parchment and sandstone | Pyramid |
| Sumerian Cuneiform | Terracotta clay tablet | Stepped ziggurat |

The visual landmarks are built using CSS. No image files are required.

## Important Wording

Time Warp Focus uses visual character substitution.

It does not claim to accurately translate English into Ancient Greek, Old Norse, Egyptian hieroglyphics, or Sumerian. The writing systems are used as a visual focus barrier and historical aesthetic.

## Folder Files

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
└── CONTRIBUTING.md
```

## Install Locally

1. Open Google Chrome.
2. Go to `chrome://extensions`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Choose the `time-warp-focus` project folder.
6. Pin the extension from Chrome's Extensions menu.
7. Open at least two normal websites.
8. Click the Time Warp Focus extension icon.
9. Select one, two, or three focus tabs.
10. Choose a translation style.
11. Click Begin Focus Session.

## Testing

- Test one selected focus tab.
- Test two selected focus tabs.
- Test three selected focus tabs.
- Confirm all selected focus tabs remain readable.
- Confirm non-selected tabs transform.
- Close one selected focus tab and confirm the other selected focus tabs still work.
- Close the final focus tab and confirm the focus session stops.
- Test all four writing styles.
- Confirm Rune mode has a page background of `#808080`.
- Test turning focus mode on and off.
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

- `tabs` to identify selected focus tabs and other open tabs.
- `storage` to save local session settings and timers.
- Access to HTTP and HTTPS sites so the extension can apply the reversible visual transformation.

## Privacy

Time Warp Focus does not use a server, user accounts, ads, analytics, tracking pixels, AI services, or third-party data sharing.

## Feedback
The freshman student and my father boththought that the tool was very cool, and a solid 4/5 or 5/5. They eithr liked the hieroglyphs’ color scheme best or the greek one but thought the viking runes, in terms of alphabet, looked coolest. They pointed out that the background color did not change on certain websites, like youtube, and that it sometimes changed on buttons you click on. The student suggestion is to make the tool work on several tabs. My dad suggested to make the rune's background less dark. 