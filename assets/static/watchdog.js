var Watchdog = (function() {


    var selectors = {
        countdown: '#reload-counter'
    }

    var lastTs = 0;
    var maxLag;
    var timer = false;

    var inCountdown = false;
    var fatalCountdown = 60;
    var fatalReloadTimer = false;
    var fatalCounterTimer = false;


    timerTick = function() {
        if (lastTs == 0) return;

        // don't raise an error if autorefresh is disabled
        if (!Config.GetOption('autorefresh').Get()) return;

        var now = moment().utc().unix();
        if (now - lastTs > maxLag) {
            $('#errors').html(haml.compileHaml('fatal-error')({
                last_ts: lastTs,
                seconds_left: fatalCountdown
            })).show();
            Counter.Unknown();
            if (!inCountdown) {
                fatalCountdown = 60;
                fatalReloadTimer = setTimeout(function() {
                    location.reload();
                }, 60 * 1000);
                fatalCounterTimer = setInterval(function() {
                    $(selectors.countdown).text(--fatalCountdown);
                }, 1000);
                inCountdown = true;
            }
        } else {
            inCountdown = false;
            if (fatalReloadTimer) clearTimeout(fatalReloadTimer);
            if (fatalCounterTimer) clearTimeout(fatalCounterTimer);
        }
    }


    init = function(interval, tolerance) {
        maxLag = tolerance;
        setInterval(timerTick, interval * 1000);
    }


    updateTs = function(ts) {
        lastTs = ts.utc().unix();
    }


    getTs = function() {
        return lastTs;
    }

    getFatal = function() {
        return inCountdown;
    }


    return {
        Init: init,
        Pong: updateTs,
        GetLastUpdate: getTs,
        IsFatal: getFatal
    }

}());
