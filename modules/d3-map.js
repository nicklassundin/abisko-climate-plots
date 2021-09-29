const $ = require("jquery");
const d3 = require("d3");
const geo = require("geo");
const topojson = require("topojson-client");
const municipalities = require("../maps/sweden-municipalities.json");
const sweden = require("../maps/sweden-counties.json"),

    stations = require("./map.js").series;

geoMap = function () {

    const {clientWidth} = document.body,
        hConst = 730 / 330,
	 m_width = $("#map").width(),
        width = clientWidth / 2,
        height = hConst * width,

        /*
         * Console.log(width)
         * Console.log(height)
         */
        projection = d3.geoAlbers().
            center([
                0,
                62.30
            ]).
            rotate([
                -17,
                0
            ]).
            parallels([
                50,
                60
            ]).
            scale(3000).
            translate([
                width / 2,
                height / 2
            ]),

	 path = d3.geoPath().
            projection(projection),

	 svg = d3.select("#map").append("svg").
            attr(
                "preserveAspectRatio",
                "xMidYMid"
            ).
            attr(
                "viewBox",
                `0 0 ${width} ${height}`
            ).
            attr(
                "width",
                m_width
            ).
            attr(
                "height",
                m_width * height / width
            ),

        /*
         * Svg.append("rect")
         * .attr("class", "background")
         * .attr("width", width)
         * .attr("height", height)
         * .on("click", country_clicked);
         */

	 g = svg.append("g");

    /*
     * Console.log(sweden)
     * Console.log(topojson.feature(sweden, sweden.objects.SWE_adm1).features)
     */
    g.append("g").
        attr(
            "id",
            "Municipality"
        ).
        selectAll("path").
        data(topojson.feature(
            sweden,
            sweden.objects.SWE_adm1
        ).features).
        enter().
        append("path").
        attr(
            "id",
            (d) => d.NAME_1
        ).
        attr(
            "d",
            path
        );
    // .on("click", country_clicked);

    stations.then((entries) => {

        svg.selectAll(".pin").
            data(entries).
            enter().
            append(
                "circle",
                ".pin"
            ).
            attr(
                "class",
                "dot"
            ).
            attr(
                "id",
                (d) => d.id
            ).
            attr(
                "r",
                2
            ).
            attr(
                "fill",
                "red"
            ).
            attr(
                "transform",
                (d) => `translate(${projection([
                    d.lon,
                    d.lat
                ])})`
            ).
            on(
                "mouseover",
                (d) => {

                /*
                 * Svg.selectAll("#"+d.id)
                 * 	.attr("r", 5);
                 */
                }
            ).
            on(
                "mouseout",
                (d) => {

                }
            ).
            on(
                "onclick",
                (d) => {

                    console.log(d);

                }
            );

    });


    $(window).resize(() => {

        const w = $("#map").width();
        svg.attr(
            "width",
            w
        );
        svg.attr(
            "height",
            w * height / width
        );

    });

};
