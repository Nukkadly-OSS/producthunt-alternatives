# Product Hunt Alternatives Directory visual system

Standalone directory. The visual system lives in `assets/directory.css`. It uses neutral black, white, and restrained gray tokens in both light and dark themes. Page layout uses `dir-*` classes.

Keep the sidebar plus list. Use the documented heading, caption, and metadata classes. Links stay underlined. Avoid one-off font sizes.

The sidebar heading sits directly on the local editorial artwork. Category links have no container fill or border. The current category uses bold high-contrast text, and hover changes text color only.

The canvas is a centered column with page gutters. The top bar holds search, a light or dark mode control, and Submit yours. A second bar holds filter and sort listboxes. The open menu uses the same surface, border, radius, and hover fill as the other controls. `contribute.html` uses the same shell without that toolbar.

## Layout

- One `h1` in the sidebar. Category groups use `h2`.
- Flex and grid children that hold text use `min-width: 0`.
- Below 820px the sidebar stacks and category buttons scroll sideways.
- Hover changes color only. No shadows. No motion on hover.
- Product favicons load from each product's own `/favicon.ico`. A text initial remains visible if the remote icon fails.
