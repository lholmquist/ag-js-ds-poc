/*! AeroGear JavaScript Library - v1.4.0-dev - 2014-01-22
* https://github.com/aerogear/aerogear-js
* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
    The AeroGear namespace provides a way to encapsulate the library's properties and methods away from the global namespace
    @namespace
 */
this.AeroGear = {};

/**
    AeroGear.Core is a base for all of the library modules to extend. It is not to be instantiated and will throw an error when attempted
    @class
    @private
 */
AeroGear.Core = function() {
    // Prevent instantiation of this base class
    if ( this instanceof AeroGear.Core ) {
        throw "Invalid instantiation of base class AeroGear.Core";
    }

    /**
        This function is used by the different parts of AeroGear to add a new Object to its respective collection.
        @name AeroGear.add
        @method
        @param {String|Array|Object} config - This can be a variety of types specifying how to create the object. See the particular constructor for the object calling .add for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.add = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};
        this[ this.collectionName ] = collection;

        if ( !config ) {
            return this;
        } else if ( typeof config === "string" ) {
            // config is a string so use default adapter type
            collection[ config ] = AeroGear[ this.lib ].adapters[ this.type ]( config, this.config );
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current, this.config );
                } else {
                    if( current.name ) {

                        // Merge the Module( pipeline, datamanger, ... )config with the adapters settings
                        current.settings = AeroGear.extend( current.settings || {}, this.config );

                        // Compatibility fix for deprecation of recordId in Pipeline and DataManager constructors
                        // Added in 1.3 to remove in 1.4
                        current.settings.recordId = current.settings.recordId || current.recordId;
                        // End compat fix

                        collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings );
                    }
                }
            }
        } else {
            if( !config.name ) {
                return this;
            }

            // Merge the Module( pipeline, datamanger, ... )config with the adapters settings
            // config is an object so use that signature
            config.settings = AeroGear.extend( config.settings || {}, this.config );

            // Compatibility fix for deprecation of recordId in Pipeline and DataManager constructors
            // Added in 1.3 to remove in 1.4
            config.settings.recordId = config.settings.recordId || config.recordId;
            // End compat fix

            collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings );
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
    /**
        This function is used internally by pipeline, datamanager, etc. to remove an Object (pipe, store, etc.) from the respective collection.
        @name AeroGear.remove
        @method
        @param {String|String[]|Object[]|Object} config - This can be a variety of types specifying how to remove the object. See the particular constructor for the object calling .remove for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.remove = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( typeof config === "string" ) {
            // config is a string so delete that item by name
            delete collection[ config ];
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    delete collection[ current ];
                } else {
                    delete collection[ current.name ];
                }
            }
        } else if ( config ) {
            // config is an object so use that signature
            delete collection[ config.name ];
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
};

/**
    Utility function to test if an object is an Array
    @private
    @method
    @param {Object} obj - This can be any object to test
*/
AeroGear.isArray = function( obj ) {
    return ({}).toString.call( obj ) === "[object Array]";
};

/**
    Utility function to merge 2 Objects together.
    @private
    @method
    @param {Object} obj1 - An Object to be merged.
    @param {Object} obj2 - An Object to be merged.  This Objects Value takes precendence.
*/
AeroGear.extend = function( obj1, obj2 ) {
    var name;
    for( name in obj2 ) {
        obj1[ name ] = obj2[ name ];
    }
    return obj1;
};

/**
    This callback is executed when an HTTP request completes whether it was successful or not.
    @callback AeroGear~completeCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
 */
/**
    This callback is executed when an HTTP error is encountered during a request.
    @callback AeroGear~errorCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
 */
/**
    This callback is executed when an HTTP success message is returned during a request.
    @callback AeroGear~successCallbackREST
    @param {Object} data - The data, if any, returned in the response
    @param {String} textStatus - The text status message returned from the server
    @param {Object} jqXHR - The jQuery specific XHR object
 */
 /**
    This callback is executed when an HTTP progress message is returned during a request.
    @callback AeroGear~progressCallbackREST
    @param {Object} XMLHttpRequestProgressEvent - The progress event
 */
/**
    This callback is executed when an error is encountered saving to local or session storage.
    @callback AeroGear~errorCallbackStorage
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
    @param {Object|Array} data - An object or array of objects representing the data for the failed save attempt.
 */
/**
    This callback is executed when data is successfully saved to session or local storage.
    @callback AeroGear~successCallbackStorage
    @param {Object} data - The updated data object after the new saved data has been added
 */

//     node-uuid/uuid.js
//
//     Copyright (c) 2010 Robert Kieffer
//     Dual licensed under the MIT and GPL licenses.
//     Documentation and details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator, but
  // Math.random() does not guarantee "cryptographic quality".  So we feature
  // detect for more robust APIs, normalizing each method to return 128-bits
  // (16 bytes) of random data.
  var mathRNG, nodeRNG, whatwgRNG;

  // Math.random()-based RNG.  All platforms, very fast, unknown quality
  var _rndBytes = new Array(16);
  mathRNG = function() {
    var r, b = _rndBytes, i = 0;

    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      b[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return b;
  }

  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // WebKit only (currently), moderately fast, high quality
  if (_global.crypto && crypto.getRandomValues) {
    var _rnds = new Uint32Array(4);
    whatwgRNG = function() {
      crypto.getRandomValues(_rnds);

      for (var c = 0 ; c < 16; c++) {
        _rndBytes[c] = _rnds[c >> 2] >>> ((c & 0x03) * 8) & 0xff;
      }
      return _rndBytes;
    }
  }

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  // Node.js only, moderately fast, high quality
  try {
    var _rb = require('crypto').randomBytes;
    nodeRNG = _rb && function() {
      return _rb(16);
    };
  } catch (e) {}

  // Select RNG with best quality
  var _rng = nodeRNG || whatwgRNG || mathRNG;

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(byte) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[byte];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  // Export RNG options
  uuid.mathRNG = mathRNG;
  uuid.nodeRNG = nodeRNG;
  uuid.whatwgRNG = whatwgRNG;

  if (typeof(module) != 'undefined') {
    // Play nice with node.js
    module.exports = uuid;
  } else {
    // Play nice with browsers
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    }
    _global.uuid = uuid;
  }
}());

(function(){"use strict";var e={};typeof t!="undefined"&&(e=t);var t=e;e.version="0.0.7",e.config={textDiffMinLength:60,detectArrayMove:!0,includeValueOnArrayMove:!1};var n={diff:function(t,n,r,i){var s=0,o=0,u,a,f=t.length,l=n.length,c,h=[],p=[],d=typeof r=="function"?function(e,t,n,i){if(e===t)return!0;if(typeof e!="object"||typeof t!="object")return!1;var s,o;return typeof n=="number"?(s=h[n],typeof s=="undefined"&&(h[n]=s=r(e))):s=r(e),typeof i=="number"?(o=p[i],typeof o=="undefined"&&(p[i]=o=r(t))):o=r(t),s===o}:function(e,t){return e===t},v=function(e,r){return d(t[e],n[r],e,r)},m=function(e,r){if(!i)return;if(typeof t[e]!="object"||typeof n[r]!="object")return;var s=i(t[e],n[r]);if(typeof s=="undefined")return;c||(c={_t:"a"}),c[r]=s};while(s<f&&s<l&&v(s,s))m(s,s),s++;while(o+s<f&&o+s<l&&v(f-1-o,l-1-o))m(f-1-o,l-1-o),o++;if(s+o===f){if(f===l)return c;c=c||{_t:"a"};for(u=s;u<l-o;u++)c[u]=[n[u]];return c}if(s+o===l){c=c||{_t:"a"};for(u=s;u<f-o;u++)c["_"+u]=[t[u],0,0];return c}var g=this.lcs(t.slice(s,f-o),n.slice(s,l-o),{areTheSameByIndex:function(e,t){return v(e+s,t+s)}});c=c||{_t:"a"};var y=[];for(u=s;u<f-o;u++)g.indices1.indexOf(u-s)<0&&(c["_"+u]=[t[u],0,0],y.push(u));var b=y.length;for(u=s;u<l-o;u++){var w=g.indices2.indexOf(u-s);if(w<0){var E=!1;if(e.config.detectArrayMove&&b>0)for(a=0;a<b;a++)if(v(y[a],u)){c["_"+y[a]].splice(1,2,u,3),e.config.includeValueOnArrayMove||(c["_"+y[a]][0]=""),m(y[a],u),y.splice(a,1),E=!0;break}E||(c[u]=[n[u]])}else m(g.indices1[w]+s,g.indices2[w]+s)}return c},getArrayIndexBefore:function(e,t){var n,r=t;for(var s in e)if(e.hasOwnProperty(s)&&i(e[s])){s.slice(0,1)==="_"?n=parseInt(s.slice(1),10):n=parseInt(s,10);if(e[s].length===1){if(n<t)r--;else if(n===t)return-1}else if(e[s].length===3)if(e[s][2]===0)n<=t&&r++;else if(e[s][2]===3){n<=t&&r++;if(e[s][1]>t)r--;else if(e[s][1]===t)return n}}return r},patch:function(e,t,n,r){var i,s,o=function(e,t){return e-t},u=function(e){return function(t,n){return t[e]-n[e]}},a=[],f=[],l=[];for(i in t)if(i!=="_t")if(i[0]=="_"){if(t[i][2]!==0&&t[i][2]!==3)throw new Error("only removal or move can be applied at original array indices, invalid diff type: "+t[i][2]);a.push(parseInt(i.slice(1),10))}else t[i].length===1?f.push({index:parseInt(i,10),value:t[i][0]}):l.push({index:parseInt(i,10),diff:t[i]});a=a.sort(o);for(i=a.length-1;i>=0;i--){s=a[i];var c=t["_"+s],h=e.splice(s,1)[0];c[2]===3&&f.push({index:c[1],value:h})}f=f.sort(u("index"));var p=f.length;for(i=0;i<p;i++){var d=f[i];e.splice(d.index,0,d.value)}var v=l.length;if(v>0){if(typeof n!="function")throw new Error("to patch items in the array an objectInnerPatch function must be provided");for(i=0;i<v;i++){var m=l[i];n(e,m.index.toString(),m.diff,r)}}return e},lcs:function(e,t,n){n.areTheSameByIndex=n.areTheSameByIndex||function(n,r){return e[n]===t[r]};var r=this.lengthMatrix(e,t,n),i=this.backtrack(r,e,t,e.length,t.length);return typeof e=="string"&&typeof t=="string"&&(i.sequence=i.sequence.join("")),i},lengthMatrix:function(e,t,n){var r=e.length,i=t.length,s,o,u=[r+1];for(s=0;s<r+1;s++){u[s]=[i+1];for(o=0;o<i+1;o++)u[s][o]=0}u.options=n;for(s=1;s<r+1;s++)for(o=1;o<i+1;o++)n.areTheSameByIndex(s-1,o-1)?u[s][o]=u[s-1][o-1]+1:u[s][o]=Math.max(u[s-1][o],u[s][o-1]);return u},backtrack:function(e,t,n,r,i){if(r===0||i===0)return{sequence:[],indices1:[],indices2:[]};if(e.options.areTheSameByIndex(r-1,i-1)){var s=this.backtrack(e,t,n,r-1,i-1);return s.sequence.push(t[r-1]),s.indices1.push(r-1),s.indices2.push(i-1),s}return e[r][i-1]>e[r-1][i]?this.backtrack(e,t,n,r,i-1):this.backtrack(e,t,n,r-1,i)}};e.sequenceDiffer=n,e.dateReviver=function(e,t){var n;if(typeof t=="string"){n=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(Z|([+\-])(\d{2}):(\d{2}))$/.exec(t);if(n)return new Date(Date.UTC(+n[1],+n[2]-1,+n[3],+n[4],+n[5],+n[6]))}return t};var r=function(){var t;e.config.diff_match_patch&&(t=new e.config.diff_match_patch.diff_match_patch),typeof diff_match_patch!="undefined"&&(typeof diff_match_patch=="function"?t=new diff_match_patch:typeof diff_match_patch=="object"&&typeof diff_match_patch.diff_match_patch=="function"&&(t=new diff_match_patch.diff_match_patch));if(t)return e.config.textDiff=function(e,n){return t.patch_toText(t.patch_make(e,n))},e.config.textPatch=function(e,n){var r=t.patch_apply(t.patch_fromText(n),e);for(var i=0;i<r[1].length;i++)if(!r[1][i])throw new Error("text patch failed");return r[0]},!0},i=e.isArray=typeof Array.isArray=="function"?Array.isArray:function(e){return typeof e=="object"&&e instanceof Array},s=e.isDate=function(e){return e instanceof Date||Object.prototype.toString.call(e)==="[object Date]"},o=function(t,r){return n.diff(t,r,e.config.objectHash,e.diff)},u=function(e,t){var n,r,i,s;s=function(i){r=a(e[i],t[i]),typeof r!="undefined"&&(typeof n=="undefined"&&(n={}),n[i]=r)};for(i in t)t.hasOwnProperty(i)&&s(i);for(i in e)e.hasOwnProperty(i)&&typeof t[i]=="undefined"&&s(i);return n},a=e.diff=function(t,n){var a,f,l,c,h;if(t===n)return;if(t!==t&&n!==n)return;a=typeof n,f=typeof t,l=n===null,c=t===null,f=="object"&&s(t)&&(f="date");if(a=="object"&&s(n)){a="date";if(f=="date"&&t.getTime()===n.getTime())return}if(l||c||a=="undefined"||a!=f||a=="number"||f=="number"||a=="boolean"||f=="boolean"||a=="string"||f=="string"||a=="date"||f=="date"||a==="object"&&i(n)!=i(t)){h=[];if(typeof t!="undefined")if(typeof n!="undefined"){var p=a=="string"&&f=="string"&&Math.min(t.length,n.length)>e.config.textDiffMinLength;p&&!e.config.textDiff&&r(),p&&e.config.textDiff?h.push(e.config.textDiff(t,n),0,2):(h.push(t),h.push(n))}else h.push(t),h.push(0,0);else h.push(n);return h}return i(n)?o(t,n):u(t,n)},f=function(e,t){return i(e)?e[parseInt(t,10)]:e[t]};e.getByKey=f;var l=function(e,t,n){if(i(e)&&e._key){var r=e._key;typeof e._key!="function"&&(r=function(t){return t[e._key]});for(var s=0;s<e.length;s++)if(r(e[s])===t){typeof n=="undefined"?(e.splice(s,1),s--):e[s]=n;return}typeof n!="undefined"&&e.push(n);return}typeof n=="undefined"?i(e)?e.splice(t,1):delete e[t]:e[t]=n},c=function(t){return e.config.textDiffReverse||(e.config.textDiffReverse=function(e){var t,n,r,i,s,o=null,u=/^@@ +\-(\d+),(\d+) +\+(\d+),(\d+) +@@$/,a,f,l,c=function(){f!==null&&(r[f]="-"+r[f].slice(1)),l!==null&&(r[l]="+"+r[l].slice(1),f!==null&&(s=r[f],r[f]=r[l],r[l]=s)),r[a]="@@ -"+o[3]+","+o[4]+" +"+o[1]+","+o[2]+" @@",o=null,a=null,f=null,l=null};r=e.split("\n");for(t=0,n=r.length;t<n;t++){i=r[t];var h=i.slice(0,1);h==="@"?(o!==null,o=u.exec(i),a=t,f=null,l=null,r[a]="@@ -"+o[3]+","+o[4]+" +"+o[1]+","+o[2]+" @@"):h=="+"?(f=t,r[t]="-"+r[t].slice(1)):h=="-"&&(l=t,r[t]="+"+r[t].slice(1))}return o!==null,r.join("\n")}),e.config.textDiffReverse(t)},h=e.reverse=function(e){var t,r;if(typeof e=="undefined")return;if(e===null)return null;if(typeof e=="object"&&!s(e)){if(i(e)){if(e.length<3)return e.length===1?[e[0],0,0]:[e[1],e[0]];if(e[2]===0)return[e[0]];if(e[2]===2)return[c(e[0]),0,2];throw new Error("invalid diff type")}r={};if(e._t==="a"){for(t in e)if(e.hasOwnProperty(t)&&t!=="_t"){var o,u=t;t.slice(0,1)==="_"?o=parseInt(t.slice(1),10):o=parseInt(t,10);if(i(e[t]))if(e[t].length===1)u="_"+o;else if(e[t].length===2)u=n.getArrayIndexBefore(e,o);else if(e[t][2]===0)u=o.toString();else{if(e[t][2]===3){u="_"+e[t][1],r[u]=[e[t][0],o,3];continue}u=n.getArrayIndexBefore(e,o)}else u=n.getArrayIndexBefore(e,o);r[u]=h(e[t])}r._t="a"}else for(t in e)e.hasOwnProperty(t)&&(r[t]=h(e[t]));return r}return typeof e=="string"&&e.slice(0,2)==="@@"?c(e):e},p=e.patch=function(s,o,u,a){var c,h,d="",v;typeof o!="string"?(a=u,u=o,o=null):typeof s!="object"&&(o=null),a&&(d+=a),d+="/",o!==null&&(d+=o);if(typeof u=="object")if(i(u)){if(u.length<3)return h=u[u.length-1],o!==null&&l(s,o,h),h;if(u[2]!==0){if(u[2]===2){e.config.textPatch||r();if(!e.config.textPatch)throw new Error("textPatch function not found");try{h=e.config.textPatch(f(s,o),u[0])}catch(m){throw new Error('cannot apply patch at "'+d+'": '+m)}return o!==null&&l(s,o,h),h}throw u[2]===3?new Error("Not implemented diff type: "+u[2]):new Error("invalid diff type: "+u[2])}if(o===null)return;l(s,o)}else if(u._t=="a"){v=o===null?s:f(s,o);if(typeof v!="object"||!i(v))throw new Error('cannot apply patch at "'+d+'": array expected');n.patch(v,u,t.patch,d)}else{v=o===null?s:f(s,o);if(typeof v!="object"||i(v))throw new Error('cannot apply patch at "'+d+'": object expected');for(c in u)u.hasOwnProperty(c)&&p(v,c,u[c],d)}return s},d=e.unpatch=function(e,t,n,r){return typeof t!="string"?p(e,h(t),n):p(e,t,h(n),r)};typeof require=="function"&&typeof exports=="object"&&typeof module=="object"?module.exports=e:typeof define=="function"&&define.amd?define(e):window.jsondiffpatch=e})();
(function( AeroGear, $, undefined ) {
    /**
        The DataSync object
        @status Experimental
        @constructs AeroGear.DataSync
        @param {Object} options
        @param {String} options.syncServerUrl - the URL of the Sync server.
        @returns {Object} The created DataSync Object
        @example
     */
    AeroGear.DataSync = function( options ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.DataSync ) ) {
            return new AeroGear.DataSync( options );
        }

        options = options || {};

        var serverUrl = options.syncServerUrl;

        /**
            Read Method
            @param {Object|Array} data
            @param {Object} settings
            @param {AeroGear~errorCallbackREST} [settings.error] - callback to be executed if the AJAX request results in an error
            @param {AeroGear~successCallbackREST} [settings.success] - callback to be executed if the AJAX request results in success
            @returns {Object}
            @example
        */
        this.read = function( data, settings ) {
            settings = settings || {};

            var success;

            success = function( data, status, jqXHR ) {
                if( settings.success ) {
                    data.content = JSON.parse( data.content );
                    settings.success.call( this, data, status, jqXHR );
                }
            };

            return $.ajax({
                url: serverUrl + "/" + data.id,
                contentType: "application/json",
                dataType: "json",
                type: "GET",
                success: success,
                error: settings.error
            });
        };

        /**
            Save/Update Method
            @param {Object|Array} data
            @param {Object} settings
            @param {String} [settings.autoMerge = false] - if true, will auto merge the conflicting data
            @param {AeroGear~errorCallbackREST} [settings.conflict] - callback to be executed if the AJAX request results in a conflict
            @param {AeroGear~errorCallbackREST} [settings.error] - callback to be executed if the AJAX request results in an error
            @param {AeroGear~successCallbackREST} [settings.success] - callback to be executed if the AJAX request results in success
            @returns {Object}
            @example
        */
        this.save = function( data, settings ) {
            settings = settings || {};

            var success, error, conflict, doc,
                that = this,
                id = data.id || uuid(),
                rev = data.rev,
                content = data.content || data;

            doc = {
                id: id,
                rev: rev,
                content: content
            };

            success = function( data, status, jqXHR ) {
                if( settings.success ) {
                    data.content = JSON.parse( data.content );
                    settings.success.call( this, data, status, jqXHR );
                }
            };

            error = function( error ) {
                var model = {},
                    delta;

                if( error.status === 409 ) {
                    model = error.responseJSON;
                    model.content = JSON.parse( model.content );
                    jsondiffpatch.config.objectHash = function(obj) { return obj.id || JSON.stringify(obj); };
                    delta = jsondiffpatch.diff( model.content, content ); //The model returned, original content trying to get updated

                    if( settings.autoMerge ) {
                        jsondiffpatch.patch( model.content, delta );
                        that.save( model, settings );
                        return;
                    }

                    if( settings.conflict ) {
                        settings.conflict.call( this, error, model, delta );
                    }
                }

                if( settings.error ) {
                    settings.error.apply( this, arguments );
                }
            };

            return $.ajax({
                url: serverUrl + "/" + id,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify( doc ),
                type: "PUT",
                success: success,
                error: error
            });
        };

        /**
            Remove Method
            @param {Object|Array} data
            @param {Object} settings
            @param {AeroGear~errorCallbackREST} [settings.error] - callback to be executed if the AJAX request results in an error
            @param {AeroGear~successCallbackREST} [settings.success] - callback to be executed if the AJAX request results in success
            @returns {Object}
            @example
        */
        this.remove = function( data, settings ) {
            settings = settings || {};

            return $.ajax({
                url: serverUrl + "/" + data.id,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify( { rev: data.rev } ),
                type: "DELETE",
                success: settings.success,
                error: settings.error
            });
        };
    };
})( AeroGear || {}, jQuery );
