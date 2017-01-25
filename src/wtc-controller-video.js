/**
 * Video
 * A class to handle the different browser support for videos, specially fullscreen ambient videos.
 *
 * @author Marlon Marcello <marlon@wethecollective.com>
 * @version 0.1.0
 * @requirements wtc-utility-helpers, wtc-controller-element
 * @created Jan 25, 2017
 */
import _u from 'wtc-utility-helpers';
import {default as ElementController, ExecuteControllers}  from 'wtc-controller-element';

class Video extends ElementController {
  constructor (element, options = {}) {
    super(element)

    // If set to the wrong node
    if (!Video.isVideo(element)) {
      console.warn('The node \n', element, '\n is not a video.')
      return
    }

    this.events = []
    this.fallback = this.element.getAttribute('data-fallback') || this.element.getAttribute('poster')
    this.wrapper = document.createElement('div')
    this.cover = document.createElement('div')
    this.options = {
      fullscreen: (this.element.getAttribute('data-fullscreen') == 'true') ? true : false,
      onLoad: null
    }

    if (options) {
      this.options = _u.extend(this.options, options);
    }

    // set base styles
    // set wrapper and video
    let klass = 'video-controller'

    if (this.options.fullscreen) {
      klass += ' video-controller--fullscreen'
      this.element.setAttribute('muted', '')
      this.element.setAttribute('playsinline', '')
      this.element.setAttribute('loop', '')
    }

    _u.addClass(klass, this.wrapper)

    // add elements
    this.element.parentNode.insertBefore(this.wrapper, this.element);
    this.wrapper.appendChild(this.element)

    // set the cover
    if (this.fallback) {
      _u.addClass('video-controller__cover', this.cover)
      this.cover.style.backgroundImage = `url(${this.fallback})`
      this.wrapper.appendChild(this.cover)
    }

    // if it's ios and version < 10
    // showfallback
    let isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIos) {
      let v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
      v = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)][0]

      if (v < 10) {
        this.showFallback('unsuported')
        return this
      }
    }

    // prepare video
    // On any error to the video, we show the static version
    let onError = (e) => {
      this.showFallback()
      this.element.removeEventListener('error', onError)
      this.removeGlobalListeners()
      console.warn('Video didn\'t load: ', e.error, '\nShowing fallback instead.')
    }

    this.element.addEventListener('error', onError, false)

    // preload and set correct size
    Video.preload(this.element, () => {
      // get dimensions
      this.videoWidth = this.element.videoWidth
      this.videoHeight = this.element.videoHeight
      this.videoRatio = (this.videoWidth / this.videoHeight).toFixed(2)

      // set the resize event
      if (this.options.fullscreen) {
        this.resize()
        this.addGlobalListener(window, 'resize', ()=> {this.resize()})
      }

      // add classes
      _u.addClass('is-loaded', this.wrapper)

      // play
      this.element.play(0)

      // fire onload hook
      if (this.options.onLoad) {
        this.options.onLoad()
      }
    })

    return this
  }

  /**
   * Helper function to deal with global events
   * adding and removing global events using these function
   * helps avoid memory leaks.
   * @param {DOMNode}  obj        The element to attach the event, usually window
   * @param {String}  evt        The event name
   * @param {Function}  listener   The function to be called when the event fires
   * @param {Boolean} useCapture Same as the original addEventListener
   */
  addGlobalListener(obj, evt, listener, useCapture = false) {
    this.events.push({
      obj: obj,
      evt: evt,
      listener: listener,
      useCapture: useCapture
    })
    obj.addEventListener(evt, listener, useCapture)
  }

  /**
   * Helper function to remove the added global events
   */
  removeGlobalListeners() {
    this.events.forEach(function(eventRef) {
      eventRef.obj.removeEventListener(eventRef.evt, eventRef.listener, eventRef.useCapture);
    });
  }

  /**
   * Show the video cover image.
   * @param  {String} reason String to be added to the class on the wrapper
   */
  showFallback(reason = 'error') {
    _u.addClass(`is-${reson}`, this.wrapper)
  }

  /**
   * Resize the video based on the ratio
   * @return {[type]} [description]
   */
  resize() {
    if(this.elementExistsInDOM()) {
      // Get the container's computed styles
      //
      // Also calculate the min dimensions required (this will be
      // the container dimentions)
      let containerStyles = window.getComputedStyle(this.wrapper),
          minW = parseInt( containerStyles.getPropertyValue('width') ),
          minH = parseInt( containerStyles.getPropertyValue('height') )

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
      let widthRatio = minW / this.videoWidth,
          heightRatio = minH / this.videoHeight

      // Whichever ratio is more, the scaling
      // has to be done over that dimension
      if (widthRatio > heightRatio) {
        var newWidth = minW
        var newHeight = Math.ceil( newWidth / this.videoRatio )
      }
      else {
        var newHeight = minH
        var newWidth = Math.ceil( newHeight * this.videoRatio )
      }

      this.element.style.width = `${newWidth}px`;
      this.element.style.height = `${newHeight}px`;
    }
    else {
      this.removeGlobalListeners()
    }
  }

  /**
   * Helper function to get the name of a tag
   * @param  {DOMNode} el Element
   * @return {String}     Tag name
   */
  static getTagName(el) {
    return el.tagName.toLowerCase();
  }

  /**
   * Check is passed element is a video
   * @param  {DOMNode}  el Element
   * @return {Boolean}     True if it's a video
   */
  static isVideo(el) {
    return (Video.getTagName(el) === 'video') ? true : false;
  }

  /**
   * Loads video and fire callback
   * @param  {DOMNode}   item     Video
   * @param  {Function} callback  Callback function
   * @return {DOMNode}            Returns the passed video
   */
  static preload(item, callback) {
    let videoTag = item

    if (callback) {
      if (videoTag.readyState >= videoTag.HAVE_ENOUGH_DATA) {
        callback(item)
      }
      else {
        let handler = function(){
          callback(item);
          videoTag.removeEventListener('canplay', handler)
        }

        videoTag.addEventListener('canplay', handler)
      }
    }

    videoTag.load()

    return videoTag
  }
}

ExecuteControllers.registerController(Video, 'Video');

export default Video;
