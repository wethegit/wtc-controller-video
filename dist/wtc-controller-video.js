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