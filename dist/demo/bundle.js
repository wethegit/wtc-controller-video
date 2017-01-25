(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ExecuteControllers
 * Simple static class to instanciate and register all the controllers.
 *
 * @static
 * @author Marlon Marcello <marlon@wethecollective.com>
 * @version 1
 * @requirements
 * @created Nov 23, 2016
 */

/**
 * Stores controllers.
 * @type {Object}
 */
var controllersList = new Map();

var ExecuteControllers = function () {
  function ExecuteControllers() {
    _classCallCheck(this, ExecuteControllers);
  }

  _createClass(ExecuteControllers, null, [{
    key: 'instanciateAll',

    /**
     * Instanciate all the elements with registered controllers.
     * @param {String|Object} query  - Can be a string, ex: '[data-controller]' or
     *                                 an object, ex: {el: DOMNode, query: '[data-controller]'}
     * @param {String} controllerAtt - Attribute with the name of the controller.
     */
    value: function instanciateAll() {
      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-controller]';
      var controllerAtt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data-controller';

      var els = null;

      if (typeof query === 'string') {
        els = document.querySelectorAll(query);
      } else if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object') {
        if (!query.hasOwnProperty('el')) {
          throw 'Instanciate all is missing the DOMNode. Ex: instanciateAll({el: DOMNode, query: "[data-controller]"})';
        }

        if (!query.hasOwnProperty('query')) {
          query.query = '[data-controller]';
        }

        els = query.el.querySelectorAll(query.query);
      }

      if (els.length > 0) {
        for (var i = 0; i < els.length; i++) {
          var op = els[i];
          ExecuteControllers.instanciate(op, op.getAttribute(controllerAtt));
        }
      }
    }

    /**
     * Instanciate controller and saves it in the data attribute.
     * @param {DOMNode} el             - Element.
     * @param {string|class}  controllerName - Name of the registered controller, or a Class.
     *
     * @return {DOMNode} Element.
     */

  }, {
    key: 'instanciate',
    value: function instanciate() {
      var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var controllerName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      try {
        var controller = controllerName;

        if (typeof controllerName === 'string') {
          if (controllersList.has(controllerName)) {
            controller = controllersList.get(controllerName);
          } else {
            throw new Error('The controller \'' + controllerName + '\' has not been registered. Please make sure the controller is registering itself using ExecuteController.registerController(CLASS, \'OPTIONAL-NAME\').');
          }
        }

        var instance = new controller(el);

        return el;
      } catch (_error) {
        console.warn("Error: " + _error.message);
      }
    }

    /**
     * Registers controllers
     * @param {Class}  controller     - Controller.
     * @param {string} [controllerName=''] - Name of the controller
     */

  }, {
    key: 'registerController',
    value: function registerController(controller) {
      var controllerName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      try {
        if (!controllerName) {
          throw 'Controller name is required. Ex: ExecuteControllers.registerController(TestController, \'TestController\');';
        }

        if (controllersList.has(controllerName)) {
          console.warn('Controller ' + controllerName + ' is already registered.');
        } else {
          controllersList.set(controllerName, controller);
        }
      } catch (e) {}
    }

    /**
     * Get list of registered controllers.
     * @return {Map} List
     */

  }, {
    key: 'controllersList',
    get: function get() {
      return controllersList;
    }
  }]);

  return ExecuteControllers;
}();

/**
 * Element Controller
 * Base class to be extended by controllers.
 * It saves the instance and information on the element data for future reference.
 *
 * @static
 * @author Marlon Marcello <marlon@wethecollective.com>
 * @version 1
 * @requirements
 * @created Nov 23, 2016
 */


var ElementController = function () {
  function ElementController(element) {
    _classCallCheck(this, ElementController);

    this.element = element;
    this.element.data = this.element.data || {};
    this.element.data.controller = this;
    this.element.data.instanciated = true;
  }

  /**
   * Check if element exists in the DOM.
   * @return {Bool} True/False.
   */


  _createClass(ElementController, [{
    key: 'elementExistsInDOM',
    value: function elementExistsInDOM() {
      var element = void 0,
          exists = void 0;
      exists = this.element || null;
      if (!exists) {
        return false;
      }
      element = this.element;
      while (element) {
        if (element === document) {
          return true;
        }
        element = element.parentNode;
      }
      return false;
    }
  }]);

  return ElementController;
}();

// Export ElementController as defaultl


exports.default = ElementController;
exports.ExecuteControllers = ExecuteControllers;
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var utilities = {};

/**
 * randomBetween
 * Generate a random integer number max and min.
 * @min {number} Minimum value.
 * @max {number} Maximum value.
 * return {number} Random integer.
 */
utilities.randomBetween = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * getStyle
 * Get the current style value from an element.
 * @el {DOMNode} Target element.
 * @prop {string} CSS property name.
 * @stripUnit {boolean} Remove units.
 * return {string} Current CSS value WITH unit.
 */
utilities.getStyle = function (el, prop, stripUnit) {
  var strValue = "";

  if (window.getComputedStyle) {
    strValue = getComputedStyle(el).getPropertyValue(prop);
  }
  //IE
  else if (el.currentStyle) {
      try {
        strValue = el.currentStyle[prop];
      } catch (e) {}
    }

  if (stripUnit) {
    strValue = parseInt(strValue);
  }

  return strValue;
};

/**
 * Log
 * Simple log function to show different colors on the console.
 * @status {string} Status type.
 * @msg {string} Message to show.
 */
utilities.log = function (status, msg) {
  var bgc, color;

  switch (status) {
    case "success":
      color = "Green";
      bgc = "LimeGreen";
      break;
    case "info":
      color = "DodgerBlue";
      bgc = "Turquoise";
      break;
    case "error":
      color = "Black";
      bgc = "Red";
      break;
    case "warning":
      color = "Tomato";
      bgc = "Gold";
      break;
    default:
      color = "black";
      bgc = "White";
  }

  if ((typeof msg === "undefined" ? "undefined" : _typeof(msg)) === "object") {
    console.log(msg);
  } else {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + bgc + ";");
  }
};

/**
 * once
 * Fires an event only once and executes the callback.
 * @node {DOMElement} Dom element to attach event.
 * @type {String} Type of event.
 * @callback {function} Callback.
 */
utilities.once = function (node, type, callback) {
  node.addEventListener(type, function (e) {
    e.target.removeEventListener(e.type, arguments.callee);
    return callback(e);
  });
};

/**
 * shuffleArray
 * Shuffle an array.
 * @array Arrray to be shuffled.
 * return {array} Shuffled array.
 */
utilities.shuffleArray = function (array) {
  var currentIndex = array.length,
      temporaryValue,
      randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/**
 * fireCustomEvent
 * Fire a custom event.
 * @name {string} Name of the event.
 * @data {object} Object to be passed to the event.
 */
utilities.fireCustomEvent = function (name, data, bubbles, cancelable) {
  var ev;
  var params = {
    bubbles: bubbles || true,
    cancelable: cancelable || true,
    detail: data || null
  };

  if (typeof window.CustomEvent === "function") {
    ev = new CustomEvent(name, params);
  } else {
    ev = document.createEvent('CustomEvent');
    ev.initCustomEvent(name, params.bubbles, params.cancelable, params.detail);
  }

  window.dispatchEvent(ev);
};

/**
 * forEachNode
 * Loop through and array of DOM elements.
 * @array {DOM Node List} List of elements.
 * @callback {function} Callback.
 * @scope *optional {function} Scope to pass to callback.
 */
utilities.forEachNode = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

/**
 * getElementPosition
 * Get the position of the element relative to document.
 * @element {DOM Node} Element.
 * returns Object with element coordinates.
 */
utilities.getElementPosition = function (element) {
  var positionToViewport = element.getBoundingClientRect();

  var scrollTop = window.pageYOffset;
  var scrollLeft = window.pageXOffset;

  var clientTop = document.body.clientTop || 0;
  var clientLeft = document.body.clientLeft || 0;

  var top = positionToViewport.top + scrollTop - clientTop;
  var left = positionToViewport.left + scrollLeft - clientLeft;

  return {
    top: Math.round(top),
    left: Math.round(left)
  };
};

/**
 * getViewportDimensions
 * Get the browser window size.
 * retuns Object with dimensions.
 */
utilities.getViewportDimensions = function () {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  };
};

/**
 * classExtend
 * Extends a parent class.
 * @child {function} Child class.
 * @parent {function} Parent class.
 * returns updated Child class;
 */
utilities.classExtend = function (child, parent) {
  var hasProp = {}.hasOwnProperty;

  for (var key in parent) {
    if (hasProp.call(parent, key)) child[key] = parent[key];
  }

  function ctor() {
    this.constructor = child;
  }

  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;

  return child;
};

/**
 * HasClass
 * Checks for class on element.
 * @cl {string} Names. You can split the names with a space
 * @e {DOM Element} Element
 */
utilities.hasClass = function (cl, e) {

  var c, classes, i, j, len, len1;
  classes = cl.split(' ');

  if (e.classList) {
    for (i = 0, len = classes.length; i < len; i++) {
      c = classes[i];
      if (e.classList.contains(c) === true) {
        return true;
      }
    }
  } else {
    for (j = 0, len1 = classes.length; j < len1; j++) {
      c = classes[j];
      if (new RegExp('(^| )' + c + '( |$)', 'gi').test(e.c)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * RemoveClass
 * Remove class from element.
 * @c {string} name of the class
 * @e {DOM Element} Element
 */
utilities.removeClass = function (c, e) {

  var classes, i, j, len, len1;
  classes = c.split(' ');
  if (e.classList) {
    for (i = 0, len = classes.length; i < len; i++) {
      c = classes[i];
      e.classList.remove(c);
    }
  } else {
    for (j = 0, len1 = classes.length; j < len1; j++) {
      c = classes[j];
      e.className = e.className.replace(new RegExp('(^|\\b)' + c.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }
};

/**
 * AddClass
 * Add class to element.
 * @c {string} Name of the class
 * @e {DOM Element} Element
 */
utilities.addClass = function (c, e) {

  var classes, i, j, len, len1;
  classes = c.split(' ');

  if (e.classList) {
    for (i = 0, len = classes.length; i < len; i++) {
      c = classes[i];
      e.classList.add(c);
    }
  } else {
    for (j = 0, len1 = classes.length; j < len1; j++) {
      c = classes[j];
      e.className += ' ' + c;
    }
  }
};

/**
 * GetSiblings
 * Get siblings from element
 * @e {DOM Element} Element
 * @return Array of DOM Elements
 */
utilities.getSiblings = function (e) {

  return Array.prototype.filter.call(e.parentNode.children, function (child) {
    return child !== e;
  });
};

/**
 * Function to normalize the selctor 'matchesSelector' across browsers
 */
utilities.matches = function () {

  var doc, matches;
  doc = document.documentElement;
  matches = doc.matchesSelector || doc.webkitMatchesSelector || doc.mozMatchesSelector || doc.oMatchesSelector || doc.msMatchesSelector;

  return matches;
};

/**
 * Extend
 * Similar to jquery.extend, it appends the properties from 'options' to default and overwrite the ones that already exist in 'defaults'
 * @defaults {Object} Default values
 * @options {Object} New values
 */
utilities.extend = function (defaults, options) {

  var extended = {},
      key = null;

  for (key in defaults) {
    if (defaults.hasOwnProperty(key)) extended[key] = defaults[key];
  }

  for (key in options) {
    if (options.hasOwnProperty(key)) extended[key] = options[key];
  }

  return extended;
};

/**
 * Extends a base object with a series of other objects.
 *
 * @example
 * objA = {a: '1', b: '2', c: '3'};
 * objB = {d: {a: 'x', b: 'y', c: 'z'}};
 * objC = {b: 'foo'};

 * objD = utilities.deepExtend({}, objA, objB, objC);
 * // Outputs:
 * // [object Object] {
 * // a: "1",
 * // b: "foo",
 * // c: "3",
 * // d: [object Object] {
 * //   a: "x",
 * //   b: "y",
 * //   c: "z"
 * // }
}
 *
 * @static
 * @param  {...Object}   object      The objects to extend. The first object in the list will be the default.
 * @return {Object}                  The extended object in full.
 */
utilities.deepExtend = function () {

  if (Object.assign) {
    return Object.assign.apply(Object, arguments);
  }

  // This is here for older browsers
  var out = arguments[0] || {};
  var i = 0;
  var key = null;

  while (i++ < arguments.length) {
    var obj = arguments[i];
    if (obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == 'object') {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (_typeof(obj[key]) == 'object' && obj[key] != null) {
            out[key] = utilities.deepExtend(out[key], obj[key]);
          } else {
            out[key] = obj[key];
          }
        }
      }
    }
  }

  return out;
};

/**
 * Returns the CSS selector for a provided element
 *
 * @static
 * @param  {DOMElement}   el         The DOM node to find a selector for
 * @return {String}                  The CSS selector the describes exactly where to find the element
 */
utilities.getSelectorForElement = function (el) {
  var particles = [];
  while (el.parentNode) {
    if (el.id) {
      particles.unshift('#' + el.id);
      break;
    } else {
      if (el == el.ownerDocument.documentElement) particles.unshift(el.tagName);else {
        for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++) {}
        particles.unshift(el.tagName + ":nth-child(" + c + ")");
      }
      el = el.parentNode;
    }
  }
  return particles.join(" > ");
};

exports.default = utilities;
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wtcUtilityHelpers = require('wtc-utility-helpers');

var _wtcUtilityHelpers2 = _interopRequireDefault(_wtcUtilityHelpers);

var _wtcControllerElement = require('wtc-controller-element');

var _wtcControllerElement2 = _interopRequireDefault(_wtcControllerElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Video
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * A class to handle the different browser support for videos, specially fullscreen ambient videos.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Marlon Marcello <marlon@wethecollective.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 0.1.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @requirements wtc-utility-helpers, wtc-controller-element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @created Jan 25, 2017
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Video = function (_ElementController) {
  _inherits(Video, _ElementController);

  function Video(element) {
    var _ret2;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Video);

    // If set to the wrong node
    var _this = _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this, element));

    if (!Video.isVideo(element)) {
      console.warn('The node \n', element, '\n is not a video.');
      return _possibleConstructorReturn(_this);
    }

    _this.events = [];
    _this.fallback = _this.element.getAttribute('data-fallback') || _this.element.getAttribute('poster');
    _this.wrapper = document.createElement('div');
    _this.cover = document.createElement('div');
    _this.options = {
      fullscreen: _this.element.getAttribute('data-fullscreen') == 'true' ? true : false,
      onLoad: null
    };

    if (options) {
      _this.options = _wtcUtilityHelpers2.default.extend(_this.options, options);
    }

    // set base styles
    // set wrapper and video
    var klass = 'video-controller';

    if (_this.options.fullscreen) {
      klass += ' video-controller--fullscreen';
      _this.element.setAttribute('muted', '');
      _this.element.setAttribute('playsinline', '');
      _this.element.setAttribute('loop', '');
    }

    _wtcUtilityHelpers2.default.addClass(klass, _this.wrapper);

    // add elements
    _this.element.parentNode.insertBefore(_this.wrapper, _this.element);
    _this.wrapper.appendChild(_this.element);

    // set the cover
    if (_this.fallback) {
      _wtcUtilityHelpers2.default.addClass('video-controller__cover', _this.cover);
      _this.cover.style.backgroundImage = 'url(' + _this.fallback + ')';
      _this.wrapper.appendChild(_this.cover);
    }

    // if it's ios and version < 10
    // showfallback
    var isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIos) {
      var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      v = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)][0];

      if (v < 10) {
        var _ret;

        _this.showFallback('unsuported');
        return _ret = _this, _possibleConstructorReturn(_this, _ret);
      }
    }

    // prepare video
    // On any error to the video, we show the static version
    var onError = function onError(e) {
      _this.showFallback();
      _this.element.removeEventListener('error', onError);
      _this.removeGlobalListeners();
      console.warn('Video didn\'t load: ', e.error);
    };

    _this.element.addEventListener('error', onError, false);

    // preload and set correct size
    Video.preload(_this.element, function () {
      // get dimensions
      _this.videoWidth = _this.element.videoWidth;
      _this.videoHeight = _this.element.videoHeight;
      _this.videoRatio = (_this.videoWidth / _this.videoHeight).toFixed(2);

      // set the resize event
      _this.resize();
      _this.addGlobalListener(window, 'resize', function () {
        _this.resize();
      });

      // add classes
      _wtcUtilityHelpers2.default.addClass('is-loaded', _this.wrapper);

      // play
      _this.element.play(0);

      // fire onload hook
      if (_this.options.onLoad) {
        _this.options.onLoad();
      }
    });

    return _ret2 = _this, _possibleConstructorReturn(_this, _ret2);
  }

  _createClass(Video, [{
    key: 'addGlobalListener',
    value: function addGlobalListener(obj, evt, listener) {
      var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      this.events.push({
        obj: obj,
        evt: evt,
        listener: listener,
        useCapture: useCapture
      });
      obj.addEventListener(evt, listener, useCapture);
    }
  }, {
    key: 'removeGlobalListeners',
    value: function removeGlobalListeners() {
      this.events.forEach(function (eventRef) {
        eventRef.obj.removeEventListener(eventRef.evt, eventRef.listener, eventRef.useCapture);
      });
    }
  }, {
    key: 'showFallback',
    value: function showFallback() {
      var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'error';

      _wtcUtilityHelpers2.default.addClass('is-' + reson, this.wrapper);
    }
  }, {
    key: 'resize',
    value: function resize() {
      if (this.elementExistsInDOM()) {
        // Get the container's computed styles
        //
        // Also calculate the min dimensions required (this will be
        // the container dimentions)
        var containerStyles = window.getComputedStyle(this.wrapper),
            minW = parseInt(containerStyles.getPropertyValue('width')),
            minH = parseInt(containerStyles.getPropertyValue('height'));

        // What's the min:intrinsic dimensions
        //
        // The idea is to get which of the container dimension
        // has a higher value when compared with the equivalents
        // of the video. Imagine a 1200x700 container and
        // 1000x500 video. Then in order to find the right balance
        // and do minimum scaling, we have to find the dimension
        // with higher ratio.
        //
        // Ex: 1200/1000 = 1.2 and 700/500 = 1.4 - So it is best to
        // scale 500 to 700 and then calculate what should be the
        // right width. If we scale 1000 to 1200 then the height
        // will become 600 proportionately.
        var widthRatio = minW / this.videoWidth,
            heightRatio = minH / this.videoHeight;

        // Whichever ratio is more, the scaling
        // has to be done over that dimension
        if (widthRatio > heightRatio) {
          var newWidth = minW;
          var newHeight = Math.ceil(newWidth / this.videoRatio);
        } else {
          var newHeight = minH;
          var newWidth = Math.ceil(newHeight * this.videoRatio);
        }

        this.element.style.width = newWidth + 'px';
        this.element.style.height = newHeight + 'px';
      } else {
        this.removeGlobalListeners();
      }
    }
  }], [{
    key: 'getTagName',
    value: function getTagName(el) {
      return el.tagName.toLowerCase();
    }
  }, {
    key: 'isVideo',
    value: function isVideo(el) {
      return Video.getTagName(el) === 'video' ? true : false;
    }
  }, {
    key: 'preload',
    value: function preload(item, callback) {
      var videoTag = item;

      if (callback) {
        if (videoTag.readyState >= videoTag.HAVE_ENOUGH_DATA) {
          callback(item);
        } else {
          (function () {
            var handler = function handler() {
              callback(item);
              videoTag.removeEventListener('canplay', handler);
            };

            videoTag.addEventListener('canplay', handler);
          })();
        }
      }

      videoTag.load();
    }
  }]);

  return Video;
}(_wtcControllerElement2.default);

_wtcControllerElement.ExecuteControllers.registerController(Video, 'Video');

exports.default = Video;


_wtcControllerElement.ExecuteControllers.instanciateAll();

},{"wtc-controller-element":1,"wtc-utility-helpers":2}]},{},[3]);
