;(function () {


    /**
     * Oliver Caldwell
     * http://oli.me.uk/2013/06/01/prototypical-inheritance-done-right/
     */

    if (!Object.create) {
        Object.create = (function () {
            function F() {
            }

            return function (o) {
                if (arguments.length != 1) {
                    throw new Error('Object.create implementation only accepts one parameter.');
                }
                F.prototype = o;
                return new F()
            }
        })()
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */) {

            if (this == null) {
                throw new TypeError();
            }
            var n, k, t = Object(this),
                len = t.length >>> 0;

            if (len === 0) {
                return -1;
            }
            n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }

    function extend(destination, source) {
        destination.prototype = Object.create(source.prototype);
        destination.prototype.constructor = destination;
        return source.prototype;
    }

    /**
     * EventEmitter v4.2.3 - git.io/ee
     * Oliver Caldwell
     * MIT license
     * @preserve
     */

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {
    }

    // Shortcuts to improve speed and size

    // Easy access to the prototype
    var proto = EventEmitter.prototype;

    /**
     * Finds the index of the listener for the event in it's storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (typeof evt === 'object') {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after it's first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        //noinspection JSValidateTypes
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of it's properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (type === 'object') {
            // Remove all events matching the regex.
            for (key in events) {
                //noinspection JSUnresolvedFunction
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    //noinspection JSValidateJSDoc,JSCommentMatchesSignature
    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Mixes in the given objects into the target object by copying the properties.
     * @param deep if the copy must be deep
     * @param target the target object
     * @param objects the objects whose properties are copied into the target
     */
    function mixin(deep, target, objects) {
        var result = target || {};

        // Skip first 2 parameters (deep and target), and loop over the others
        for (var i = 2; i < arguments.length; ++i) {
            var object = arguments[i];

            if (object === undefined || object === null) {
                continue;
            }

            for (var propName in object) {
                //noinspection JSUnfilteredForInLoop
                var prop = fieldValue(object, propName);
                //noinspection JSUnfilteredForInLoop
                var targ = fieldValue(result, propName);

                // Avoid infinite loops
                if (prop === target) {
                    continue;
                }
                // Do not mixin undefined values
                if (prop === undefined) {
                    continue;
                }

                if (deep && typeof prop === 'object' && prop !== null) {
                    if (prop instanceof Array) {
                        //noinspection JSUnfilteredForInLoop
                        result[propName] = mixin(deep, targ instanceof Array ? targ : [], prop);
                    } else {
                        var source = typeof targ === 'object' && !(targ instanceof Array) ? targ : {};
                        //noinspection JSUnfilteredForInLoop
                        result[propName] = mixin(deep, source, prop);
                    }
                } else {
                    //noinspection JSUnfilteredForInLoop
                    result[propName] = prop;
                }
            }
        }

        return result;
    }

    function fieldValue(object, name) {
        try {
            return object[name];
        } catch (x) {
            return undefined;
        }
    }

    function endsWith(value, suffix) {
        return value.indexOf(suffix, value.length - suffix.length) !== -1;
    }

    function startsWith(value, prefix) {
        return value.lastIndexOf(prefix, 0) === 0;
    }

    function stripSlash(value) {
        if (value.substring(value.length - 1) == "/") {
            value = value.substring(0, value.length - 1);
        }
        return value;
    }

    function isString(value) {
        if (value === undefined || value === null) {
            return false;
        }
        return typeof value === 'string' || value instanceof String;
    }

    function isFunction(value) {
        if (value === undefined || value === null) {
            return false;
        }
        return typeof value === 'function';
    }

    function log(level, args) {
        if (window.console) {
            var logger = window.console[level];
            if (isFunction(logger)) {
                logger.apply(window.console, args);
            }
        }
    }

    function backoff(step, min, max) {
        var jitter = 0.5 * Math.random();
        var interval = min * Math.pow(2, step + 1);
        if (interval > max) {
            interval = max
        }
        return Math.floor((1 - jitter) * interval);
    }

    function errorExists(data) {
        return "error" in data && data.error !== null && data.error !== "";
    }

    function Centrifuge(options) {
        this._sockjs = false;
        this._sockjsVersion = null;
        this._status = 'disconnected';
        this._reconnect = true;
        this._transport = null;
        this._latency = null;
        this._latencyStart = null;
        this._messageId = 0;
        this._clientId = null;
        this._subscriptions = {};
        this._lastMessageID = {};
        this._messages = [];
        this._isBatching = false;
        this._isAuthBatching = false;
        this._authChannels = {};
        this._refreshTimeout = null;
        this._retries = 0;
        
        this._config = {
            retry: 1000,
            maxRetry: 1100,
            info: "",
            debug: false,
            insecure: false,
            server: null,
            privateChannelPrefix: "$",
            protocols_whitelist: [
                'websocket',
                'xdr-streaming',
                'xhr-streaming',
                'iframe-eventsource',
                'iframe-htmlfile',
                'xdr-polling',
                'xhr-polling',
                'iframe-xhr-polling',
                'jsonp-polling'
            ],
            transports: [
                'websocket',
                'xdr-streaming',
                'xhr-streaming',
                'eventsource',
                'iframe-eventsource',
                'iframe-htmlfile',
                'xdr-polling',
                'xhr-polling',
                'iframe-xhr-polling',
                'jsonp-polling'
            ],
            refreshEndpoint: "/centrifuge/refresh",
            refreshHeaders: {},
            refreshParams: {},
            refreshTransport: "ajax",
            authEndpoint: "/centrifuge/auth",
            authHeaders: {},
            authParams: {},
            authTransport: "ajax"
        };
        if (options) {
            this.configure(options);
        }
    }

    extend(Centrifuge, EventEmitter);

    Centrifuge._authCallbacks = {};
    Centrifuge._nextAuthCallbackID = 1;

    var centrifugeProto = Centrifuge.prototype;

    centrifugeProto._jsonp = function (url, params, headers, data, callback) {
        if (headers.length > 0) {
            this._log("Only AJAX request allows to send custom headers, it's not possible with JSONP.");
        }
        self._debug("sending JSONP request to", url);

        var callbackName = Centrifuge._nextAuthCallbackID.toString();
        Centrifuge._nextAuthCallbackID++;

        var document = window.document;
        var script = document.createElement("script");
        Centrifuge._authCallbacks[callbackName] = function (data) {
            callback(false, data);
            delete Centrifuge[callbackName];
        };

        var query = "";
        for (var i in params) {
            if (query.length > 0) {
                query += "&";
            }
            query += encodeURIComponent(i) + "=" + encodeURIComponent(params[i]);
        }

        var callback_name = "Centrifuge._authCallbacks['" + callbackName + "']";
        script.src = this._config.authEndpoint +
            '?callback=' + encodeURIComponent(callback_name) +
            '&data=' + encodeURIComponent(JSON.stringify(data)) +
            '&' + query;

        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        head.insertBefore(script, head.firstChild);
    };

    centrifugeProto._ajax = function (url, params, headers, data, callback) {
        var self = this;
        self._debug("sending AJAX request to", url);

        var xhr = (window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));

        var query = "";
        for (var i in params) {
            if (query.length > 0) {
                query += "&";
            }
            query += encodeURIComponent(i) + "=" + encodeURIComponent(params[i]);
        }

        if (query.length > 0) {
            query = "?" + query;
        }

        xhr.open("POST", url + query, true);

        // add request headers
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true;
        for (var headerName in headers) {
            xhr.setRequestHeader(headerName, headers[headerName]);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data, parsed = false;

                    try {
                        data = JSON.parse(xhr.responseText);
                        parsed = true;
                    } catch (e) {
                        callback(true, 'JSON returned from webapp was invalid, yet status code was 200. Data was: ' + xhr.responseText);
                    }

                    if (parsed) { // prevents double execution.
                        callback(false, data);
                    }
                } else {
                    self._log("Couldn't get auth info from your webapp", xhr.status);
                    callback(true, xhr.status);
                }
            }
        };

        setTimeout(function () {
            // method == 'get' ? self.xhr.send() : self.xhr.send(JSON.stringify(ops.data));
            xhr.send(JSON.stringify(data));
        }, 20);
        return xhr;
    };

    centrifugeProto._log = function () {
        log("info", arguments);
    };

    centrifugeProto._debug = function () {
        if (this._config.debug === true) {
            log("debug", arguments);
        }
    };

    centrifugeProto._configure = function (configuration) {
        this._debug('Configuring centrifuge object with', configuration);

        if (!configuration) {
            configuration = {};
        }

        this._config = mixin(false, this._config, configuration);

        if (!this._config.url) {
            throw 'Missing required configuration parameter \'url\' specifying server URL';
        }

        if (!this._config.user && this._config.user !== '') {
            if (!this._config.insecure) {
                throw 'Missing required configuration parameter \'user\' specifying user\'s unique ID in your application';
            } else {
                this._debug("user not found but this is OK for insecure mode - anonymous access will be used");
                this._config.user = "";
            }
        }

        if (!this._config.timestamp) {
            if (!this._config.insecure) {
                throw 'Missing required configuration parameter \'timestamp\'';
            } else {
                this._debug("token not found but this is OK for insecure mode");
            }
        }

        if (!this._config.token) {
            if (!this._config.insecure) {
                throw 'Missing required configuration parameter \'token\' specifying the sign of authorization request';
            } else {
                this._debug("timestamp not found but this is OK for insecure mode");
            }
        }

        this._config.url = stripSlash(this._config.url);

        if (endsWith(this._config.url, 'connection')) {
            this._debug("client will connect to SockJS endpoint");
            if (typeof SockJS === 'undefined') {
                throw 'include SockJS client library before Centrifuge javascript client library or use raw Websocket connection endpoint';
            }
            this._sockjs = true;
            this._sockjsVersion = SockJS.version;
        } else if (endsWith(this._config.url, 'connection/websocket')) {
            this._debug("client will connect to raw Websocket endpoint");
            this._config.url = this._config.url.replace("http://", "ws://");
            this._config.url = this._config.url.replace("https://", "wss://");
        } else {
            this._debug("client will detect connection endpoint itself");
            if (typeof SockJS === 'undefined') {
                this._debug("no SockJS found, client will connect to raw Websocket endpoint");
                this._config.url += "/connection/websocket";
                this._config.url = this._config.url.replace("http://", "ws://");
                this._config.url = this._config.url.replace("https://", "wss://");
            } else {
                this._debug("SockJS found, client will connect to SockJS endpoint");
                this._config.url += "/connection";
                this._sockjs = true;
                this._sockjsVersion = SockJS.version;
            }
        }
    };

    centrifugeProto._setStatus = function (newStatus) {
        if (this._status !== newStatus) {
            this._debug('Status', this._status, '->', newStatus);
            this._status = newStatus;
        }
    };

    centrifugeProto._isDisconnected = function () {
        return this._isConnected() === false;
    };

    centrifugeProto._isConnected = function () {
        return this._status === 'connected';
    };

    centrifugeProto._isConnecting = function () {
        return this._status === 'connecting';
    };

    centrifugeProto._nextMessageId = function () {
        return ++this._messageId;
    };

    centrifugeProto._clearSubscriptions = function () {
        this._subscriptions = {};
    };

    centrifugeProto._resetRetry = function () {
        this._debug("reset retries count to 0");
        this._retries = 0;
    };

    centrifugeProto._getRetryInterval = function () {
        var interval = backoff(this._retries, this._config.retry, this._config.maxRetry);
        this._retries += 1;
        return interval;
    };

    centrifugeProto._send = function (messages) {
        // We must be sure that the messages have a clientId.
        // This is not guaranteed since the handshake may take time to return
        // (and hence the clientId is not known yet) and the application
        // may create other messages.
        for (var i = 0; i < messages.length; ++i) {
            var message = messages[i];
            message.uid = '' + this._nextMessageId();

            if (this._clientId) {
                message.clientId = this._clientId;
            }

            this._debug('Send', message);
            this._transport.send(JSON.stringify(message));
        }
    };

    centrifugeProto._connect = function (callback) {

        if (this.isConnected()) {
            return;
        }

        this._clientId = null;

        this._reconnect = true;

        this._clearSubscriptions();

        this._setStatus('connecting');

        var self = this;

        if (callback) {
            this.on('connect', callback);
        }

        if (this._sockjs === true) {
            //noinspection JSUnresolvedFunction
            var sockjsOptions = {};
            if (startsWith(this._sockjsVersion, "1.")) {
                sockjsOptions["transports"] = this._config.transports;
            } else {
                this._log("SockJS <= 0.3.4 is deprecated, use SockJS >= 1.0.0 instead");
                sockjsOptions["protocols_whitelist"] = this._config.protocols_whitelist;
            }
            if (this._config.server !== null) {
                sockjsOptions['server'] = this._config.server;
            }
            this._transport = new SockJS(this._config.url, null, sockjsOptions);
        } else {
            this._transport = new WebSocket(this._config.url);
        }

        this._setStatus('connecting');

        this._transport.onopen = function () {

            self._resetRetry();

            if (!isString(self._config.user)) {
                self._debug("user expected to be string");
            }
            if (!isString(self._config.info)) {
                self._debug("info expected to be string");
            }

            var centrifugeMessage = {
                'method': 'connect',
                'params': {
                    'user': self._config.user,
                    'info': self._config.info
                }
            };

            if (!self._config.insecure) {
                centrifugeMessage["params"]["timestamp"] = self._config.timestamp;
                centrifugeMessage["params"]["token"] = self._config.token;
                if (!isString(self._config.timestamp)) {
                    self._debug("timestamp expected to be string");
                }
                if (!isString(self._config.token)) {
                    self._debug("token expected to be string");
                }
            }
            self.send(centrifugeMessage);
            self._latencyStart = new Date();
        };

        this._transport.onerror = function (error) {
            self._debug(error);
        };

        this._transport.onclose = function () {
            self._setStatus('disconnected');
            self.trigger('disconnect');
            if (self._reconnect === true) {
                var interval = self._getRetryInterval();
                self._debug("reconnect after " + interval + " milliseconds");
                window.setTimeout(function () {
                    if (self._reconnect === true) {
                        self._connect.call(self);
                    }
                }, interval);
            }
        };

        this._transport.onmessage = function (event) {
            var data;
            try {
                data = JSON.parse(event.data);
            }
            catch (e) {
            }
            self._debug('Received', data);
            self._receive(data);
        };
    };

    centrifugeProto._disconnect = function (shouldReconnect) {
        var reconnect = shouldReconnect || false;
        this._clientId = null;
        this._setStatus('disconnected');
        if (reconnect === false) {
            this._subscriptions = {};
            this._reconnect = false;
        }
        this._transport.close();
    };

    centrifugeProto._getSubscription = function (channel) {
        var subscription;
        subscription = this._subscriptions[channel];
        if (!subscription) {
            return null;
        }
        return subscription;
    };

    centrifugeProto._removeSubscription = function (channel) {
        try {
            delete this._subscriptions[channel];
        } catch (e) {
            this._debug('nothing to delete for channel ', channel);
        }
        try {
            delete this._authChannels[channel];
        } catch (e) {
            this._debug('nothing to delete from authChannels for channel ', channel);
        }
    };

    centrifugeProto._connectResponse = function (message) {

        if (this._latencyStart !== null) {
            var latencyEnd = new Date();
            this._latency = latencyEnd.getTime() - this._latencyStart.getTime();
            this._latencyStart = null;
        }

        if (this.isConnected()) {
            return;
        }
        if (!errorExists(message)) {
            if (!message.body) {
                return;
            }
            if (message.body.expires) {
                var isExpired = message.body.expired;
                if (isExpired) {
                    this.refresh();
                    return;
                }
            }
            this._clientId = message.body.client;
            this._setStatus('connected');
            this.trigger('connect', [message]);
            if (this._refreshTimeout) {
                window.clearTimeout(this._refreshTimeout);
            }
            if (message.body.expires) {
                var self = this;
                this._refreshTimeout = window.setTimeout(function () {
                    self.refresh.call(self);
                }, message.body.ttl * 1000);
            }
        } else {
            this.trigger('error', [message]);
            this.trigger('connect:error', [message]);
        }
    };

    centrifugeProto._disconnectResponse = function (message) {
        if (!errorExists(message)) {
            var shouldReconnect = false;
            if ("reconnect" in message.body) {
                shouldReconnect = message.body["reconnect"];
            }
            this.disconnect(shouldReconnect);
            if ("reason" in message.body) {
                this._debug("disconnected:", message.body["reason"]);
            }
        } else {
            this.trigger('error', [message]);
            this.trigger('disconnect:error', [message.error]);
        }
    };

    centrifugeProto._subscribeResponse = function (message) {
        if (errorExists(message)) {
            this.trigger('error', [message]);
        }
        var body = message.body;
        if (body === null) {
            return;
        }
        var channel = body.channel;
        var subscription = this.getSubscription(channel);
        if (!subscription) {
            return;
        }
        if (!errorExists(message)) {
            subscription.trigger('subscribe:success', [body]);
            subscription.trigger('ready', [body]);
            var messages = body["messages"];
            if (messages && messages.length > 0) {
                for (var i in messages.reverse()) {
                    this._messageResponse({body: messages[i]});
                }
            } else {
                if ("last" in body) {
                    this._lastMessageID[channel] = body["last"];
                }
            }
        } else {
            subscription.trigger('subscribe:error', [message.error]);
            subscription.trigger('error', [message]);
        }
    };

    centrifugeProto._unsubscribeResponse = function (message) {
        var body = message.body;
        var channel = body.channel;
        var subscription = this.getSubscription(channel);
        if (!subscription) {
            return;
        }
        if (!errorExists(message)) {
            subscription.trigger('unsubscribe', [body]);
            this._removeSubscription(channel);
        }
    };

    centrifugeProto._publishResponse = function (message) {
        var body = message.body;
        var channel = body.channel;
        var subscription = this.getSubscription(channel);
        if (!subscription) {
            return;
        }
        if (!errorExists(message)) {
            subscription.trigger('publish:success', [body]);
        } else {
            subscription.trigger('publish:error', [message.error]);
            this.trigger('error', [message]);
        }
    };

    centrifugeProto._presenceResponse = function (message) {
        var body = message.body;
        var channel = body.channel;
        var subscription = this.getSubscription(channel);
        if (!subscription) {
            return;
        }
        if (!errorExists(message)) {
            subscription.trigger('presence', [body]);
            subscription.trigger('presence:success', [body]);
        } else {
            subscription.trigger('presence:error', [message.error]);
            this.trigger('error', [message]);
        }
    };

    centrifugeProto._historyResponse = function (message) {
        var body = message.body;
        var channel = body.channel;
        var subscription = this.getSubscription(channel);
        if (!subscription) {
            return;
        }
        if (!errorExists(message)) {
            subscription.trigger('history', [body]);
            subscription.trigger('history:success', [body]);
        } else {
            subscription.trigger('history:error', [message.error]);
            this.trigger('error', [message]);
        }
    };

    centrifugeProto._joinResponse = function (message) {
        var body = message.body;
        var channel = body.channel;
        var subscription = this.getSubscription(channel);
        if (!subscription) {
            return;
        }
        subscription.trigger('join', [body]);
    };

    centrifugeProto._leaveResponse = function (message) {
        var body = message.body;
        var channel = body.channel;
        var subscription = this.getSubscription(channel);
        if (!subscription) {
            return;
        }
        subscription.trigger('leave', [body]);
    };

    centrifugeProto._messageResponse = function (message) {
        var body = message.body;
        var channel = body.channel;
        var subscription = this.getSubscription(channel);
        if (subscription === null) {
            return;
        }
        // keep last uid received from channel.
        this._lastMessageID[channel] = body["uid"];
        subscription.trigger('message', [body]);
    };

    centrifugeProto._refreshResponse = function (message) {
        if (this._refreshTimeout) {
            window.clearTimeout(this._refreshTimeout);
        }
        if (message.body.expires) {
            var self = this;
            var isExpired = message.body.expired;
            if (isExpired) {
                self._refreshTimeout = window.setTimeout(function () {
                    self.refresh.call(self);
                }, 3000 + Math.round(Math.random() * 1000));
                return;
            }
            this._clientId = message.body.client;
            self._refreshTimeout = window.setTimeout(function () {
                self.refresh.call(self);
            }, message.body.ttl * 1000);
        }
    };

    centrifugeProto._dispatchMessage = function (message) {
        if (message === undefined || message === null) {
            return;
        }

        var method = message.method;

        if (!method) {
            return;
        }

        switch (method) {
            case 'connect':
                this._connectResponse(message);
                break;
            case 'disconnect':
                this._disconnectResponse(message);
                break;
            case 'subscribe':
                this._subscribeResponse(message);
                break;
            case 'unsubscribe':
                this._unsubscribeResponse(message);
                break;
            case 'publish':
                this._publishResponse(message);
                break;
            case 'presence':
                this._presenceResponse(message);
                break;
            case 'history':
                this._historyResponse(message);
                break;
            case 'join':
                this._joinResponse(message);
                break;
            case 'leave':
                this._leaveResponse(message);
                break;
            case 'ping':
                break;
            case 'refresh':
                this._refreshResponse(message);
                break;
            case 'message':
                this._messageResponse(message);
                break;
            default:
                break;
        }
    };

    centrifugeProto._receive = function (data) {
        if (Object.prototype.toString.call(data) === Object.prototype.toString.call([])) {
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    var msg = data[i];
                    this._dispatchMessage(msg);
                }
            }
        } else if (Object.prototype.toString.call(data) === Object.prototype.toString.call({})) {
            this._dispatchMessage(data);
        }
    };

    centrifugeProto._flush = function () {
        var messages = this._messages.slice(0);
        this._messages = [];
        this._send(messages);
    };

    centrifugeProto._ping = function () {
        var centrifugeMessage = {
            "method": "ping",
            "params": {}
        };
        this.send(centrifugeMessage);
    };

    centrifugeProto._recover = function (channel) {
        return channel in this._lastMessageID;
    };

    centrifugeProto._getLastID = function (channel) {
        var lastUID = this._lastMessageID[channel];
        if (lastUID) {
            this._debug("last uid found and sent for channel", channel);
            return lastUID;
        } else {
            this._debug("no last uid found for channel", channel);
            return "";
        }
    };

    /* PUBLIC API */

    centrifugeProto.getClientId = function () {
        return this._clientId;
    };

    centrifugeProto.isConnected = centrifugeProto._isConnected;

    centrifugeProto.isConnecting = centrifugeProto._isConnecting;

    centrifugeProto.isDisconnected = centrifugeProto._isDisconnected;

    centrifugeProto.configure = function (configuration) {
        this._configure.call(this, configuration);
    };

    centrifugeProto.connect = centrifugeProto._connect;

    centrifugeProto.disconnect = centrifugeProto._disconnect;

    centrifugeProto.getSubscription = centrifugeProto._getSubscription;

    centrifugeProto.ping = centrifugeProto._ping;

    centrifugeProto.send = function (message) {
        if (this._isBatching === true) {
            this._messages.push(message);
        } else {
            this._send([message]);
        }
    };

    centrifugeProto.startBatching = function () {
        // start collecting messages without sending them to Centrifuge until flush
        // method called
        this._isBatching = true;
    };

    centrifugeProto.stopBatching = function (flush) {
        // stop collecting messages
        flush = flush || false;
        this._isBatching = false;
        if (flush === true) {
            this.flush();
        }
    };

    centrifugeProto.flush = function () {
        // send batched messages to Centrifuge
        this._flush();
    };

    centrifugeProto.startAuthBatching = function () {
        // start collecting private channels to create bulk authentication
        // request to authEndpoint when stopAuthBatching will be called
        this._isAuthBatching = true;
    };

    centrifugeProto.stopAuthBatching = function (callback) {
        // create request to authEndpoint with collected private channels
        // to ask if this client can subscribe on each channel
        this._isAuthBatching = false;
        var authChannels = this._authChannels;
        this._authChannels = {};
        var channels = [];

        for (var channel in authChannels) {
            var subscription = this.getSubscription(channel);
            if (!subscription) {
                continue;
            }
            channels.push(channel);
        }

        if (channels.length == 0) {
            if (callback) {
                callback();
            }
            return;
        }

        var data = {
            "client": this.getClientId(),
            "channels": channels
        };

        var self = this;

        var cb = function (error, data) {
            if (error === true) {
                self._debug("authorization request failed");
                for (var i in channels) {
                    var channel = channels[i];
                    self._subscribeResponse({
                        "error": "authorization request failed",
                        "body": {
                            "channel": channel
                        }
                    });
                }
                if (callback) {
                    callback();
                }
                return;
            }
            for (var i in channels) {
                var channel = channels[i];
                var channelResponse = data[channel];
                if (!channelResponse) {
                    // subscription:error
                    self._subscribeResponse({
                        "error": 404,
                        "body": {
                            "channel": channel
                        }
                    });
                    continue;
                }
                if (!channelResponse.status || channelResponse.status === 200) {
                    var centrifugeMessage = {
                        "method": "subscribe",
                        "params": {
                            "channel": channel,
                            "client": self.getClientId(),
                            "info": channelResponse.info,
                            "sign": channelResponse.sign
                        }
                    };
                    var recover = self._recover(channel);
                    if (recover === true) {
                        centrifugeMessage["params"]["recover"] = true;
                        centrifugeMessage["params"]["last"] = self._getLastID(channel);
                    }
                    self.send(centrifugeMessage);
                } else {
                    self._subscribeResponse({
                        "error": channelResponse.status,
                        "body": {
                            "channel": channel
                        }
                    });
                }
            }
            if (callback) {
                callback();
            }
        };

        var transport = this._config.authTransport.toLowerCase();
        if (transport === "ajax") {
            this._ajax(this._config.authEndpoint, this._config.authParams, this._config.authHeaders, data, cb);
        } else if (transport === "jsonp") {
            this._jsonp(this._config.authEndpoint, this._config.authParams, this._config.authHeaders, data, cb);
        } else {
            throw 'Unknown auth transport ' + transport;
        }
    };

    centrifugeProto.subscribe = function (channel, callback) {

        if (arguments.length < 1) {
            throw 'Illegal arguments number: required 1, got ' + arguments.length;
        }
        if (!isString(channel)) {
            throw 'Illegal argument type: channel must be a string';
        }
        if (this.isDisconnected()) {
            throw 'Can not subscribe in disconnected state';
        }

        var current_subscription = this.getSubscription(channel);

        if (current_subscription !== null) {
            return current_subscription;
        } else {
            var subscription = new Subscription(this, channel);
            this._subscriptions[channel] = subscription;
            subscription.subscribe(callback);
            return subscription;
        }
    };

    centrifugeProto.unsubscribe = function (channel) {
        if (arguments.length < 1) {
            throw 'Illegal arguments number: required 1, got ' + arguments.length;
        }
        if (!isString(channel)) {
            throw 'Illegal argument type: channel must be a string';
        }
        if (this.isDisconnected()) {
            return;
        }

        var subscription = this.getSubscription(channel);
        if (subscription !== null) {
            subscription.unsubscribe();
        }
    };

    centrifugeProto.publish = function (channel, data, callback) {
        var subscription = this.getSubscription(channel);
        if (subscription === null) {
            this._debug("subscription not found for channel " + channel);
            return null;
        }
        subscription.publish(data, callback);
        return subscription;
    };

    centrifugeProto.presence = function (channel, callback) {
        var subscription = this.getSubscription(channel);
        if (subscription === null) {
            this._debug("subscription not found for channel " + channel);
            return null;
        }
        subscription.presence(callback);
        return subscription;
    };

    centrifugeProto.history = function (channel, callback) {
        var subscription = this.getSubscription(channel);
        if (subscription === null) {
            this._debug("subscription not found for channel " + channel);
            return null;
        }
        subscription.history(callback);
        return subscription;
    };

    centrifugeProto.refresh = function () {
        // ask web app for connection parameters - user ID,
        // timestamp, info and token
        var self = this;
        this._debug('refresh credentials');

        var cb = function (error, data) {
            if (error === true) {
                // 403 or 500 - does not matter - if connection check activated then Centrifugo
                // will disconnect client eventually
                self._debug("error getting connect parameters", data);
                if (self._refreshTimeout) {
                    window.clearTimeout(self._refreshTimeout);
                }
                self._refreshTimeout = window.setTimeout(function () {
                    self.refresh.call(self);
                }, 3000);
                return;
            }
            self._config.user = data.user;
            self._config.timestamp = data.timestamp;
            self._config.info = data.info;
            self._config.token = data.token;
            if (self.isDisconnected()) {
                self._debug("credentials refreshed, connect from scratch");
                self._connect();
            } else {
                self._debug("send refreshed credentials");
                var centrifugeMessage = {
                    "method": "refresh",
                    "params": {
                        'user': self._config.user,
                        'timestamp': self._config.timestamp,
                        'info': self._config.info,
                        'token': self._config.token
                    }
                };
                self.send(centrifugeMessage);
            }
        };

        var transport = this._config.refreshTransport.toLowerCase();
        if (transport === "ajax") {
            this._ajax(this._config.refreshEndpoint, this._config.refreshParams, this._config.refreshHeaders, {}, cb);
        } else if (transport === "jsonp") {
            this._jsonp(this._config.refreshEndpoint, this._config.refreshParams, this._config.refreshHeaders, {}, cb);
        } else {
            throw 'Unknown refresh transport ' + transport;
        }
    };

    function Subscription(centrifuge, channel) {
        /**
         * The constructor for a centrifuge object, identified by an optional name.
         * The default name is the string 'default'.
         * @param name the optional name of this centrifuge object
         */
        this._centrifuge = centrifuge;
        this.channel = channel;
    }

    extend(Subscription, EventEmitter);

    var subscriptionProto = Subscription.prototype;

    subscriptionProto.getChannel = function () {
        return this.channel;
    };

    subscriptionProto.getCentrifuge = function () {
        return this._centrifuge;
    };

    subscriptionProto.subscribe = function (callback) {
        /*
         If channel name does not start with privateChannelPrefix - then we
         can just send subscription message to Centrifuge. If channel name
         starts with privateChannelPrefix - then this is a private channel
         and we should ask web application backend for permission first.
         */
        var centrifugeMessage = {
            "method": "subscribe",
            "params": {
                "channel": this.channel
            }
        };

        if (startsWith(this.channel, this._centrifuge._config.privateChannelPrefix)) {
            // private channel
            if (this._centrifuge._isAuthBatching) {
                this._centrifuge._authChannels[this.channel] = true;
            } else {
                this._centrifuge.startAuthBatching();
                this.subscribe(callback);
                this._centrifuge.stopAuthBatching();
            }
        } else {
            var recover = this._centrifuge._recover(this.channel);
            if (recover === true) {
                centrifugeMessage["params"]["recover"] = true;
                centrifugeMessage["params"]["last"] = this._centrifuge._getLastID(this.channel);
            }
            this._centrifuge.send(centrifugeMessage);
        }

        if (callback) {
            this.on('message', callback);
        }
    };

    subscriptionProto.unsubscribe = function () {
        this._centrifuge._removeSubscription(this.channel);
        var centrifugeMessage = {
            "method": "unsubscribe",
            "params": {
                "channel": this.channel
            }
        };
        this._centrifuge.send(centrifugeMessage);
    };

    subscriptionProto.publish = function (data, callback) {
        var centrifugeMessage = {
            "method": "publish",
            "params": {
                "channel": this.channel,
                "data": data
            }
        };
        if (callback) {
            this.on('publish:success', callback);
        }
        this._centrifuge.send(centrifugeMessage);
    };

    subscriptionProto.presence = function (callback) {
        var centrifugeMessage = {
            "method": "presence",
            "params": {
                "channel": this.channel
            }
        };
        if (callback) {
            this.on('presence', callback);
        }
        this._centrifuge.send(centrifugeMessage);
    };

    subscriptionProto.history = function (callback) {
        var centrifugeMessage = {
            "method": "history",
            "params": {
                "channel": this.channel
            }
        };
        if (callback) {
            this.on('history', callback);
        }
        this._centrifuge.send(centrifugeMessage);
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Centrifuge;
        });
    } else if (typeof module === 'object' && module.exports) {
        //noinspection JSUnresolvedVariable
        module.exports = Centrifuge;
    } else {
        //noinspection JSUnusedGlobalSymbols
        this.Centrifuge = Centrifuge;
    }

}.call(this));
