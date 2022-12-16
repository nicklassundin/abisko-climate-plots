const $ = require("jquery");

global.urlParams = new URLSearchParams(window.location.search);

global.selectText = function (e) {

    if (e === document.activeElement) {

        e.blur();

    } else {

        e.focus();
        e.select();

    }

};

const createDiv = function (config, no = null) {

    let {id} = config.files.stationDef,
        el = document.createElement("div");
    if (variables.debug) {

        el = document.createElement("form");

    }
    el.setAttribute(
        "id",
        id
    );
    const fig = document.createElement("figure");
    fig.appendChild(el);
    return fig;

};
exports.createDiv = createDiv;

