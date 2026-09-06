---
id: aria13:attribute:aria-pressed
ref: aria13
type: state
title: aria-pressed state
attribute: aria-pressed
kind: state
used_in_roles:
  - button
value: tristate
version_line: WAI-ARIA 1.3
spec_status: WD
source_url: https://w3c.github.io/aria/#aria-pressed
upstream_updated: 2026-08-29
upstream_commit: 2f5c69b053c2b03f03fb00b4c9ff2c4ce517af55
license: W3C Document License / W3C Software and Document Notice
related: []
tags: []
---

Indicates the current "pressed" [state](../terms/state.md) of toggle buttons. See related [`aria-checked`](./aria-checked.md).

| Value                   | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| false                   | The element supports being pressed but is not currently pressed. |
| mixed                   | Indicates a mixed mode value for a tri-state toggle button.   |
| true                    | The element is pressed.                                       |
| **undefined (default)** | The element does not support being pressed.                   |
