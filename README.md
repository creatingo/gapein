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
The following code uses the default options: 
``` html
<!--  GAPEIN gallery No.1 START -->
<!--  All gallery items, including flexible preview box, are inside the HTML element with random ID -->
<div id="my_first_gallery" class="container-fluid">
   <div class="row gapein">
      <!--  Gallery item is defined by defaulted CSS class "gapein-item" -->
      <!--  It can also act as "starter" after it is selected - CSS class "gapein-trigger" -->
      <!--  By CSS class "gapein-data" it is marked the element, which contains the data source (data attributes) for preview/details -->
      <img class="col-6 col-md-4 col-lg-3 col-xl-2 gapein-item gapein-trigger gapein-data" src="gallery/crop/a-gal-01.jpg" data-src_img="gallery/full/a-xgal-01.jpg" data-title="Cat" data-description="photo manipulation"  data-href_livepreview="http://www.creatingo.com" />
      ...
      <!--  Gallery items -->
      ...          
```
Data attributes can have various names **data-something**, but please bear in mind, that these names will be used in preview element as CSS classes. This allows to assign the value of data to atribute of corresponding element.

To load the picture in full size it is needed the attribute **data-src\_andsomething**.

The attribute **data-href\_andsomething** is useful in case you like to direct the link to e.g., LIVEPREVIEW.

Preview element is marked by CSS class "gapein-preview" and it contains:
``` html
      ...
      <!--  Gallery items -->
      ...
      <!--  GAPEIN preview -->
      <div class="gapein-preview" style="display: none; opacity: 0; transform: translateY(0px);">
        <!--  Close button "gapein-close" class -->
        <a href="#" class="gapein-close">X</a>
        <div class="container-fluid">
          <div class="row">
            <div class="content col-12 col-xl-8">
              <!-- Details element "gapein-detail" and also the name of the class corresponding to the data attribute -->
              <img src="" class="img gapein-detail" />
            </div>
            <div class="content col-12 col-xl-4">
              <!-- Details elements "gapein-detail" and also the name of the class corresponding to the data attribute -->
              <h3 class="title gapein-detail"></h3>
              <p class="description gapein-detail"></p>
              <!-- "gapein-link" class is needed to run the default behavior by clicking on the link -->
              <a href="#" class="livepreview gapein-detail gapein-link" target="_blank">LIVE PREVIEW</a>
            </div>
          </div>
        </div>
      </div>
  </div>
</div>
<!--  GAPEIN gallery No.1 END -->
```
3. At the end of HTML code enter the minimalized version of javascript file and short js code, which will initialise the Gapein gallery (we recommend to use the function "window.onload" or its suitable alternative)
``` html
<!--  GAPEIN source file -->
  <script src="js/gapein.min.js" type="text/javascript"></script>

  <script>
    // Dokument ready vanilla js alternative
    var ready = function(fn) {
      if (typeof fn !== 'function') return;
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        return fn();
      }
      document.addEventListener('DOMContentLoaded', fn, false);
    };

    // Run scripts when the document is ready as a callback
    ready(function() {

      // Initialize GAPEIN with default options
      var gallery01 = document.getElementById('my_first_gallery');
      gapein.init(gallery01);

    });

  </script>
```
