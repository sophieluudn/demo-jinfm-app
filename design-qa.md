# Homepage verification

Source: 01_首頁1–12.jpg. Comparison evidence: home-comparison.png (source at left, browser at right). Prototype: http://localhost:4173.

Verified: 11 sections in screenshot order; source banner and covers; full and compact card rails; category filtering; favorite state synchronized between duplicate cards; live search for 楊照 returned 2 courses; all rendered images loaded; browser error log empty.

First visual pass found horizontal scroll snapping hid the 15px left rail inset. Fixed with scroll-padding-left and confirmed in the second capture. Reduced category and subtitle spacing to align the first cover with the reference.

Remaining fidelity limits: library icons approximate native icons; right-hand artwork clipped in supplied screenshots cannot recover unseen image content; desktop preview height differs from the source device height. Truncated source titles remain partial. Course detail, playback and other tabs are outside this screenshot batch and show a pending-screen message.

final result: passed (homepage prototype scope; remaining artwork/icon differences are follow-up polish).

## Batch 2: search screen

Sources: 02_搜尋.jpg, 03_搜尋結果.jpg. Evidence: search-empty-comparison.png and search-results-comparison.png at 393 × 853. Source image left, browser capture right.

Implemented: independent search panel with no bottom navigation, original empty-state artwork, editable query, submit and clear, five visible sample rows for 快樂, keyword coloring, source price/episode data, original Drive collection/play/price-sort assets, ascending/descending and default order, favorite state, no-match message and cancel-to-home.

First comparison exposed white playback artwork on white background and excessive result row spacing. Preserved source alpha and tinted playback icon teal; tightened rows and summary spacing. Second comparison shows the corrected artwork and layout. Native device status chrome and exact installed font rendering remain minor differences from the source. Empty-state capture was recaptured after checking rendered state to avoid a stale frame.

Browser verification: ascending prices 169/399/480/580/720, descending 720/580/480/399/169; clearing restores empty state; no-match query shows recovery copy; cancel closes search; favorite toggles and persists; 5 sample result rows; zero missing visible images; no document horizontal overflow; no browser console errors. JavaScript syntax checks passed.

Scope limitation: 151 is the source screenshot's simulated match count for 快樂; only the five provided course rows are modeled, with no backend search. Other queries search available local sample courses. Touch devices use their own keyboard; desktop uses the simulated keyboard. Playback/detail awaits later screenshots.

Detector warnings from incumbent home styles and minor screenshot-matched typography are recorded rather than broadening this batch into a home redesign.

final result: passed (second-batch search prototype scope).

## Batch 3: notifications

Reference: two user-attached screenshots, plus official announcement https://learning.udn.com/jinfm/announcements/382. Official image downloaded as assets/notification-egypt.png. Article content paraphrases the source facts and links to the full original.

Browser checked at 393 × 853 and desktop. Homepage starts with one unread notification; entering list preserves unread state; mark-all hides list dot and badge; opening an item displays the announcement image and structured content; back returns to list then home; reload preserves read state. Unread badge is derived from the read IDs and has an accessible count label. Background homepage is inert while notifications are open. Browser errors: none. JS syntax check passes. Mechanical detector reports [] for notification CSS and JS.

Evidence: notifications-unread-preview.png and notification-detail-preview.png. Notification list spacing, pill buttons, truncation, grey preview text, blue category label, unread dot and chevron visually checked against attached reference. Native status chrome remains the existing shared mockup infrastructure. Content page follows local app structure because only the official webpage, rather than an app detail screenshot, was supplied.

final result: passed (notification batch).

## Batch 4: settings

Sources: four user-attached app screenshots, interpreted at 393 × 853. Built settings main, empty download manager, login gate for red envelopes, and other settings. Used original Drive download artwork, settings icon, and app icon. No actual account or device-storage connection.

Visual round 1: checked all four screens; fixed incorrect blue placeholder avatar to screenshot-style neutral user icon, white settings icon to teal, wallet vertical spacing, and other-settings row spacing. Login panels matched reference vertical positions closely. Round 2: confirmed final main/other-settings captures with assets loaded. Remaining differences: shared native status indicators, installed platform font rendering, approximate profile icon.

Evidence: settings-preview.png, downloads-preview.png, login-preview.png, other-settings-preview.png. Browser checked setting tab selected state; all three download tabs; red-envelope-to-login and close; Wi-Fi on/off; dark/light selection; terms and return; main settings to home and restoration of homepage interactivity. All scoped images loaded; no console errors. Syntax checks for home.js and settings.js passed. Mechanical detector returned [].

Preferences are local prototype preferences; dark/light currently previews the settings surface. Membership actions show a local unconnected-service message. Storage values are reference demo values. No authentication, payment or actual device notification preference is changed.

final result: passed (settings screenshot batch).

## Service terms link update
Both terms entrypoints now link directly to the exact user-provided official URL with target=_blank and rel=noopener noreferrer. Removed unused mock terms page and navigation. Verified real settings-link click opens a tab titled udn 會員服務條款 at https://www.udngroup.com/members/service. Official site disallows cross-origin iframe embedding via X-Frame-Options: SAMEORIGIN. Existing App stays open. final result: passed.

## In-app browser terms revision

Supersedes previous external-only service-terms behavior. Source: latest attached screenshot. Reused actual official UDN logo and service-terms HTML fetched from the user-specified URL; stripped scripts and tracking elements. Displayed as a static local article beneath simulated in-app browser chrome, with official external browser link. Local snapshot date: 2026/10/28; not a live remote webview.

Visual evidence: terms-browser-preview.png at 393 × 853. Compared screenshot source and browser rendering: header close chevron, truncated title, compass, UDN site logo/menu, generous whitespace, heading and readable scrollable article. Native mock status icons and installed font rendering retain existing project differences.

Verified both settings and login entrypoints open the in-app layer; close restores the correct originating screen and interactive state; site menu toggles; official external control points to exact supplied URL; no browser errors. JS syntax check passed.

final result: passed (in-app browser revision).

## Login methods completion
Source: user-provided bottom-sheet and expanded legacy-account screenshots. Implemented mobile slide-up motion, rounded modal sheet, dimmed backdrop, provider buttons, close/return, focus trapping and Escape. Added exact supplied legacy-account description and five local demonstration provider controls. Matched source vertical layout at 393 × 853; preserved lighter font preference. Provider visuals sourced from UDN favicon, official Google asset and Simple Icons.
Verified registration and member-login entrypoints both open the same dialog; close restores login; legacy details expand and collapse with 5 buttons; all provider images load; JS syntax passes; browser console error log empty; mechanical detector []. Evidence: login-method-preview.png, legacy-login-preview.png.
Authentication remains a visual prototype and no credentials or OAuth flows are submitted.
final result: passed.

## Course catalog screenshot batch
Source: two supplied catalog screenshots and local 04_課程頁_Tab目錄1.jpg/2.jpg. Reused exact full course artwork cropped from source. Added selected-course route, close/restore, catalog and intro tabs, known 7 episodes, range picker, reverse order, shared favorite state, sticky catalog/tools, compact scroll header and bottom actions.
Evidence: course-preview.png and course-catalog-preview.png at 393 × 853. Visual check found excess overview spacing; reduced subtitle margins and lower padding. Scroll check shows tools at the same intended position and episode titles/rows aligned with source. Corrected download/document icon size inherited from metadata icons.
Verified homepage entry, title and 7 rows, PageDown compact header, sorting first row to episode 07, intro/catalog tab switching, favorite toggle, return to homepage, search result entry with selected title, and restoration to search results. No console errors. Syntax checks passed; detector returned [].
Scope: only 7 supplied episode records are modeled; remaining course catalogs await data. Intro has existing factual metadata only. Audio, transcripts, purchase and gift flows are not connected and display pending-content messages. No fake downloads or audio playback are performed.
final result: passed (catalog screenshot batch).

## Poetry introduction screenshot batch
Sources: supplied 04_課程頁_Tab簡介1–5.jpg. Added source-cropped full cover and speaker portrait; 8 metadata items; content description, units, purchase notice and speaker sections with separate fade/clamp and expand/collapse controls. Only visible supplied text is modeled. No invented additional units. Poetry course opens intro by default; palace still opens catalog.
Visual verification at 393 × 853: initial intro, metadata grid, sticky tab/header, speaker portrait and biography inspected against source. Source teal title bars retained despite mechanical detector's generic accent-stripe warning. Screenshots: course-intro-preview.png and course-speaker-preview.png. Native mock status indicators and installed font rendering remain existing differences.
Browser tests: four sections and 8 facts; independent expansion; collapse; tab switch preserves expanded state; image loading complete; palace still defaults to catalog with 7 episodes; no browser errors. JavaScript syntax checks pass.
final result: passed (introduction screenshot batch).

## Course download, favorite toast and transcript batch
References: latest three attached screenshots and local 04_課程頁_下載按鈕.jpg. Added exact east-west full artwork, 3 visible episode rows, mock-owned view, 47MB size. Download queue supports single, batch, cancellation, completion, persistent demo records and delete. Progress UI uses transform animation. No actual files or network downloads are claimed.
Favorite toggle keeps shared saved set, red filled heart and centered mascot toast; mascot derived from existing artwork with white alpha. Transcript page uses supplied screenshot text for the first east-west episode plus explicitly marked mock remainder; other course text is marked demo. Scrollable article, fixed back/play header, original course state restored on back.
Browser verified single download shows 0/1, completion icon persists, second download canceled, batch skips completed episode and shows 0/2, delete disables delete-all, restart and cancellation succeed. Favorite true plus 已加入收藏, transcript title and return checked, no console errors. JS syntax passes. Evidence: course-download-preview.png, course-favorite-preview.png, transcript-preview.png. Visual correction: toast vertically centered; progress transition moved from width to transform.
final result: passed (interactive mock scope).

## Introduction consistency fix
Cause: only poetry had the complete introduction; other courses retained the original brief metadata block. Replaced fallback with shared full sections generated from selected course metadata and visible episode data; preserved poetry source. Added cache version parameters and reset scrolled tab switching to content start. Verified palace has 4 expandable sections and 7 listed units; description toggles; east-west has 4 sections; poetry source remains; no console errors; syntax checks pass. Evidence: course-intro-all-preview.png. final result: passed.

## Mini player screenshot batch
Sources: user-provided 04_課程頁_播放按鈕_miniplayer1/2.jpg. Added shared simulated playback state for course episode, trial, and transcript entrypoints. Dark bottom mini player matches title, author, elapsed/duration, seek bar, play/pause, upward control and paused close. Active catalog row syncs highlight, icon and elapsed. Progress timer uses elapsed performance time; pausing clears interval, end pauses, switching episode resets. Reopening or navigating course surfaces preserves current player state; closing clears active row. No actual sound or audio network connection.
Browser checked: course episode starts 02:25 track with 1 active row; pause label becomes play; +15s moves 00:44 to 00:59; transcript episode 2 switches title and marks correct catalog row on return; range keyboard seek works; close hides player and clears row; poetry trial starts matching first episode; no console errors. Syntax check passed; detector []. Evidence: mini-player-playing-preview.png, mini-player-paused-preview.png. Visual pass adjusted opaque background and active-row spacing; positions align above course footer. Full-player screen was not requested; expand reveals compact skip controls.
final result: passed (simulated mini player scope).

## Remaining authorized mock flows completion
References inspected: local gift confirmation, checkout, checkout coupon, coupon list and my-list purchased/favorites/borrowed/history screenshots. Built checkout selection and 50-point discount; 9 mock coupons; local-only redemption and purchased lesson unlock; gift confirmation and concrete GIFT-DEMO code artifact; library category screens; history and clear; offline records and removal. Filled unprovided catalog rows with explicitly labeled demo units and correct 20-item range pagination. Source known units remain intact. Restored background inert states on course close.
Verification: palace price 1280 → 1230 with coupon; 9 coupons; redemption disables purchase and removes locked rows; purchased list 2 courses after demo action; favorites count tracks shared saved set; borrowed empty state; cancel and confirm gift; generated code visible; history created and cleared; download manager shows completed course after progress; 21–24 range contains 4 rows with reverse order; terms webview unaffected. Poetry checkout 499 → 449 checked. All scoped images loaded, no horizontal overflow, no browser errors. All JS syntax checks passed. Detector generic separator warnings correspond to supplied source layout and were retained.
Visual pass at desktop and 393×853 corrected checkout course spacing and hidden discount/filter rules. Evidence: checkout-preview.png, library-preview.png, gift-preview.png. README records how to launch and explicit simulation boundaries.
final result: passed (current screenshot-backed mock scope). Live authentication, real payments/points, valid gift redemption and actual audio are intentionally unconnected rather than claimed complete.

## Shared checkout entrypoint correction
Verified gift dialog then confirm opens 立即購買; direct purchase enters same page; both confirm buttons say 立即兌換. Poetry direct amount 499 and palace gift amount 1280 match selected metadata. Dialog source copy preserved. Closing checkout clears its inert state and restores originating course focus. No browser errors. Evidence: gift-confirm-preview.png, gift-checkout-preview.png. Syntax check passed. final result: passed.

## Coupon state screenshot batch
References: latest 4 attached screenshots. Refactored fixed coupon rows into a small wallet model, native circular checkbox and derived totals. Default selectable 9 coupons; choose one returns checkout with filled teal check, 折抵 50 點, negative discount detail, correct payable. Uncheck returns base price, recheck reuses selection. Limited discount to price; coupon consumed only on local mock redemption. Separate self/gift counts, empty dashed box, gift cards with two used records and one send action. Added isolated deep-link preview datasets, documented in README.
Browser verified 9 rows; 499→449 after selection; uncheck 499 and hidden detail; recheck 449. Empty preset checkbox disabled, empty list can open and return with checkout interactive. Gift preset self13/gift3, 3 gift cards, 2 used, 1 available; cancel preserves availability and restores list interactivity. First checkbox click with no selection opens list (setChecked automation correctly reports it does not remain checked until a coupon is picked); selecting then sets checked=true. No missing images or horizontal overflow. JS syntax check passes. Generic detector thick-border warnings correspond to source pale dividers. Browser console contained extension asynchronous-message-channel warnings unrelated to application handlers; no application exception observed during these flows.
Visual check corrected gift-card height, removed visible list scrollbar and avoided initial keyboard focus ring on direct standalone preview. Evidence: coupon-selected-preview.png, coupons-empty-preview.png, coupons-gift-preview.png.
final result: passed (coupon mock states).

## Coupon information dialog
Source: latest supplied screenshot. Matched white modal, 60% black backdrop, 335px-wide card at 393px viewport, heading and verbatim supplied rule text. Screenshot: coupon-rules-preview.png. Verified info opens dialog, close removes background inert while retaining list, Escape closes only modal, focus restored to info button. Syntax checks pass. final result: passed.
