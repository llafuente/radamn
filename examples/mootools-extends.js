var document = global.document;

/**
 *
 * @param item
 * @param append
 * @returns
 */
Array.fromIndexedObject = function(item, append){
    var o = null;
    if(append !== undefined) o = append;
    else o=[];
    for(var i in item) {
        o.push(item[i]);
    }
    return o;
};
/**
 *
 * @param Array item
 * @return Array
 */
Array.prototype.append = function(item){
    for(var i in item) {
        this.push(item[i]);
    }
    return this;
};


/*!
sprintf() for JavaScript 0.7-beta1
http://www.diveintojavascript.com/projects/javascript-sprintf

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Changelog:
2010.09.06 - 0.7-beta1
  - features: vsprintf, support for named placeholders
  - enhancements: format cache, reduced global namespace pollution

2010.05.22 - 0.6:
 - reverted to 0.4 and fixed the bug regarding the sign of the number 0
 Note:
 Thanks to Raphael Pigulla <raph (at] n3rd [dot) org> (http://www.n3rd.org/)
 who warned me about a bug in 0.5, I discovered that the last update was
 a regress. I appologize for that.

2010.05.09 - 0.5:
 - bug fix: 0 is now preceeded with a + sign
 - bug fix: the sign was not at the right position on padded results (Kamal Abdali)
 - switched from GPL to BSD license

2007.10.21 - 0.4:
 - unit test and patch (David Baird)

2007.09.17 - 0.3:
 - bug fix: no longer throws exception on empty paramenters (Hans Pufal)

2007.09.11 - 0.2:
 - feature: added argument swapping

2007.04.03 - 0.1:
 - initial release
**/

/**
 * @param String format
 * @param mixed [,variable]
 * @returns String
 */
String.sprintf = (function() {
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
    function str_repeat(input, multiplier) {
        for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
        return output.join('');
    }

    var str_format = function() {
        if (!str_format.cache.hasOwnProperty(arguments[0])) {
            str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
        }
        return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i]);
            if (node_type === 'string') {
                output.push(parse_tree[i]);
            }
            else if (node_type === 'array') {
                match = parse_tree[i]; // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw(String.sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                        }
                        arg = arg[match[2][k]];
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]];
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++];
                }

                if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                    throw(String.sprintf('[sprintf] expecting number but found %s', get_type(arg)));
                }
                switch (match[8]) {
                    case 'b': arg = arg.toString(2); break;
                    case 'c': arg = String.fromCharCode(arg); break;
                    case 'd': arg = parseInt(arg, 10); break;
                    case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                    case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                    case 'o': arg = arg.toString(8); break;
                    case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                    case 'u': arg = Math.abs(arg); break;
                    case 'x': arg = arg.toString(16); break;
                    case 'X': arg = arg.toString(16).toUpperCase(); break;
                }
                arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
                pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                pad_length = match[6] - String(arg).length;
                pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                output.push(match[5] ? arg + pad : pad + arg);
            }
        }
        return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
        while (_fmt) {
            if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                parse_tree.push(match[0]);
            }
            else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                parse_tree.push('%');
            }
            else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    var field_list = [], replacement_field = match[2], field_match = [];
                    if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1]);
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            }
                            else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            }
                            else {
                                throw('[sprintf] huh?');
                            }
                        }
                    }
                    else {
                        throw('[sprintf] huh?');
                    }
                    match[2] = field_list;
                }
                else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
                }
                parse_tree.push(match);
            }
            else {
                throw('[sprintf] huh?');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return parse_tree;
    };

    return str_format;
})();

String.vsprintf = function(fmt, argv) {
    argv.unshift(fmt);
    return sprintf.apply(null, argv);
};

JSON.stringifyf = function(oData, sIndent) {
        if (arguments.length < 2) {
            var sIndent = "";
        }
        var sIndentStyle = "    ";
        var sDataType = typeOf(oData);

        // open object
        if (sDataType == "array") {
            if (oData.length == 0) {
                return "[]";
            }
            var sHTML = "[";
        } else {
            var iCount = oData.length;
            Object.each(oData, function() {++iCount;});
            if (iCount == 0) { // object is empty
                return "{}";
            }
            var sHTML = "{";
        }

        // loop through items
        var iCount = 0;
        Object.each(oData, function(vValue, sKey) {
            if (iCount > 0) {
                sHTML += ",";
            }
            if (sDataType == "array") {
                sHTML += ("\n" + sIndent + sIndentStyle);
            } else {
                sHTML += ("\n" + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
            }

            // display relevant data type
            switch (typeOf(vValue)) {
                case "array":
                case "object":
                    sHTML += JSON.stringifyf(vValue, (sIndent + sIndentStyle));
                    break;
                case "boolean":
                case "number":
                    sHTML += vValue.toString();
                    break;
                case "null":
                    sHTML += "null";
                    break;
                case "string":
                    sHTML += ("\"" + vValue + "\"");
                    break;
                default:
                    sHTML += ("TYPEOF: " + typeof(vValue));
            }

            // loop
            iCount++;
        });

        // close object
        if (sDataType == "array") {
            sHTML += ("\n" + sIndent + "]");
        } else {
            sHTML += ("\n" + sIndent + "}");
        }

        // return
        return sHTML;
}

String.md5 = function (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
    var xl;

    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var addUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function (x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function (x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function (x, y, z) {
        return (y ^ (x | (~z)));
    };

    var _FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var wordToHexValue = "",
            wordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [],
        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

    return temp.toLowerCase();
};

(function(){
    var __programStarts = new Date();
    var __delta = new Date().getTime();

    /**
     * Create a compatibility layer between browsers.
     * Create complex cross-browser HTML like buttoms,tabs, sifr etc.
     *
     * @class Logger
     * @author Luis <bls> Lafuente
     * @version 1
     */
    var LoggerPrototype = {
        /**
        * @member Logger
        * @public
        * @type Function
        */
        logFunction : console.log,
        /**
        * @member Logger
        * @public
        * @type String
        */
        name: 'Core',
        /**
        * @member Logger
        * @public
        * @type String
        */
        namespace: 'Core',
        /**
        * @member Logger
        * @public
        * @type Number
        */
        debugging: true,
        /**
        * @member Logger
        * @public
        * @type Number
        */
        logLevel: 5,
        /**
        * @member Logger
        * @public
        * @type Array
        */
        profile: [],

        /**
        * @member Logger
        * @param String value
        * @private
        */
        __format: function(value) {
            if(value < 0 ) value = 0;

            var options = {
                "s": Math.floor(value % 60),
                "m": Math.floor(value / 60) % 60,
                "h": Math.floor(value / 3600) % 24,
                "d": Math.floor(value / 86400)
            };

            options['s'] = options['s'] < 10 ? '0'+options['s'] : options['s'];
            options['m'] = options['m'] < 10 ? '0'+options['m'] : options['m'];
            options['h'] = options['h'] < 10 ? '0'+options['h'] : options['h'];

            if(options['d'] > 0) return options['d']+' '+options['h']+':'+options['m']+':'+options['s'];
            return options['h']+':'+options['m']+':'+options['s'];
        },

        /**
        * log text to console
        * @member Logger
        * @private
        */
        log: function() {

            var arr = new Error().stack.split("\n");
            var caller = arguments.callee.caller;
            var i=1;
            var max=arr.length;
            var where;
            for(;i<max; ++i) {
                if(caller.$name !== undefined) {
                    var cut = arr[i].lastIndexOf("/");
                    where = arr[i].substring(cut+1);
                    cut = where.lastIndexOf(":");
                    where = where.substring(0, cut).replace(/.js/, '');
                    where = caller.$name+'@'+where;
                }
                if(caller.caller !== null)
                    caller = caller.caller;
                else {
                    caller = {$name: "unkown"};
                }
            }

            var to_console = [];
            var d = new Date();
            var ms = d.getTime();
            var date = d.format("%d %b %H:%M:%S");
            var seconds_from_start = this.__format( (ms - __programStarts.getTime()) /1000 );

            var common = String.sprintf("%s[d%'06f][%s][p%s]%20s - %20s|", date, ms - __delta, seconds_from_start, process.pid, this.name, where);

            to_console.push(common);
            to_console.append(arguments);
            this.logFunction.apply(this, to_console);
            __delta = ms;
        },
        /**
        * @member Logger
        * @public
        */
        debug: function() {
            var args = [];
            args.push('(DBG)');
            args  = Array.fromIndexedObject(arguments, args);
            this.log.apply(this, args);
        },
        /**
        * @member Logger
        * @public
        */
        verbose: function() {
            var args = [];
            args.push("\033[36m(VRB)");
            args.push(JSON.stringifyf(Array.fromIndexedObject(arguments)));
            args.push("\033[0m");
            this.log.apply(this, args);
        },
        /**
        * @member Logger
        * @public
        */
        warning: function() {
            var args = [];
            args.push("\033[35m(WRN)");
            args = Array.fromIndexedObject(arguments, args);
            args.push("\033[0m");
            this.log.apply(this, args);
        },
        /**
        * @member Logger
        * @public
        * @param {error} warning
        */
        error: function(error) {
            var args = [];
            args.push("\033[36m(ERR)");
            args = Array.fromIndexedObject(arguments, args);
            args.push("\033[0m");
            this.log.apply(this, args);
        },
        /**
        * @member Logger
        * @constructor
        */
        profile: function(context, update) {
            if(this.profile[context] === undefined) {
                this.profile[context] = new Date().getTime();
            } else {
                var time = new Date().getTime() - this.profile[context];
                try {
                    console.log("["+time+"]"+context);
                }catch(e) {
                }
                if(update !== undefined) {
                    this.profile[context] = new Date().getTime();
                } else {
                    this.profile[context] = undefined;
                }
            }
        }
    };

    this.Logger = new Class(LoggerPrototype);
})();


(function(){
    this.Events.implement({
    addEventOnce: function(type, fn) {
        return this.addEvent(type, function() {
            fn();
            this.removeEvent(type, arguments.callee);
        });
    },
    addEventNTimes: function(type, count, fn) {
        var counter = 0;
        return this.addEvent(type, function() {
            fn();
            if(++counter == count) {
                this.removeEvent(type, arguments.callee);
            }
        });
    },
    addEventN: function(type, when, fn) {
        var counter = 0;
        return this.addEvent(type, function() {
            if(++counter == count) {
                fn();
                this.removeEvent(type, arguments.callee);
            }
        });
    }
});

})();

(function() {
    /**
     * @class DelayedChain
     */
    this.DelayedChain = new Class({

        $chain: [],

        executing: false,

        /**
         * @member DelayedChain
         * @param Function fn
         * @param Number delay
         */
        chain: function(){
            var args = Array.flatten(arguments);
            var i=0, max=args.length;
            for(;i<max;i+=2) {
                this.$chain.push({delay: args[i+1], fn: args[i]});
            }
            return this;
        },
        /**
         * dispatch the chain, prevents from being called twice
         * @member DelayedChain
         */
        callChain: function(){
            if (this.$chain.length === 0 || this.executing === null) {
                this.executing = false;
                return false;
            }

            this.executing = true;
            var exec = this.$chain.shift();
            exec.fn.apply(this, arguments);
            this.callChain.delay(exec.delay, this);

            return true;
        },
        stopChain: function() {
            this.executing = null;
        },
        /**
         * remove all function in the chain
         * @member DelayedChain
         */
        clearChain: function(){
            this.$chain.empty();
            return this;
        }

    });
})();

var Element = {};
Element.ShortStyles = {};
Element.Styles = {
    position: '@ @',     x: '@',             y: '@',
    rotate: '@',
    scale: '@ @',        scaleX: '@',        scaleY: '@',
    skew: '@ @',         skewX: '@',         skewY: '@'
};

/*
---

name: Fx

description: Contains the basic animation logic to be extended by all other Fx Classes.

license: MIT-style license.

requires: [Chain, Events, Options]

provides: Fx

...
*/

(function(){

var Fx = this.Fx = new Class({

    Implements: [Chain, Events, Options],

    options: {
        /*
        onStart: nil,
        onCancel: nil,
        onComplete: nil,
        */
        fps: 60,
        unit: false,
        duration: 500,
        frames: null,
        frameSkip: true,
        link: 'ignore'
    },

    initialize: function(options){
        this.subject = this.subject || this;
        this.setOptions(options);
    },

    getTransition: function(){
        return function(p){
            return -(Math.cos(Math.PI * p) - 1) / 2;
        };
    },

    step: function(now){
        if (this.options.frameSkip){
            var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
            this.time = now;
            this.frame += frames;
        } else {
            this.frame++;
        }

        if (this.frame < this.frames){
            var delta = this.transition(this.frame / this.frames);
            this.set(this.compute(this.from, this.to, delta));
        } else {
            this.frame = this.frames;
            this.set(this.compute(this.from, this.to, 1));
            this.stop();
        }
    },

    set: function(now){
        return now;
    },

    compute: function(from, to, delta){
        return Fx.compute(from, to, delta);
    },

    check: function(){
        if (!this.isRunning()) return true;
        switch (this.options.link){
            case 'cancel': this.cancel(); return true;
            case 'chain': this.chain(this.caller.pass(arguments, this)); return false;
        }
        return false;
    },

    //<radamn>
    start: function(from, to, autolistener){
        autolistener = autolistener || true;
        if (!this.check(from, to)) return this;
        this.from = from;
        this.to = to;
        this.frame = (this.options.frameSkip) ? 0 : -1;
        this.time = null;
        this.transition = this.getTransition();
        var frames = this.options.frames, fps = this.options.fps, duration = this.options.duration;
        this.duration = Fx.Durations[duration] || duration.toInt();
        this.frameInterval = 1000 / fps;
        this.frames = frames || Math.round(this.duration / this.frameInterval);
        this.fireEvent('start', this.subject);

        if(autolistener)
            pushInstance.call(this, fps);
        return this;
    },
    //</radamn>

    stop: function(){
        if (this.isRunning()){
            this.time = null;
            pullInstance.call(this, this.options.fps);
            if (this.frames == this.frame){
                this.fireEvent('complete', this.subject);
                if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
            } else {
                this.fireEvent('stop', this.subject);
            }
        }
        return this;
    },

    cancel: function(){
        if (this.isRunning()){
            this.time = null;
            pullInstance.call(this, this.options.fps);
            this.frame = this.frames;
            this.fireEvent('cancel', this.subject).clearChain();
        }
        return this;
    },

    pause: function(){
        if (this.isRunning()){
            this.time = null;
            pullInstance.call(this, this.options.fps);
        }
        return this;
    },

    resume: function(){
        if ((this.frame < this.frames) && !this.isRunning()) pushInstance.call(this, this.options.fps);
        return this;
    },

    isRunning: function(){
        var list = instances[this.options.fps];
        return list && list.contains(this);
    }

});

Fx.compute = function(from, to, delta){
    return (to - from) * delta + from;
};

Fx.Durations = {'short': 250, 'normal': 500, 'long': 1000};

// global timers

var instances = {}, timers = {};

var loop = function(){
    var now = Date.now();
    for (var i = this.length; i--;){
        var instance = this[i];
        if (instance) instance.step(now);
    }
};

var pushInstance = function(fps){
    var list = instances[fps] || (instances[fps] = []);
    list.push(this);
    if (!timers[fps]) timers[fps] = loop.periodical(Math.round(1000 / fps), list);
};

var pullInstance = function(fps){
    var list = instances[fps];
    if (list){
        list.erase(this);
        if (!list.length && timers[fps]){
            delete instances[fps];
            timers[fps] = clearInterval(timers[fps]);
        }
    }
};

})();

/*
---

name: Fx.Transitions

description: Contains a set of advanced transitions to be used with any of the Fx Classes.

license: MIT-style license.

credits:
  - Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified and optimized to be used with MooTools.

requires: Fx

provides: Fx.Transitions

...
*/

Fx.implement({

    getTransition: function(){
        var trans = this.options.transition || Fx.Transitions.Sine.easeInOut;
        if (typeof trans == 'string'){
            var data = trans.split(':');
            trans = Fx.Transitions;
            trans = trans[data[0]] || trans[data[0].capitalize()];
            if (data[1]) trans = trans['ease' + data[1].capitalize() + (data[2] ? data[2].capitalize() : '')];
        }
        return trans;
    }

});

Fx.Transition = function(transition, params){
    params = Array.from(params);
    var easeIn = function(pos){
        return transition(pos, params);
    };
    return Object.append(easeIn, {
        easeIn: easeIn,
        easeOut: function(pos){
            return 1 - transition(1 - pos, params);
        },
        easeInOut: function(pos){
            return (pos <= 0.5 ? transition(2 * pos, params) : (2 - transition(2 * (1 - pos), params))) / 2;
        }
    });
};

Fx.Transitions = {

    linear: function(zero){
        return zero;
    }

};



Fx.Transitions.extend = function(transitions){
    for (var transition in transitions) Fx.Transitions[transition] = new Fx.Transition(transitions[transition]);
};

Fx.Transitions.extend({

    Pow: function(p, x){
        return Math.pow(p, x && x[0] || 6);
    },

    Expo: function(p){
        return Math.pow(2, 8 * (p - 1));
    },

    Circ: function(p){
        return 1 - Math.sin(Math.acos(p));
    },

    Sine: function(p){
        return 1 - Math.cos(p * Math.PI / 2);
    },

    Back: function(p, x){
        x = x && x[0] || 1.618;
        return Math.pow(p, 2) * ((x + 1) * p - x);
    },

    Bounce: function(p){
        var value;
        for (var a = 0, b = 1; 1; a += b, b /= 2){
            if (p >= (7 - 4 * a) / 11){
                value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
                break;
            }
        }
        return value;
    },

    Elastic: function(p, x){
        return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x && x[0] || 1) / 3);
    }

});

['Quad', 'Cubic', 'Quart', 'Quint'].each(function(transition, i){
    Fx.Transitions[transition] = new Fx.Transition(function(p){
        return Math.pow(p, i + 2);
    });
});

/*
---

name: Fx.Node

description: Contains the Radamn.Node animation logic.

license: Radamn License

requires: [Fx]

provides: Fx.Node

...
*/

 Fx.Node = new Class({

    Extends: Fx,

    //prepares the base from/to object

    prepare: function(element, property, values){
        values = Array.from(values);
        if (values[1] == null){
            values[1] = values[0];
            values[0] = element.getStyle(property);
        }
        var parsed = values.map(this.parse);
        return {from: parsed[0], to: parsed[1]};
    },

    //parses a value into an array

    parse: function(value){
        value = Function.from(value)();
        value = (typeof value == 'string') ? value.split(' ') : Array.from(value);
        return value.map(function(val){
            val = String(val);
            var found = false;
            Object.each(Fx.Node.Parsers, function(parser, key){
                if (found) return;
                var parsed = parser.parse(val);
                if (parsed || parsed === 0) found = {value: parsed, parser: parser};
            });
            found = found || {value: val, parser: Fx.Node.Parsers.String};
            return found;
        });
    },

    //computes by a from and to prepared objects, using their parsers.

    compute: function(from, to, delta){
        var computed = [];
        (Math.min(from.length, to.length)).times(function(i){
            computed.push({value: from[i].parser.compute(from[i].value, to[i].value, delta), parser: from[i].parser});
        });
        computed.$family = Function.from('fx:css:value');
        return computed;
    },

    //serves the value as settable

    serve: function(value, unit){
        if (typeOf(value) != 'fx:css:value') value = this.parse(value);
        var returned = [];
        value.each(function(bit){
            returned = returned.concat(bit.parser.serve(bit.value, unit));
        });
        return returned;
    },

    //renders the change to an element

    render: function(element, property, value, unit){
        //element.setStyle(property, this.serve(value, unit));
        switch(property) {
            case 'x' :
                element.getMatrix().setPosition(this.serve(value, '')[0], false);
            break;
            case 'y' :
                element.getMatrix().setPosition(false, this.serve(value, '')[0]);
                break;
            case 'position' :
                var aux = this.serve(value, '');
                element.getMatrix().setPosition(aux[0], aux[1]);
                break;
            case 'rotate' :
                element.getMatrix().setRotation(this.serve(value, '')[0]);
                break;
            case 'scale' :
                var aux = this.serve(value, '');
                element.getMatrix().setScale(aux[0], aux[1]);
                break;
            case 'skew' :
                var aux = this.serve(value, '');
                element.getMatrix().setSkew(aux[0], aux[1]);
                break;
            case 'skewx' :
                var aux = this.serve(value, '');
                element.getMatrix().setSkew(aux[0], false);
                break;
            case 'skewy' :
                var aux = this.serve(value, '');
                element.getMatrix().setSkew(false, aux[0]);
                break;
        }
    },

    //searches inside the page css to find the values for a selector

    search: function(selector){
        if (Fx.Node.Cache[selector]) return Fx.Node.Cache[selector];
        var to = {}, selectorTest = new RegExp('^' + selector.escapeRegExp() + '$');
        Array.each(document.styleSheets, function(sheet, j){
            var href = sheet.href;
            if (href && href.contains('://') && !href.contains(document.domain)) return;
            var rules = sheet.rules || sheet.cssRules;
            Array.each(rules, function(rule, i){
                if (!rule.style) return;
                var selectorText = (rule.selectorText) ? rule.selectorText.replace(/^\w+/, function(m){
                    return m.toLowerCase();
                }) : null;
                if (!selectorText || !selectorTest.test(selectorText)) return;
                Object.each(Element.Styles, function(value, style){
                    if (!rule.style[style] || Element.ShortStyles[style]) return;
                    value = String(rule.style[style]);
                    to[style] = ((/^rgb/).test(value)) ? value.rgbToHex() : value;
                });
            });
        });
        return Fx.Node.Cache[selector] = to;
    }

});

Fx.Node.Cache = {};

Fx.Node.Parsers = {

    Color: {
        parse: function(value){
            if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
            return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
        },
        compute: function(from, to, delta){
            return from.map(function(value, i){
                return Math.round(Fx.compute(from[i], to[i], delta));
            });
        },
        serve: function(value){
            return value.map(Number);
        }
    },

    Number: {
        parse: parseFloat,
        compute: Fx.compute,
        serve: function(value, unit){
            return (unit) ? value + unit : value;
        }
    },

    String: {
        parse: Function.from(false),
        compute: function(zero, one){
            return one;
        },
        serve: function(zero){
            return zero;
        }
    }

};

Fx.Tween = new Class({

    Extends: Fx.Node,

    initialize: function(element, options){
        this.element = this.subject = document.id(element);
        this.parent(options);
    },

    set: function(property, now){
        if (arguments.length == 1){
            now = property;
            property = this.property || this.options.property;
        }
        this.render(this.element, property, now, this.options.unit);
        return this;
    },

    //<radamn>
    start: function(property, from, to, autolistener){
        autolistener = autolistener || true;
        if (!this.check(property, from, to)) return this;
        var args = Array.flatten(arguments);
        this.property = this.options.property || args.shift();
        var parsed = this.prepare(this.element, this.property, args);
        return this.parent(parsed.from, parsed.to, autolistener);
    }
    //</radamn>

});
