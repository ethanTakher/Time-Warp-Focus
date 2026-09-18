# Time Warp Focus Roadmap

This roadmap outlines the planned development stages for the Time Warp Focus Chrome extension.

The goal is to create a private, reversible focus tool that keeps one chosen tab readable while making other tabs feel like they have been sent back into history.

---

## 1. Core Extension Setup

### Goal

Build the essential Chrome extension structure and make the main focus feature work.

### Tasks

- [x] Create the main Chrome extension folder structure.
- [x] Add `manifest.json`.
- [x] Add `background.js`.
- [x] Add `main.js`.
- [x] Add `style.css`.
- [x] Add `index.html` for the extension popup.
- [x] Add `popup.js`.
- [x] Add `popup.css`.
- [x] Add the project documentation files.
- [x] Create the extension icon folder.
- [x] Create the initial extension icon.

### Focus Feature

- [x] Let the user select one tab as their focus tab.
- [x] Keep the selected focus tab readable.
- [x] Transform visible text on other eligible browser tabs.
- [x] Let the user turn the focus session off at any time.
- [x] Restore original page text when focus mode is turned off.
- [x] Automatically stop the session if the chosen focus tab is closed.

### Languages and Writing Styles

- [x] Add Viking Rune visual substitution.
- [x] Add Greek-style letter substitution.
- [x] Add Egyptian hieroglyph-like glyph substitution.
- [x] Add Sumerian Cuneiform substitution.
- [x] Add a language/style dropdown in the popup.
- [x] Let the user choose the style before beginning focus mode.
- [x] Let the user change the selected style during a focus session.

### Popup

- [x] Show the available focus tabs in a dropdown.
- [x] Show the selected focus tab.
- [x] Add a Begin Focus Session button.
- [x] Add a Turn Off Translation button.
- [x] Add a Reset Session Timer button.
- [x] Show focus time.
- [x] Show translated-tab time.
- [x] Show a warning when the distraction threshold is reached.

---

## 2. Writing Style Color Schemes

### Goal

Give each historical writing style its own visual identity so transformed tabs feel different depending on the selected language.

### Viking Runes

- [x] Use a silver, gray, slate, charcoal, and cold-stone color scheme.
- [x] Remove the yellow and gold colors from Viking Rune mode.
- [x] Add a dark gray background.
- [x] Use silver-gray text.
- [x] Make images and videos appear more gray and desaturated.
- [x] Use a dark banner with silver text.

### Greek-style Letters

- [x] Use an aged parchment and bronze color scheme.
- [x] Use warm beige and brown backgrounds.
- [x] Use bronze and dark-brown text.
- [x] Give the page an ancient manuscript feeling.

### Egyptian Hieroglyph-like Glyphs

- [x] Use sandstone, desert, and gold-brown colors.
- [x] Use warm tan backgrounds.
- [x] Use dark brown and ochre text.
- [x] Apply a desert-like filter to media.

### Sumerian Cuneiform

- [x] Use a clay-tablet color scheme.
- [x] Use mud-brick browns, clay orange, and ink-black text.
- [x] Create a warm ancient Mesopotamian atmosphere.
- [x] Apply a clay-like filter to media.

### Future Improvements

- [ ] Let users choose custom color themes.
- [ ] Add a dark mode option for every writing style.
- [ ] Add an accessibility mode with stronger contrast.
- [ ] Add a reduced-motion setting.
- [ ] Add a less intense style for users who only want a small focus barrier.

---

## 3. Popup Design and User Experience

### Goal

Make the popup feel polished, easy to understand, and consistent with the historical time-travel theme.

### Current Popup Styling

- [x] Add a dark parchment-like popup background.
- [x] Add gold accent colors.
- [x] Add rounded panels and buttons.
- [x] Add a readable focus-tab card.
- [x] Add timer cards.
- [x] Add a status indicator when focus mode is active.
- [x] Add a warning message when distraction time becomes too high.
- [x] Add hover and click effects to buttons.
- [x] Add a private, local-only data message.

### Future Popup Improvements

- [ ] Show an icon beside every language option.
- [ ] Show a short preview of each script before the user starts.
- [ ] Add a live text preview area.
- [ ] Add a visible session progress bar.
- [ ] Add a session countdown timer.
- [ ] Add a pause button.
- [ ] Add a multiple-focus-tab option.
- [ ] Add a list of protected research tabs.
- [ ] Add a website allowlist.
- [ ] Add a website blocklist.
- [ ] Add a settings page for advanced options.
- [ ] Add an onboarding page for first-time users.

---

## 4. Sounds and Music

### Goal

Add optional historical and atmospheric audio that supports focus without becoming distracting.

### Sound Effects

- [ ] Add a subtle activation sound when a focus session begins.
- [ ] Add a soft deactivation sound when focus mode ends.
- [ ] Add a quiet warning sound when the distraction limit is reached.
- [ ] Add a soft sound when the user returns to the focus tab.
- [ ] Add optional button click sounds.
- [ ] Make all sound effects optional.
- [ ] Add a volume slider.
- [ ] Add a mute button.

### Music and Ambience

- [ ] Add optional ambient background sound.
- [ ] Add a Viking-style wind, fire, or low drum ambience.
- [ ] Add a Greek-inspired lyre or soft temple ambience.
- [ ] Add a desert wind ambience for Egyptian-style glyphs.
- [ ] Add a clay-tablet workshop or ancient city ambience for Sumerian Cuneiform.
- [ ] Add a music on/off setting.
- [ ] Add a separate ambience volume control.
- [ ] Ensure that music never starts automatically without user choice.
- [ ] Ensure that all audio is local or comes from properly licensed sources.

### Audio Accessibility

- [ ] Make all focus features work without sound.
- [ ] Add visual replacements for every sound alert.
- [ ] Respect browser and operating-system reduced-motion or sound preferences.
- [ ] Keep sounds short, soft, and non-intrusive.

---

## 5. Finishing Touches

### Goal

Improve quality, reliability, accessibility, privacy, and performance before release.

### Functionality

- [ ] Add a pause focus session button.
- [ ] Add a session duration selector.
- [ ] Add Pomodoro mode.
- [ ] Add custom focus goals.
- [ ] Add custom distraction-time thresholds.
- [ ] Add keyboard shortcuts.
- [ ] Add scheduled focus sessions.
- [ ] Add support for multiple focus tabs.
- [ ] Add a safe website allowlist.
- [ ] Add a distraction-site blocklist.
- [ ] Add a “transform only specific websites” option.
- [ ] Add a “transform all tabs except allowed tabs” option.

### Timer Improvements

- [ ] Improve timer accuracy across multiple browser windows.
- [ ] Pause timers when Chrome is not the active application.
- [ ] Add daily focus totals.
- [ ] Add weekly focus totals.
- [ ] Keep all statistics local by default.
- [ ] Add an option to clear all session data.

### Reliability

- [ ] Test on websites with large amounts of text.
- [ ] Test on websites that add content dynamically.
- [ ] Test on websites with infinite scrolling.
- [ ] Test on video platforms.
- [ ] Test on social-media websites.
- [ ] Test on school and research websites.
- [ ] Test that form fields remain unchanged.
- [ ] Test that text areas remain unchanged.
- [ ] Test that passwords remain unchanged.
- [ ] Test that code blocks remain unchanged.
- [ ] Test that the extension safely ignores Chrome internal pages.
- [ ] Test what happens when the focus tab is closed.
- [ ] Test what happens when the browser is restarted during a session.

### Accessibility

- [ ] Improve keyboard navigation in the popup.
- [ ] Add visible keyboard focus indicators.
- [ ] Test with screen readers.
- [ ] Add accessible button labels.
- [ ] Add accessible timer labels.
- [ ] Add high-contrast popup support.
- [ ] Make sure all controls can be used without a mouse.
- [ ] Avoid relying only on color for warnings.

### Performance

- [ ] Improve performance on long webpages.
- [ ] Reduce unnecessary page scanning.
- [ ] Improve handling of dynamically inserted text.
- [ ] Test memory usage during long focus sessions.
- [ ] Test CPU usage on pages with frequent updates.
- [ ] Avoid slowing down video, games, or interactive websites.

### Documentation

- [ ] Update `README.md` with all final features.
- [ ] Update `PRIVACY.md` before publication.
- [ ] Update `DESIGN.md` with final visual and ethical decisions.
- [ ] Add screenshots to the README.
- [ ] Add a troubleshooting section.
- [ ] Add an FAQ.
- [ ] Add a credits section for icons, fonts, sounds, and music.
- [ ] Add license information.

---

## 6. Publish and Make Public

### Goal

Prepare Time Warp Focus for a public release.

### Chrome Web Store Preparation

- [ ] Create final Chrome extension icons.
- [ ] Export required PNG icon sizes.
- [ ] Create a 128 × 128 Chrome Web Store icon.
- [ ] Create extension screenshots.
- [ ] Create a promotional image if required.
- [ ] Write the short Chrome Web Store description.
- [ ] Write the full Chrome Web Store description.
- [ ] Write clear privacy disclosures.
- [ ] Review requested Chrome permissions.
- [ ] Confirm that the extension does not collect or sell user data.
- [ ] Prepare a support email address or contact method.
- [ ] Set a version number for the first public release.

### Final Testing

- [ ] Test the extension on Google Chrome.
- [ ] Test the extension on Microsoft Edge.
- [ ] Test the extension on Brave.
- [ ] Test on Windows.
- [ ] Test on macOS.
- [ ] Test on different screen sizes.
- [ ] Test with a clean Chrome profile.
- [ ] Test installation from an unpacked folder.
- [ ] Test installing the final packaged extension.
- [ ] Fix all console errors.
- [ ] Fix all manifest warnings.
- [ ] Confirm that focus mode can always be turned off.

### Public Release

- [ ] Create a Chrome Web Store developer account.
- [ ] Package the extension for upload.
- [ ] Upload the extension to the Chrome Web Store.
- [ ] Submit the extension for review.
- [ ] Respond to review feedback if needed.
- [ ] Publish the approved extension.
- [ ] Share the project with friends, classmates, and testers.
- [ ] Gather user feedback.
- [ ] Track bugs and improvement ideas.
- [ ] Plan the next update.

---

## Long-Term Vision

Time Warp Focus should remain a respectful, private, and user-controlled focus tool.

The extension should never become a surveillance product, an advertising product, or a tool that traps users. The user must always be able to return to readable tabs, stop the session, and control how the focus barrier works.