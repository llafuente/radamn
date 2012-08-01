(function (exports, browser) {
    "use strict";

    // in this file
    var distance_4points,
        distance_circle_vs_circle,
        distance_line2_vs_vec2,
        distance_rectangle_vs_rectangle,
        distance_segment2_vs_vec2,
        distance_rectangle_vs_vec2,
        distance_vec2_vs_vec2,
        fast_distance_vec2_vs_vec2,
        //cache
        sqrt = Math.sqrt,
        min = Math.min,
        max = Math.max,
        abs = Math.abs;


    /**
     * @member Math
     * @param Number x1
     * @param Number y1
     * @param Number x2
     * @param Number y2
     */
    distance_4points = Math.distance_4points = function (x1, y1, x2, y2) {
        var x = x1 - x2,
            y = y1 - y2;

        return sqrt(x * x + y * y);
    };
    /**
     * @member Math
     * @param Circle acircle
     * @param Circle bcircle
     */
    distance_circle_vs_circle = Math.distance_circle_vs_circle = function (acircle, bcircle) {
        return max(0, distance_vec2_vs_vec2(acircle.c, bcircle.c) - acircle.r - bcircle.r);
    };
    /**
     * @member Math
     * @param Line2 line
     * @param Vec2 line
     */
    distance_line2_vs_vec2 = Math.distance_line2_vs_vec2 = function (line, point) {
        var segment = {
                x1 : line.x,
                y1 : line.y,
                x2 : line.x + line.m,
                y2 : line.y + line.m
            },

            r_numerator = (segment.x1 - segment.x2) * (point.x - segment.x2) + (segment.y1 - segment.y2) * (point.y - segment.y2),
            r_denomenator = (point.x - segment.x2) * (point.x - segment.x2) + (point.y - segment.y2) * (point.y - segment.y2),
            r = r_denomenator === 0 ? 0 : (r_numerator / r_denomenator),
            //
            px = segment.x2 + r * (point.x - segment.x2),
            py = segment.y2 + r * (point.y - segment.y2),
            //
            s = ((segment.y2 - segment.y1) * (point.x - segment.x2) - (segment.x2 - segment.x1) * (point.y - segment.y2)) / r_denomenator,
            distanceLine = abs(s) * sqrt(r_denomenator);

        return ((r >= 0) && (r <= 1)) ? 0 : distanceLine;
    };
    /**
     * @member Math
     * @param Rectangle rect1
     * @param Rectangle rect2
     */
    distance_rectangle_vs_rectangle = Math.distance_rectangle_vs_rectangle = function (rect1, rect2) {
        return rect1.center().subtract(rect2.center()).length();
    };
    /**
     * @member Math
     * @param Segment2 segment
     * @param Vec2 v2
     */
    distance_segment2_vs_vec2 = Math.distance_segment2_vs_vec2 = function (segment, v2) {

        var A = v2.x - segment.x1,
            B = v2.y - segment.y1,
            C = segment.x2 - segment.x1,
            D = segment.y2 - segment.y1,
            dot = A * C + B * D,
            len_sq = C * C + D * D,
            param = dot / len_sq,
            xx,
            yy;

        if (param < 0) {
            xx = segment.x1;
            yy = segment.y1;
        } else if (param > 1) {
            xx = segment.x2;
            yy = segment.y2;
        } else {
            xx = segment.x1 + param * C;
            yy = segment.y1 + param * D;
        }

        return distance_4points(v2.x, v2.y, xx, yy);
    };
    /**
     * @member Math
     * @param Rectangle rect
     * @param Vec2 vec2
    */
    distance_rectangle_vs_vec2 = Math.distance_rectangle_vs_vec2 = function (rect, vec2) {
        rect.normalize();
        /*
        @TODO: Optimize, i cant find the right combination
        var hcat = vec2.x < rect.v1.x ? 0 : ( vec2.x > rect.v2.x ? 2 : 1 );
        var vcat = vec2.y > rect.v1.y ? 0 : ( vec2.y < rect.v2.y ? 2 : 1 );
        console.log(hcat, vcat);

        if(hcat == 0 && vcat == 0) return distance_vec2_vs_vec2(rect.v1, vec2);
        if(hcat == 2 && vcat == 2) return distance_vec2_vs_vec2(rect.v2, vec2);

        if(hcat == 0 && vcat == 2) return distance_vec2_vs_vec2(new Vec2(rect.v2.x, rect.v1.y), vec2);
        if(hcat == 2 && vcat == 0) return distance_vec2_vs_vec2(new Vec2(rect.v1.x, rect.v2.y), vec2);

        if(hcat == 0 && vcat == 1) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v1.y), new Vec2(rect.v1.x, rect.v2.y));
        if(hcat == 1 && vcat == 0) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v1.y), new Vec2(rect.v2.x, rect.v1.y));

        if(hcat == 2 && vcat == 1) return distance_segment2_vs_vec2(new Vec2(rect.v2.x, rect.v1.y), new Vec2(rect.v2.x, rect.v2.y));
        if(hcat == 1 && vcat == 2) return distance_segment2_vs_vec2(new Vec2(rect.v1.x, rect.v2.y), new Vec2(rect.v2.x, rect.v2.y));
        */

        var s1 = new Segment2(rect.v1, new Vec2(rect.v1.x, rect.v2.y)),
            s2 = new Segment2(rect.v1, new Vec2(rect.v2.x, rect.v1.y)),
            s3 = new Segment2(new Vec2(rect.v1.x, rect.v2.y), rect.v2),
            s4 = new Segment2(new Vec2(rect.v2.x, rect.v1.y), rect.v2);

        return min(
            distance_segment2_vs_vec2(s1, vec2),
            distance_segment2_vs_vec2(s2, vec2),
            distance_segment2_vs_vec2(s3, vec2),
            distance_segment2_vs_vec2(s4, vec2)
        );
    };
    /**
     * @member Math
     * @param Vec2 a
     * @param Vec2 b
     */
    distance_vec2_vs_vec2 = Math.distance_vec2_vs_vec2 = function (a, b) {
        var x = a.x - b.x,
            y = a.y - b.y;
        return sqrt(x * x + y * y);
    };

    /**
     *
     * @member Math
     * @param Vec2 a
     * @param Vec2 b
     */
    fast_distance_vec2_vs_vec2 = Math.fast_distance_vec2_vs_vec2 = function (a, b) {
        var x = a.x - b.x,
            y = a.y - b.y;
        return x * x + y * y;
    };

}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));