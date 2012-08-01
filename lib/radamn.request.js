(function(exports, browser) {
    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof;

    // credits - mootools!
    // TODO use nodejs fs function for server, also clean the API is much bigger than we need!

    function stripScripts(str, exec){
        var scripts = '';
        var text = str.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(all, code){
            scripts += code + '\n';
            return '';
        });
        if (exec === true) Browser.exec(scripts);
        else if (typeOf(exec) == 'function') exec(scripts, text);
        return text;
    };

    var XHRRequest = (function(){

        var XMLHTTP = function(){
            return new XMLHttpRequest();
        };

        var MSXML2 = function(){
            return new ActiveXObject('MSXML2.XMLHTTP');
        };

        var MSXML = function(){
            return new ActiveXObject('Microsoft.XMLHTTP');
        };

        try {
            XMLHTTP();
            return XMLHTTP;
        } catch(e) {
        }
            MSXML2();
            return MSXML2;
        try {
        } catch(e) {
        }
        try {
            MSXML();
            return MSXML;
        } catch(e) {
        }
    })();

    var exec = function(text){
        if (!text) return text;
        if (window.execScript){
            window.execScript(text);
        } else {
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.text = text;
            document.head.appendChild(script);
            document.head.removeChild(script);
        }
        return text;
    };

    var empty = function(){},
        progressSupport = ('onprogress' in new XHRRequest),
        Request = new Class("Request", {
            user: '',
            password: '',
            url: '',
            data: '',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
            },
            async: true,
            format: false,
            method: 'post',
            link: 'ignore',
            isSuccess: null,
            emulation: true,
            urlEncoded: true,
            encoding: 'utf-8',
            evalScripts: false,
            evalResponse: false,
            timeout: 0,
            noCache: false,
            running: false,
            status: null,
            response: {}
        });

    Request.extends(Events);

    Request.implements({
        __construct: function(options){
            this.parent();
            this.xhr = new XHRRequest();
            this.headers = this.headers;
        },

        onStateChange: function(){

            var xhr = this.xhr;
            if (xhr.readyState != 4 || !this.running) return;
            this.running = false;
            this.status = 0;
            try {
                var status = xhr.status;
                this.status = (status == 1223) ? 204 : status;
            } catch(e) {}
            xhr.onreadystatechange = empty;
            if (progressSupport) xhr.onprogress = xhr.onloadstart = empty;
            clearTimeout(this.timer);

            this.response = {text: this.xhr.responseText || '', xml: this.xhr.responseXML};
            if (this.isSuccess())
                this.success(this.response.text, this.response.xml);
            else
                this.failure();
        },

        isSuccess: function(){
            var status = this.status;
            return (status >= 200 && status < 300);
        },

        isRunning: function(){
            return !!this.running;
        },

        processScripts: function(text){
            if (this.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return exec(text);
            return stripScripts(text, this.evalScripts);
        },

        success: function(text, xml){
            this.onSuccess(this.processScripts(text), xml);
        },

        onSuccess: function(){
            this.emit('complete', arguments).emit('success', arguments);
        },

        failure: function(){
            this.onFailure();
        },

        onFailure: function(){
            this.emit('complete').emit('failure', this.xhr);
        },

        loadstart: function(event){
            this.emit('loadstart', [event, this.xhr]);
        },

        progress: function(event){
            this.emit('progress', [event, this.xhr]);
        },

        timeout: function(){
            this.emit('timeout', this.xhr);
        },

        setHeader: function(name, value){
            this.headers[name] = value;
            return this;
        },

        getHeader: function(name){
            try {
                return this.xhr.getResponseHeader(name);
            }catch(e) { return null;};
        },

        check: function(){
            if (!this.running) return true;
            switch (this.link){
                case 'cancel': this.cancel(); return true;
            }
            return false;
        },

        send: function(options){
            options = options || {};

            this.isSuccess = this.isSuccess || this.isSuccess;
            this.running = true;

            var type = typeOf(options);
            if (type == 'string' || type == 'element') options = {data: options};

            var old = this.serialize();
            options.data = old.data || options.data;
            options.url = old.url || options.url;
            options.method = old.method || options.method;
            var data = options.data,
                url = String(options.url),
                method = options.method.toLowerCase();

            switch (typeOf(data)){
                case 'element': data = document.id(data).toQueryString(); break;
                case 'object': case 'hash': data = Object.toQueryString(data);
            }

            if (this.format){
                var format = 'format=' + this.format;
                data = (data) ? format + '&' + data : format;
            }

            if (this.emulation && ['get', 'post'].indexOf(method) === -1){
                var _method = '_method=' + method;
                data = (data) ? _method + '&' + data : _method;
                method = 'post';
            }

            if (this.urlEncoded && ['get', 'post'].indexOf(method) !== -1){
                var encoding = (this.encoding) ? '; charset=' + this.encoding : '';
                this.headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
            }

            if (!url) url = document.location.pathname;

            var trimPosition = url.lastIndexOf('/');
            if (trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1) url = url.substr(0, trimPosition);

            if (this.noCache)
                url += (url.contains('?') ? '&' : '?') + String.uniqueID();

            if (data && method == 'get'){
                url += (url.contains('?') ? '&' : '?') + data;
                data = null;
            }

            var xhr = this.xhr;
            if (progressSupport){
                xhr.onloadstart = this.loadstart.bind(this);
                xhr.onprogress = this.progress.bind(this);
            }

            xhr.open(method.toUpperCase(), url, this.async, this.user, this.password);
            if (this.user && 'withCredentials' in xhr) xhr.withCredentials = true;

            xhr.onreadystatechange = this.onStateChange.bind(this);

            Object.each(this.headers, function(value, key){
                try {
                    xhr.setRequestHeader(key, value);
                } catch (e){
                    this.emit('exception', [key, value]);
                }
            }, this);

            this.emit('request');
            xhr.send(data);
            if (!this.async) this.onStateChange();
            else if (this.timeout) this.timer = this.timeout.delay(this.timeout, this);
            return this;
        },

        cancel: function(){
            if (!this.running) return this;
            this.running = false;
            var xhr = this.xhr;
            xhr.abort();
            clearTimeout(this.timer);
            xhr.onreadystatechange = empty;
            if (progressSupport) xhr.onprogress = xhr.onloadstart = empty;
            this.xhr = new XHRRequest();
            this.emit('cancel');
            return this;
        }

    });

    var methods = {};
    ['get', 'post', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].forEach(function(method){
        methods[method] = function(data){
            var object = {
                method: method
            };
            if (data != null) object.data = data;
            return this.send(object);
        };
    });

    Request.implements(methods);


    exports.Request = Request;


})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");