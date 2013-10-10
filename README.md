# billy-builder

Description coming soon...

## TODO

- Toggle ember-testing container
- Multiple server ports
- Replace compass with sass, or make it optional which of compass and sass the project uses
- Make the `images` task into a copy task, that can be configured for multiple targets. E.g. "images" and "fonts"
- Split js build and css build up, so watch can be more effective.


## Building

Install [grunt-cli](https://github.com/gruntjs/grunt-cli).

Go to Terminal and `cd` into the billy-data folder and run:

```
npm install
bower install
grunt build
```

To build a production build, you use:

```
NODE_ENV=production grunt build
```

The built source code can then be found at `dist/releases/default/js/bundle.js`.

## Running tests

### In a browser

Just open the `tests.html` file in your browser. The test suite uses QUnit.

### From command line

Install [PhantomJS](http://phantomjs.org/).

From within your billy-data folder run:

```
phantomjs test-runner.js
```