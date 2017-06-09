# GAPEIN.js
Lightweight (less than 6kB) vanilla javascript expanding preview/details for any kind of CSS grid gallery.
Similar to the effect seen, for example, on Google Images search result.
---
## FEATURES
- no dependencies, minimalistic, flexible
- works with any CSS framework
- easy to customize and use
- show preview/details without having to reload a page
- preview/details is available after full image is loaded
- unlimited amouth of details per item
- works in all modern browsers and IE10+

## HOW TO
1. **Initially, we need a thumbnail grid.** Doesn't matter if it is based on "float" or "flexbox".
``` html
<head>
  ...
  <!--  Feel free to use any CSS framework for this purpose -->
  <link rel="stylesheet" href="css/bootstrap-grid.min.css" type="text/css">
  ...
</head>
```
2. **Include necessary CSS** (less than 2kB)
``` html
<head>
  ...
  <link rel="stylesheet" href="css/bootstrap-grid.min.css" type="text/css">
  <!--  Gapein basic styles -->
  <link rel="stylesheet" href="css/gapein.min.css" type="text/css">
  ...
</head>
```
