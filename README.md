# GAPEIN.js
Lightweight (less than 6kB) vanilla javascript expanding preview/details for any kind of CSS grid gallery.
Similar to the effect seen, for example, on Google Images search result.

## FEATURES
- no dependencies, minimalistic, flexible
- works with any CSS framework
- easy to customize and use
- show preview/details without having to reload a page
- preview/details is available after full image is loaded
- unlimited amouth of details per item
- works in all modern browsers and IE10+

## HOW TO
1. Initially, we need a thumbnail grid. Doesn't matter if it is based on "float" or "flexbox".
   Include necessary CSS (less than 2kB).
``` html
<head>
  ...
  <!--  Feel free to use any CSS framework for this purpose -->
  <link rel="stylesheet" href="css/bootstrap-grid.min.css" type="text/css">
  <!--  Gapein basic styles -->
  <link rel="stylesheet" href="css/gapein.min.css" type="text/css">
  ...
</head>
```
2. It is necessary to follow some basic rules for proper functionality of the script. The usage of defaulted names of CSS classes is practical and it also allows to separate the functionality of the script from design.
⋅⋅⋅The following code uses the default options: 
``` html
<!--  All gallery items, including flexible preview box, are inside the HTML element with random ID -->
<div id="my_first_gallery" class="container-fluid">
   <div class="row gapein">
      <!--  Gallery item is defined by defaulted CSS class "gapein-item" -->
      <!--  It can also act as "starter" after it is selected - CSS class "gapein-trigger" -->
      <!--  By CSS class "gapein- data" it is marked the element, which contains the data source (data attributes) for preview/details -->
      <img class="col-6 col-md-4 col-lg-3 col-xl-2 gapein-item gapein-trigger gapein-data" src="gallery/crop/a-gal-01.jpg" data-src_img="gallery/full/a-xgal-01.jpg" data-title="Cat" data-description="photo manipulation"  data-href_livepreview="http://www.creatingo.com" />
      ...
      <!--  Gallery item is defined by defaulted CSS class "gapein-item" -->
      ...          
```
Data attributes can have various names \"**data-**something\", but please bear in mind, that these names will be used in preview element as CSS classes. This allows to assign the value of data to atribute of corresponding element.
To load the picture in full size it is needed the attribute \"**data-src\_**andsomething\".
The attribute \"**data-href\_**andsomething\" is useful in case you like to direct the link to e.g., LIVEPREVIEW
