# billy-builder

> Billy Builder :musical_note:  
> Can we fix it? :musical_note:  
> Billy Builder :musical_note:  
> Yes, we can! :musical_note:

Billy-builder is a collection of Grunt tasks that makes it easy to manage multiple JavaScript projects meant to be consumed in a browser.

We use it at [Billy's Billing](https://billysbilling.com/) to build and test all our webapps and components in a unified way.


## TODO

- Toggle ember-testing container
- Multiple server ports
- Make the `images` task into a copy task, that can be configured for multiple targets. E.g. "images" and "fonts"


## Installation

Billy Builder depends on [grunt-cli](https://github.com/gruntjs/grunt-cli) and [bower](http://bower.io/) to be installed globally first.

Add `billy-builder` as an npm dev-dependency:
 
```
npm install billy-builder --save-dev
```

Add a `Gruntfile.js` to your project root where you load the tasks from billy-builder:

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        //Your normal grunt config
    });
    
    grunt.loadNpmTasks('billy-builder');
};
```


## Configuration

### Declare dependencies using `bower.json`

Add a `bower.json` and declare your dependencies as described [here in the Bower documentation](http://bower.io/#defining-a-package).

You can then run `bower install`, which will install the dependencies in the `bower_components` directory.


### Customizing billy-builder

In your `Gruntfile.js` you can add a key called `billy-builder` with the following options.

#### title

Type: `String`  
Default: `Unnamed billy-builder app`

What the `<title>` element's content will be in your `index.html`.


#### favicon

Type: `String`  
Default: `/releases/:release_name/images/favicon.ico` (if the file exists, `null` otherwise)

Will add a favicon to your `index.html`.


#### jsConfig

Type: `Object`  
Default: `{}`

Each key in this object will be added to the `index.html` and `tests.html` in a script tag. Example:

```javascript
jsConfig: {
  ENV: {
    apiUrl: 'https://api.example.com/'
  },
  MyConfig: {
    cool: true
  }
}
```

Adds a `<script>` tag to the html files in the `<head>`:

```html
...
<head>
  ...
  <script>
  var ENV = {"apiUrl": "https://api.example.com/"};
  var ENV = {"cool": true};
  </script>
  ...
</head>
...
```

This is useful for injecting app specific variables into the html page.


#### indexJsConfig

Type: `Object`  
Default: `{}`

Same as `jsConfig`, but only adds variables to `index.html`.

#### testsJsConfig

Type: `Object`  
Default: `{ENV: {isTest: true}}`

Same as `jsConfig`, but only adds variables to `tests.html`.

With the default setting you can check `ENV.isTest` to see if the page is in test mode or not.

#### version

Type: `String`  
Default: `default`

Determines which directory the compiled resources are saved to. A value of `2013-10-12T13:45:21` will put all the js and
css files under `/releases/2013-10-12T13:45:21`.

This is useful when building production builds to avoid caching issues, and to ensure that half a new version is not
served (in case a user requests the page while only the new css file has been upload for instance).

#### dependencyDirs

Type: `Array`  
Default: `['bower_components']`

Tells billy-builder which directories to look for Bower components in.

Usage example: Say you have a bunch of to-become-bower-components that you haven't moved out of your main repo yet.
Then you can place them all in a directory e.g. named `new_components` and version control them, and set
`dependencyDirs` to `['bower_components', 'new_components']`. Eventually you shouldsplit them into their own repos
though.

#### compass

Type: `Boolean`  
Default: `false`

Whether you want billy-builder to compile SASS files from `src/scss` into `dist/releases/:release_name/css` using
Compass.


#### sass

Type: `Boolean`  
Default: `false`

Whether you want billy-builder to compile SASS files from `src/scss` into `dist/releases/:release_name/css` using
Node SASS.

Unless you have dependencies on mixins or functions from Compass, this is the preferred way. Node SASS is _much_ faster
at compiling than Compass.


## Grunt tasks

### grunt build

This task does the following:

- 

### grunt watch


### grunt server


### grunt test


## Running tasks for production


## Running tests in a browser

