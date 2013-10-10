var fs = require('fs'),
    page = require('webpage').create(),
    url = 'file://localhost'+require('fs').workingDirectory+'/dist/tests.html',
    failures = [],
    dotLineSize = 0,
    totalDots = 0,
    screenshotIndex = 0;

console.log('');

page.onError = function(message, trace) {
    console.log('Page error: '+message);
    console.log(trace);
    phantom.exit(1);
};

page.onInitialized = function() {
    page.evaluate(function() {
        window.isCli = true;
        window.document.addEventListener('DOMContentLoaded', function() {
            QUnit.log(function(details) {
                if (!details.result) {
                    window.callPhantom({
                        command: 'QUnit.assertionFailed',
                        details: details
                    });
                }
            });
            QUnit.testDone(function(result) {
                if (result.failed) {
                    window.callPhantom({
                        command: 'QUnit.testFailed'
                    });
                } else {
                    window.callPhantom({
                        command: 'QUnit.testPassed'
                    });
                }
            });
            QUnit.done(function(result) {
                window.callPhantom({
                    command: 'QUnit.done',
                    result: result
                });
            });
        });
    });
};

page.viewportSize = {
    width: 1024,
    height: 800
};

page.open(url, function(status) {
    if (status !== 'success') {
        console.log('\033[0;31mCould not open '+url+'\033[0m');
        phantom.exit(1);
        return;
    }
    var qunitMissing = page.evaluate(function() {
        return (typeof QUnit === 'undefined' || !QUnit);
    });
    if (qunitMissing) {
        console.error('\033[0;31mThe `QUnit` object is not present on this page.\033[0m');
        phantom.exit(1);
    }
});

page.onCallback = function(message) {
    switch (message.command) {
        case 'QUnit.assertionFailed':
            failures.push(message.details);
            break;
        case 'QUnit.testFailed':
            dot('0;31');
            break;
        case 'QUnit.testPassed':
            dot('0;32');
            break;
        case 'QUnit.done':
            done(message.result);
            break;
        case 'log':
            console.log('Page says: '+message.message);
            break;
        case 'render':
            var file = 'temp/screenshots/'+screenshotIndex+'-'+message.name+'.png';
            page.render(file);
            console.log('Rendered '+file);
            screenshotIndex++;
            break;
    }
};

page.onConsoleMessage = function(message) {
//    console.log('LOG: '+message);
};

function dot(color) {
    if (dotLineSize >= 100) {
        fs.write("/dev/stdout", " "+totalDots, "w");
        console.log('');
        dotLineSize = 0;
    }
    fs.write("/dev/stdout", "\033["+color+"m.\033[0m", "w");
    dotLineSize++;
    totalDots++;
}

function done(result) {
    console.log('');
    console.log('');
    console.log("Total assertions: " + result.total + ", Failed: " + result.failed + ", Passed: " + result.passed + ", Runtime: " + Math.ceil(result.runtime/1000)+'s');
    if (result.failed) {
        console.log('\033[0;31mTests failed\033[0m');
        console.log('');
        console.log('---------------------------------------------------------------------------');
        failures.forEach(function(details) {
            console.log(details.module + ': ' + details.name);
            if (typeof details.message == 'string') {
                console.log(details.message);
            }
            if (details.actual || details.expected) {
                console.log('Expected: '+JSON.stringify(details.expected));
                console.log('Result: '+JSON.stringify(details.actual));
            }
            if (details.message && details.message.stack) {
                console.log(details.message.stack);
            } else {
                console.log(details.source);
            }
//            console.log(JSON.stringify(details));
            console.log('---------------------------------------------------------------------------');
        }, this);
    } else {
        console.log('\033[0;32mAll tests passed\033[0m');
        console.log('');
    }
    phantom.exit(result.failed ? 1 : 0);
}