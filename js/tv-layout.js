/* ============================================================
   TV LAYOUT ENGINE
   Virtual design resolution:
   1920 × 1080

   The entire dashboard is designed using this coordinate system.

   The script automatically scales it to the available viewport.
   ============================================================ */

(function () {

    "use strict";


    const DESIGN_WIDTH = 1920;
    const DESIGN_HEIGHT = 1080;

    const screen = document.getElementById("tv-screen");
    const viewport = document.getElementById("tv-viewport");
    const screenInfo = document.getElementById("screenInfo");


    if (!screen || !viewport) {
        console.error("TV layout elements not found.");
        return;
    }


    /* =========================================================
       CALCULATE SCALE
       ========================================================= */

    function updateTVScale() {

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;


        /*
         * Calculate scale required to fit the complete
         * 1920 × 1080 canvas inside the available viewport.
         */

        const scaleX =
            viewportWidth / DESIGN_WIDTH;

        const scaleY =
            viewportHeight / DESIGN_HEIGHT;


        /*
         * Use the smaller value so the entire dashboard
         * always remains visible.
         */

        const scale =
            Math.min(scaleX, scaleY);


        /*
         * Center the virtual screen.
         */

        const scaledWidth =
            DESIGN_WIDTH * scale;

        const scaledHeight =
            DESIGN_HEIGHT * scale;


        const left =
            (viewportWidth - scaledWidth) / 2;

        const top =
            (viewportHeight - scaledHeight) / 2;


        screen.style.transform =
            `translate(${left}px, ${top}px) scale(${scale})`;


        /*
         * Update development information.
         */

        if (screenInfo) {

            screenInfo.textContent =
                `${viewportWidth} × ${viewportHeight} · ` +
                `Scale ${scale.toFixed(3)}`;
        }


        /*
         * Store useful values globally.
         */

        window.TV = {

            designWidth: DESIGN_WIDTH,

            designHeight: DESIGN_HEIGHT,

            viewportWidth: viewportWidth,

            viewportHeight: viewportHeight,

            scale: scale
        };

    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    function initialize() {

        /*
         * Add development class while running
         * from a normal browser.
         *
         * Remove this if you don't want the development outline.
         */

        if (
            location.hostname === "localhost" ||
            location.hostname === "127.0.0.1"
        ) {

            document.body.classList.add("development");

        }


        updateTVScale();

    }


    /* =========================================================
       WINDOW RESIZE
       ========================================================= */

    let resizeTimer;

    window.addEventListener("resize", function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(
            updateTVScale,
            50
        );

    });


    /* =========================================================
       ORIENTATION / DISPLAY CHANGE
       ========================================================= */

    if (screen.orientation) {

        screen.orientation.addEventListener(
            "change",
            updateTVScale
        );

    }


    /* =========================================================
       START
       ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();