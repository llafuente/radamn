// compat layer with internet explorer!
// define all function missing in ie!

if(!this.console) {
    this.console = {
        log: function() {},
        debug: function() {},
        warning: function() {},
        error: function() {},
        assert: function() {},
        info: function() {}
    };
}
