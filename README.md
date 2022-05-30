# Svis
![version](https://img.shields.io/badge/stable-1.0-blue) ![license](https://img.shields.io/badge/license-GPLv3-brightgreen)

Requires: Vue3, Node.js  
Stable tag: 1.1
License: GPL-3.0-or-later

Vue3 Image Slideshow component and "ready-to-use" script. Configurable and customizable.  

![Screenshot 1](https://github.com/jrmarco/svis/blob/main/screenshot/svis-1.png?raw=true)  
![Screenshot 2](https://github.com/jrmarco/svis/blob/main/screenshot/svis-2.png?raw=true)

## Description
Svis ( Simple Vue3 Image Slideshow ) it's a Vue3 component customizable and capable to display images as slideshow with fullscreen image loader, with controls. Package come as Vue3 component or minified script ready to use on your web page. 

Main features:

* Customizable options:
  * Component title ( prop: title )
  * Component language ( prop: lang )
  * Number of images per page ( prop: imagesPerPage, default: 5 )
  * Accept list of Images URL
  * Accept a list of Object with props
    * Props:
      * Image URL
      * Title, accept simple text or html ( opt )
      * Description accept simple text or html ( opt )
      * External URL ( opt )
* Fullscreen image
* Paginated results
* Slideshow key controlled
* Rotating image

### Installation & Requirements
If you want to build it you will need this libraries/application
* Node.js
* npm
* Vue3  

If you want to use it directly on your page, grab the minified JS file and CSS and put them in your page. You can take the index.html page in the public folder as example.

### Build project
```
Access svis directory:
 - npm install
 - npm run dev ( build development mode )
 - npm run prod ( build production mode )
 - npm run watch ( build development with watch mode )
 - npm run lint ( run es-linter with autofix )
```
 
### Sample
Use ready-made minified script into a web page
```
Please check index.html
```
Use component inside Vue
```
<template>
<---YOUR CODE--->

<svis-component 
    :settings="Settings as Object"
    :images="Array of Images url OR Array of objects"
/>

<---YOUR CODE--->
</template>

import Svis from './Svis';
<---YOUR IMPORT--->

export default {
  <---CLASS DATA--->
  components: { Svis, ... },
  <---CLASS DATA--->
```

###### Changelog
###### 1.0
* Release 1.0

#### Disclaimer
Svis (Component ad minified script) is provided with the "AS IT IS" formula. This software and his creator are not responsible for any damage/abuse arising the use of this class. Images displayed by this component are still property of their original own creator if protecteed by licenses/trademark/copyright. Software and creator are not resposible for creation and/or distribution of these images and cannot be legally responsible for any breaking law that involves these generated images and/or the original images used as source.