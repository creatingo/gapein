/*!
 * Gapein v1.0.0: Simple, expandable details.
 * (c) 2017 Jozef Dvorský
 * MIT License
 * http://github.com/creatingo/gapein !!!!!
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory(root));
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.gapein = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

  'use strict';

  //
  // Variables
  //

  var gapein = {}; // Object for public APIs
  var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
  //  vars;
  var dividerOffset = [0];

  var opts, eventTimeout, item, lastRow, ww;
  var firstShow = true;

  // Default opts
  var defaults = {
    itemClass: 'gapein-item',
    activeClass: 'gapein-active',
    triggerClass: 'gapein-trigger',
    dataClass: 'gapein-data',
    dividerClass: 'gapein-divider',
    dividerElem: 'div',
    loadingClass: 'gapein-loading',
    loadingHeight: '120',
    previewClass: 'gapein-preview',
    detailClass: 'gapein-detail',
    closeClass: 'gapein-close'
  };


  //
  // Methods
  //

  /**
   * A simple forEach() implementation for Arrays, Objects and NodeLists
   * @private
   * @param {Array|Object|NodeList} collection Collection of items to iterate
   * @param {Function} callback Callback function for each iteration
   * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
   */
  var forEach = function (collection, callback, scope) {
    if (Object.prototype.toString.call(collection) === '[object Object]') {
      for (var prop in collection) {
        if (Object.prototype.hasOwnProperty.call(collection, prop)) {
          callback.call(scope, collection[prop], prop, collection);
        }
      }
    } else {
      for (var i = 0, len = collection.length; i < len; i++) {
        callback.call(scope, collection[i], i, collection);
      }
    }
  };

  /**
   * Merge defaults with user options
   * @private
   * @param {Object} defaults Default opts
   * @param {Object} opts User opts
   * @returns {Object} Merged values of defaults and opts
   */
  var extend = function () {

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          // If deep merge and property is an object, merge properties
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for (; i < length; i++) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;

  };

  /**
   * Get the closest matching element up the DOM tree.
   * @private
   * @param  {Element} elem     Starting element
   * @param  {String}  selector Selector to match against
   * @return {Boolean|Element}  Returns null if not match found
   */
  var getClosest = function (elem, selector) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) {
        return elem;
      }
    }

    return null;

  };

  /**
   * Dividers tasks.
   * @private
   * @param  {String} task     heights/offsets
   */
  var eachDivider = function (task) {

    var dividers = opts.container.getElementsByClassName(opts.dividerClass);

    if (task === 'offset') {
      var action = function (divider) {
        dividerOffset.push(divider.offsetTop);
      };
    } else if (task === 'height') {
      var action = function (divider) {
        divider.style.height = '';
      };
    } else {
      return;
    }

    forEach(dividers, action);

  };

  /**
   * Show preview/details
   * @public
   * @param  {Element} item     Desired item
   */
  gapein.showPreview = function (item) {

    // One more check - FF45 issue
    if (firstShow) {

      var firstDivider = opts.container.getElementsByClassName('for-row-1')[0];
      if (firstDivider.offsetTop !== dividerOffset[1]) {

        dividerOffset = [0];
        // Get dividers positions from top
        eachDivider('offset');

      }
      firstShow = false;
    }

    // Target row
    var targetRow = item.getAttribute('data-row');

    // divider element
    var targetDivider = opts.container.getElementsByClassName('for-row-' + targetRow)[0];

    // Preview element
    var preview = document.getElementById(opts.previewId);

    preview.style.display = 'none';
    preview.style.opacity = '0';

    if (lastRow !== targetRow) {

      // Reset dividers heights
      eachDivider('height');

      var previewTop = 'translateY(' + dividerOffset[targetRow] + 'px)';

      preview.style.webkitTransform = previewTop;
      preview.style.msTransform = previewTop;
      preview.style.transform = previewTop;

      lastRow = targetRow;

    }

    // Loading status
    targetDivider.style.height = opts.loadingHeight + 'px';
    targetDivider.classList.add(opts.loadingClass);

    // Get proper element with data attributes
    if (item.classList.contains(opts.dataClass)) {
      var dataElement = item;
    } else {
      var dataElement = item.getElementsByClassName(opts.dataClass)[0];
    }

    // Try get all data attributes at once - modern browsers and IE11+
    var datas = dataElement.dataset;

    // Fallback for IE < 11
    if (typeof datas == 'undefined') {

      var datas = {};
      var attrs = dataElement.attributes;
      var attrsCount = attrs.length;

      for (var i = 0; i < attrsCount; i++) {
        var match = attrs[i].name.match(/^data-(.+)/);
        if (match) {
          datas[match[1]] = attrs[i].value;
        }

      }

    }

    // Remove "data-row" to prevert conflict
    var dataObj = extend({},datas);
    delete dataObj['row'];

    // Hide all preview details by default
    var details = preview.getElementsByClassName(opts.detailClass);

    forEach(details, function (detail) {

      // Hide all preview details by default
      detail.style.display = 'none';

      // Remove obsolete attributies by default
      if (detail.hasAttribute('src')) {
        detail.setAttribute('src', '');
      } else if (detail.hasAttribute('href')) {
        detail.setAttribute('href', '#');
      }

    });

    var preloadImg = false;
    var imgIsLoaded = false;
    var newImg = new Image();

    newImg.onerror = function () {
      console.error("Cannot load image");
    }

    // Add and show available details
    for (var key in dataObj) {
      if (dataObj.hasOwnProperty(key)) {

        var matchSrc = key.match(/^src_(.+)/);
        var matchHref = key.match(/^href_(.+)/);

        if (matchSrc) {

          // Add src attribute
          var el = preview.getElementsByClassName(key.slice(4))[0];

          if (el.tagName === 'IMG') {
            preloadImg = true;
            newImg.src = dataObj[key];
          }

          el.style.display = '';
          el.setAttribute('src', dataObj[key]);

        } else if (matchHref) {

          // Add href attribute
          var el = preview.getElementsByClassName(key.slice(5))[0];
          el.style.display = '';
          el.setAttribute('href', dataObj[key]);

        } else {

          // Insert content to HTML element if exist
          var el = preview.getElementsByClassName(key)[0];
          if (el) {
            el.style.display = '';
            el.innerHTML = dataObj[key];

          }
        }

      }
    };

    var showTime = function () {

      preview.style.display = 'block';

      setTimeout(function () {

        var previewHeight = preview.offsetHeight;

        targetDivider.classList.remove(opts.loadingClass);
        targetDivider.style.height = previewHeight + 'px';


        setTimeout(function () {
          preview.style.opacity = '1';
        }, 250);

      }, 150);

    };

    if (preloadImg) {
      newImg.onload = function () {
        setTimeout(function () {
          showTime();
        }, 600);
      }
    } else {
      showTime();
    }
    
  };

  /**
   * Hide preview/details
   * @public
   * @param  {Collection} items     All items
   */
  gapein.hidePreview = function (items) {


    if (!opts) return;

    forEach(items, function (item) {
      item.classList.remove(opts.activeClass); // Each navigation target
    });
    var preview = document.getElementById(opts.previewId);

    // Reset dividers heights
    eachDivider('height');

    preview.style.display = 'none';
    preview.style.opacity = '0';

  };

  /**
   * Handle click events
   * @private
   */
  var clickHandler = function (event) {

    // Don't run if right-click or command/control + click
    if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

    var target = event.target;
    var targetClassList = target.classList;

    // Don't execute default link behavior if it is not .gapein-link (class)
    if ((target.tagName === 'A' && !targetClassList.contains('gapein-link')) || targetClassList.contains(opts.triggerClass)) {
      event.preventDefault();
    }

    var items = opts.container.getElementsByClassName(opts.itemClass);

    // Click event on a trigger
    if (targetClassList.contains(opts.triggerClass)) {

      // Get proper item element
      if (targetClassList.contains(opts.itemClass)) {
        item = target;
      } else {
        item = getClosest(target, '.' + opts.itemClass);
      }
      // Don't run if the item not exist (just for sure) or if the item points to currently open preview
      if (!item || item.classList.contains(opts.activeClass)) {
        return;
      } else {

        // Active class management
        forEach(items, function (item) {
          item.classList.remove(opts.activeClass);
        });

        item.classList.add(opts.activeClass);
      }
      // Show preview (details)
      gapein.showPreview(item);

    }

    // Close preview (details)
    if (targetClassList.contains(opts.closeClass)) {

      gapein.hidePreview(items);

    }

  };

  /**
   * On window resize, only run events at a rate of 4fps for better performance
   * @private
   */
  var resizeThrottler = function (event) {

    if (!eventTimeout) {
      eventTimeout = setTimeout((function () {
        eventTimeout = null; // Reset timeout

        // Run only if width changed
        var cw = root.innerWidth;

        if (cw !== ww) {
          // Update current width
          ww = cw;
          
          // Preview element
          var preview = document.getElementById(opts.previewId);
          preview.style.display = 'none';
          preview.style.opacity = '0';
          var partial = true;
          gapein.destroy(partial);

          gapein.prep();

          var activeItem = opts.container.getElementsByClassName(opts.activeClass)[0];
          if (activeItem) {
            setTimeout(function () {
              gapein.showPreview(activeItem);
            }, 100);
          }
        }

      }), 250);
    }
  };


  /**
   * Data preparation - calculate current rows, add dividers
   * @public
   */
  gapein.prep = function () {
    if (!opts) return;

    var items = opts.container.getElementsByClassName(opts.itemClass);
    var itemsCount = items.length;
    var prevOffset = 0;
    var rowNum = 1;

    // Set data-row attribute for each item and create divider elements
    for (var i = 0; i < itemsCount; i++) {

      var curOffset = items[i].offsetTop;

      if (curOffset !== prevOffset) {

        // Insert divider before the new row of items
        var divider = document.createElement(opts.dividerElem);
        divider.setAttribute('class', opts.dividerClass + ' for-row-' + rowNum);

        items[i].parentNode.insertBefore(divider, items[i]);

        rowNum++;
        prevOffset = curOffset;

      }

      // Set data-row attribute
      items[i].setAttribute('data-row', rowNum);

      // Insert divider also after last item 
      if (i == (itemsCount - 1)) {

        var divider = document.createElement(opts.dividerElem);
        divider.setAttribute('class', opts.dividerClass + ' for-row-' + rowNum);

        items[i].parentNode.insertBefore(divider, items[i].nextSibling);

      }

    }

    //Set ID for this gallery preview
    var preview = opts.container.getElementsByClassName(opts.previewClass)[0];
    preview.id = opts.previewId;

    // Get dividers positions from top
    eachDivider('offset');

  };


  /**
   * Destroy the current initialization.
   * @public
   * @param  {Boolean}  Resize event - keep opts, listeners
   */
  gapein.destroy = function (resizeEvent) {


    if (!opts) return;

    var rowDatas = opts.container.getElementsByClassName(opts.itemClass);

    forEach(rowDatas, function (rowData) {
      rowData.removeAttribute('data-row');
    });

    var removeDividers = opts.container.getElementsByClassName(opts.dividerClass);

    while (removeDividers[0]) {
      removeDividers[0].parentNode.removeChild(removeDividers[0]);
    };

    if (!resizeEvent) {
      opts.container.removeEventListener('click', clickHandler, false);
      root.removeEventListener('resize', resizeThrottler, false);
      opts = null;
      eventTimeout = null;
    }

    lastRow = null;
    dividerOffset = [0];

  };

  /**
   * Initialize gapein
   * @public
   * @param {Object} opts User options
   */
  gapein.init = function (gallery, options) {

    // feature test
    if (!supports) return;
    
    if (!options) {
      var options = {};
      }
      
    options.container = gallery;
    options.previewId = gallery.id + '-preview';

    // Destroy any existing initializations
    gapein.destroy();

    // Merge user opts with defaults
    opts = extend(defaults, options);

    var checkLoads = function () {

      var items = opts.container.getElementsByClassName(opts.itemClass);
      var lastItem = items[items.length - 1];
      var isLoaded = lastItem.offsetHeight;

      if (isLoaded > 0) {
        // Set rows, add dividers (delay just for sure)
        setTimeout(gapein.prep(), 200);
      } else {
        // Looks like still not rendered. Check again with delay
        setTimeout(checkLoads, 200);
      }
    };

    // Check if last item is rendered before calculations
    checkLoads();

    // Window width
    ww = root.innerWidth;

    // Listen for all click events and resize event
    opts.container.addEventListener('click', clickHandler, false);
    root.addEventListener('resize', resizeThrottler, false);

  };


  //
  // Public APIs
  //

  return gapein;

}));
