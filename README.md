# billy-builder

> Billy Builder :musical_note:  
> Can we fix it? :musical_note:  
> Billy Builder :musical_note:  
> Yes, we can! :musical_note:

Billy-builder is a collection of Grunt tasks that makes it easy to manage multiple JavaScript projects meant to be
consumed in a browser.

We use it at [Billy's Billing](https://billysbilling.com/) to build and test all our webapps and components in a unified
way.

## Readme TODO

- The tasks
- Explain require with templates
- Explain the build process
- Explain svg

## Code TODO

- The watch task should use the same logic as js-modularize.js and compass/sass to find the relevant file paths to watch.
- Tests :whale2:
- Maybe split a few things into their own modules (such as js-modularizer).
- Toggle ember-testing container
- Multiple server ports
- Make the `images` task into a copy task, that can be configured for multiple targets. E.g. "images" and "fonts"
- Make svg optional


## Installation

Billy-builder depends on [grunt-cli](https://github.com/gruntjs/grunt-cli) and [bower](http://bower.io/) to be installed
globally first. Easy way: `npm install -g grunt-cli bower`.

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

In your `Gruntfile.js` you can add a key called `billy-builder` to customize the behavior of billy-builder. Example:

```javascript
module.exports = function(grunt) {
    grunt.initConfig({
        'billy-builder': {
          title: 'Billy\'s Billing',
          compass: true,
          jsConfig: {
            ENV: {
              apiUrl: 'https://api.billysbilling.com/v2'
            }
          }
        }
    });
    
    grunt.loadNpmTasks('billy-builder');
};
```

The following options are supported:

#### title

Type: `String`  
Default: `'Unnamed billy-builder app'`

What the `<title>` element's content will be in your `index.html`.


#### favicon

Type: `String`  
Default: `'/releases/:release_name/images/favicon.ico'` (if the file exists, `null` otherwise)

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
  var MyConfig = {"cool": true};
  </script>
  ...
</head>
...
```

This is useful for injecting app specific variables into the html page.


#### indexJsConfig

Type: `Object`  
Default: `{}`

Same as `jsConfig`, but only applies to `index.html`.

#### testsJsConfig

Type: `Object`  
Default: `{ENV: {isTest: true}}`

Same as `jsConfig`, but only applies to `tests.html`.

With the default setting you can check `ENV.isTest` to see if the page is in test mode or not.

#### version

Type: `String`  
Default: `'default'`

Determines which directory the compiled resources are saved to. A value of `2013-10-12T13:45:21` will put all the js and
css files under `releases/2013-10-12T13:45:21` in the `dist` folder.

This is useful when building production builds to avoid caching issues, and to ensure that half a new version is not
served (in case a user requests the page while only the new css file has been upload for instance). Just make sure to
upload `index.html` last, i.e. after all js, css and images have been uploaded.

#### extraDependencyDirs

Type: `Array`  
Default: `[]`

Tells billy-builder which directories to look for Bower components in.

Usage example: Say you have a bunch of to-become-bower-components that you haven't moved out of your main repo yet.
Then you can place them all in a directory e.g. named `new_components` and version control them, and set
`extraDependencyDirs` to `['new_components']`. Eventually you should split them into their own repos
though.

#### sass

Type: `Object`  
Default: `null`

When set to an object with a key named `sassFile`, that file will be compiled using
[node-sass](https://github.com/andrew/node-sass) and saved to `dist/releases/:release_name/css/bundle.css`.

Example:

```javascript
grunt.initConfig({
  'billy-builder': {
    sass: {
      sassFile: 'srcs/scss/bundle.scss'
    }
  }
});
```

Default (`null`) means no SASS compiling.

Unless you have dependencies on mixins or functions from Compass, this is the preferred way. Node SASS is _much_ faster
at compiling than Compass.


#### compass

Type: `Object`  
Default: `null`

When set to an object with a key named `sassDir`, that directory will be compiled using
[Compass](http://compass-style.org/) and saved to `dist/releases/:release_name/css`.

Example:

```javascript
grunt.initConfig({
  'billy-builder': {
    compass: {
      sassDor: 'srcs/scss'
    }
  }
});
```

Your `sassDir` must contain a file named `bundle.scss`. This is so that the `index.html` file can include the correct
css file. All other files under this directory should be includes (i.e. be prefixed with `_`).

Default (`null`) means no Compass compiling.

Enabling this option requires you to have `compass` installed locally and accessible as `compass` in your PATH.


## Grunt tasks

### grunt build

This task does the following:

- 

### grunt watch


### grunt server


### grunt test


## Running tasks for production

You can run any task in production mode by prepending `NODE_ENV=production`. Example:

```
NODE_ENV=production grunt build
```

Will make a production-ready build. The differences are:

- JavaScript is minified using [uglify-js](https://github.com/mishoo/UglifyJS)
- When including bower dependencies in `bundle.js` a minified version will be preferred. If the `main` file of a
  dependency is `ember.js`, then billy-builder will look for a file named `ember.min.js` to use instead if it exists.
- CSS is also compiled in a minified way.


## Running tests in a browser

You can run the tests in a browser by running `grunt server` and go to `http://localhost:4499/tests.html`. 


## Running tests on Travis

This is a good starting point for your `.travis.yml`:

```
before_script:
  - gem install compass --no-rdoc --no-ri
  - npm install
  - npm install -g grunt-cli
  - npm install -g bower
  - bower install

script: grunt test
```

You can take out the `gem install compass` line if you're not using Compass.