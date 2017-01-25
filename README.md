# wtc-controller-video
A class to handle the different browser support for videos, specially fullscreen ambient videos.

## Install
```sh
$ npm install wtc-controller-video --save
```

## Usage
### Example
You can find an example inside [dist/demo](https://github.com/wethegit/wtc-controller-video/tree/master/dist/demo).

#### Using ExecuteControllers
Please refer to the [ExecuteController docs](https://github.com/wethegit/wtc-controller-element#how-to-instanciate-controllers).

### Add the CSS and JS
```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>Demo</title>
    <link rel="stylesheet" href="wtc-controller-video.css">
  </head>
  <body>
    <script src="bundle.js"></script>
  </body>
  </html>
```

### Instanciate the class on an element
```javascript
import Video from 'wtc-controller-video'

let myFullsreenVideo = new Video(document.querySelector('video')
```

## Options
You can use data attributes or pass the options when instanciating.
PS: When using **ExecuteControllers** you **MUST** use data attributes, also, the onLoad hook is not available.
```text
fullscreen: Boolean. Default = false
Sets the video to be fullscreen

fallback: String. Default = poster or data-fallback attributes
Sets the fallback image, this will be shown when there's an error with the video.

onLoad: Function. Default = null
Fires when the video loads.
```
