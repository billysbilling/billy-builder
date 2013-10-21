var fs = require('fs'),
    system = require('system'),
    page = require('webpage').create(),
    url = system.args[1],
    failures = [],
    screenshotIndex = 0;

page.onError = function(message, trace) {
    console.log('');
    console.log(coloredText('Page error: '+message, '0;31'));
    console.log('');
    console.log('Stack trace:');
    console.log(JSON.stringify(trace, null, '  '));
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
            QUnit.moduleStart(function(details) {
                if (!details.result) {
                    window.callPhantom({
                        command: 'QUnit.moduleStart',
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
    width: 1324,
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
            //For now we just bail out early. Phantom has a problem continuing with the rest of the tests in some cases.
            console.log('');
            console.log('');
            logFailure(message.details);
            phantom.exit(1);
            break;
        case 'QUnit.testFailed':
            dot('0;31');
            break;
        case 'QUnit.testPassed':
            dot('0;32');
            break;
        case 'QUnit.moduleStart':
            console.log('\n\n'+coloredText(message.details.name+':', '0;37'));
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
    system.stdout.write(coloredText('.', color), "w");
}

function coloredText(text, color) {
    return "\033["+color+"m"+text+"\033[0m";
}

function done(result) {
    console.log('');
    console.log('');
    console.log("Total assertions: " + result.total + ", Failed: " + result.failed + ", Passed: " + result.passed + ", Runtime: " + Math.ceil(result.runtime/1000)+'s');
    if (result.failed) {
        console.log('\033[0;31mTests failed\033[0m');
        console.log('');
        console.log('---------------------------------------------------------------------------');
        failures.forEach(logFailure);
    } else {
        console.log('\033[0;32mAll tests passed\033[0m');
        console.log('');
    }
    phantom.exit(result.failed ? 1 : 0);
}

function logFailure(details) {
    console.log(details.module + ': ' + details.name);
    if (typeof details.message == 'string') {
        console.log(coloredText(details.message, '0;31'));
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
            console.log(JSON.stringify(details));
    console.log('---------------------------------------------------------------------------');
}