# HORO Seoul fan guide design

## 1. Atmosphere & identity

A compact concert program for use on a phone, including in a dark arena. Official poster photography carries the mood. Information and controls stay quiet and legible around it.

## 2. Color

The home hero keeps the existing deep wine background (`--bg-deep`), cream text (`--cream`), and gold (`--gold`). The guide uses a pale neutral canvas (`--page-light`), white reading surfaces (`--page-paper`), near-black text (`--page-ink`), and restrained gray metadata (`--page-muted`). Playback and the spoiler gate use charcoal (`--stage`) with one raised neutral surface (`--stage-surface`). Use the existing gold only for meaningful cues and selection. The chant, clap, wave, jump, and spin colors identify audience actions where the cue itself needs recognition. Avoid red page fills, decorative gradients, and color on every badge.

## 3. Typography

Pretendard Variable is the reading and control face, including Korean, Japanese fallback, and numeric data. Gmarket Sans Medium and Bold are for the tour title and page titles. Use a system monospace face for the large live countdown so every digit occupies the same width. Use tabular numerals for other times and song numbers. Body copy should keep Korean phrases together and should not use wide tracking or chromatic shadows.

## 4. Spacing & layout

The home hero owns its centered narrow column. Guide and setlist content use the existing 640px reading width; song playback retains its existing two-column layout above 900px. Use a 4px rhythm, with 16–20px row insets and 24–32px between separate decisions. Keep 40–44px touch targets for primary controls. A light guide followed by a charcoal playback stage provides the main visual rhythm; the poster remains the expressive image.

## 5. Components

- **Primary action:** solid cream fill, dark text; hover darkens slightly, focus has a visible outline.
- **Menu row:** one shared dark home surface with dividers between rows; hover is a quiet tonal change, focus is outlined. Existing accordion expansion remains.
- **Segmented control:** neutral track and one solid selected item; inactive items stay transparent.
- **Song row:** one white list surface, with only a hairline between neighboring songs; title first and supporting cues second. Keep cue icons identifiable while making their resting colors quiet.
- **Lyric row:** the current line stays fully opaque; other lines recede to half opacity while playback has a current line, and regain full opacity on hover or keyboard focus.
- **Overlay:** a solid charcoal surface and a restrained shadow only where it separates from underlying content.
- **Player controls:** a dedicated bottom utility bar takes its own space below the lyric scroller, so controls never cover lyrics. The video frame displays a loading message and a useful YouTube fallback when connection or playback fails.
- **System status:** do not show a persistent success badge for offline lyric caching. Show a message only when connectivity or an update requires action.
- **Spoiler gate:** keep the setlist absent from the rendered page until the visitor explicitly chooses a viewing mode. Put the safe return action first and require confirmation before switching from shuffled songs to concert order.

## 6. Motion & interaction

Use short color and opacity transitions for feedback. Keep existing motion that explains lyric timing and cheering actions. Remove decorative pulsing and layout movement. Respect reduced-motion preferences.

## 7. Depth & surface

Use tonal shifts and spacing for ordinary content. Reserve a hairline for neighboring list rows and a shadow for overlays. Poster images are the one expressive material; no blur or atmospheric gradient stacks over utility pages. The setlist warning photo is desaturated and dimmed to keep the warning legible without turning the whole page red.

## 8. Accessibility constraints & accepted debt

Keep visible keyboard focus, readable contrast in the arena, meaningful icon labels, and phrase-preserving Korean wrapping. The existing large single-file page and its inline SVG illustration remain; restructuring them is outside this visual pass.

The guide and song picker show persistent search labels, with 16px search text on phones. Sort and view controls expose their pressed state as ordinary buttons. Collapsed information cards and inactive screens stay out of keyboard and screen-reader navigation. When a song picker or notice image opens, focus moves into it; closing returns focus to the trigger.
