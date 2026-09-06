---
id: aria13:role:button
ref: aria13
type: role
title: button role
role: button
abstract: false
superclass_role:
  - widget
base_concept:
  - <button>
supported_states_and_properties:
  - aria-pressed
  - aria-disabled
inherited_states_and_properties:
  - aria-errormessage
  - aria-label
name_from:
  - contents
  - author
accessible_name_required: true
children_presentational: true
version_line: WAI-ARIA 1.3
spec_status: WD
source_url: https://w3c.github.io/aria/#button
upstream_updated: 2026-08-29
upstream_commit: 2f5c69b053c2b03f03fb00b4c9ff2c4ce517af55
license: W3C Document License / W3C Software and Document Notice
related:
  - aria13:attribute:aria-pressed
tags: []
---

An input that allows for user-triggered actions when clicked or pressed. See related [`link`](./link.md) and [widgets](../terms/widget.md).

Buttons support the optional [attribute]() [`aria-pressed`](../attributes/aria-pressed.md).

<table><caption>Characteristics:</caption><tbody><tr><th scope="row">Inherited States and Properties:</th><td><ul><li><a href="https://w3c.github.io/aria/#aria-errormessage"><code>aria-errormessage</code></a> <strong>(deprecated on this role in ARIA 1.2)</strong></li><li><a href="https://w3c.github.io/aria/#aria-label"><code>aria-label</code></a></li></ul></td></tr></tbody></table>
