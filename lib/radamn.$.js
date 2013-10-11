(function (exports, browser) {
    "use strict";

    /**
     * @exports Radamn.$ as RadamnDefines
     * @class RadamnDefines
     */
    var RadamnDefines = {
        // SDL
        /**
         * @exports RadamnDefines.ALIGNS as RadamnAligns
         * @type RadamnAligns
         */
        ALIGNS : {
            /**
             * @member RadamnAligns
             */
            CENTER: 0,
            TOP_LEFT: 2,
            TOP_RIGHT: 4,
            BOTTOM_LEFT: 8,
            BOTTOM_RIGHT: 16,
            LEFT: 32,
            TOP: 64,
            RIGHT: 128,
            BOTTOM: 256
        },
        /**
         * @exports RadamnDefines.BLENDING as RadamnBlendings
         * @class RadamnBlendings
         */
        BLENDING : {
            /**
             * destination + source
             * @member RadamnBlendings
             * @type String
             */
            SOURCE_OVER: "source-over",
            /**
             * destination & source
             * @member RadamnBlendings
             * @type String
             */
            SOURCE_IN: "source-in",
            /**
             * source - destination
             * @member RadamnBlendings
             * @type String
             */
            SOURCE_OUT: "source-out",
            /**
             * destination + (source & destination)
             * @member RadamnBlendings
             * @type String
             */
            SOURCE_ATOP: "source-atop",
            /**
             * source + destination
             * @member RadamnBlendings
             * @type String
             */
            DESTINATION_OVER: "destination-over",
            /**
             * source & destination
             * @member RadamnBlendings
             * @type String
             */
            DESTINATION_IN: "destination-in",
            /**
             * destination - source
             * @member RadamnBlendings
             * @type String
             */
            DESTINATION_OUT: "destination-out",
            /**
             * source + (destination & source)
             * @member RadamnBlendings
             * @type String
             */
            DESTINATION_ATOP: "destination-atop",
            //LIGTHER: "lighter",            // destination + source + lighter(source & destination)
            //DARKER: "darker",              // destination + source + darker(source & destination)
            /**
             * source ^ destination
             * @member RadamnBlendings
             * @type String
             */
            XOR : "xor",
            /**
             * source
             * @member RadamnBlendings
             * @type String
             */
            COPY: "copy"
        }
    };

    exports.$ = RadamnDefines;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));