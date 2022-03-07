let Functions = {
    // render: async() => {
    //     Style();
    // },

    createStyle: async(styleID, styleTags) => {
        if (!document.getElementById(styleID + 'Style')) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = styleID + 'Style';
            style.innerHTML = styleTags;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    },

    setInnerHTML: async(el, innerHTML) => {
        let element = document.getElementById(el);
        element.classList.remove('visible')
        setTimeout(function() {
            element.classList.add('visible')
        }, 500);
        element.innerHTML = innerHTML;

    },

    /*
    ########     ###    ########   ######  ########    ##     ## ########  ##
    ##     ##   ## ##   ##     ## ##    ## ##          ##     ## ##     ## ##
    ##     ##  ##   ##  ##     ## ##       ##          ##     ## ##     ## ##
    ########  ##     ## ########   ######  ######      ##     ## ########  ##
    ##        ######### ##   ##         ## ##          ##     ## ##   ##   ##
    ##        ##     ## ##    ##  ##    ## ##          ##     ## ##    ##  ##
    ##        ##     ## ##     ##  ######  ########     #######  ##     ## ########
    */
    /* A function that takes a url and breaks it into page, key and value. */
    parseRequestURL: () => {
        let url = location.hash.slice(1).toLowerCase() || '/';
        let request = {};
        // deb(url)
        if (url.includes('-')) {
            let array = url.split('-');
            request.page = array[0];
            request.key = array[1];
            if (array[1].includes(':')) {
                array = array[1].split(':');
                request.key = array[0];
                request.value = array[1];
            }
        } else {
            request.page = url;
            request.key = '';
            request.value = '';
        }
        return request;
    },

    /*
     ######  ##       ######## ######## ########
    ##    ## ##       ##       ##       ##     ##
    ##       ##       ##       ##       ##     ##
     ######  ##       ######   ######   ########
          ## ##       ##       ##       ##
    ##    ## ##       ##       ##       ##
     ######  ######## ######## ######## ##
    */
    sleep: (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },

    /*
    ########  ########     ###     ######      ######## ##       ######## ##     ## ######## ##    ## ########
    ##     ## ##     ##   ## ##   ##    ##     ##       ##       ##       ###   ### ##       ###   ##    ##
    ##     ## ##     ##  ##   ##  ##           ##       ##       ##       #### #### ##       ####  ##    ##
    ##     ## ########  ##     ## ##   ####    ######   ##       ######   ## ### ## ######   ## ## ##    ##
    ##     ## ##   ##   ######### ##    ##     ##       ##       ##       ##     ## ##       ##  ####    ##
    ##     ## ##    ##  ##     ## ##    ##     ##       ##       ##       ##     ## ##       ##   ###    ##
    ########  ##     ## ##     ##  ######      ######## ######## ######## ##     ## ######## ##    ##    ##
    */
    dragElement: (drag, hold) => {
        let dragElement = document.getElementById(drag);
        let holdElement = document.getElementById(hold);
        holdElement.onmousedown = dragMouseDown;
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            dragElement.style.top = dragElement.offsetTop - pos2 + 'px';
            dragElement.style.left = dragElement.offsetLeft - pos1 + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },


    /*
    ########  #######  ########  ##     ## ########     ###    ########    ###
    ##       ##     ## ##     ## ###   ### ##     ##   ## ##      ##      ## ##
    ##       ##     ## ##     ## #### #### ##     ##  ##   ##     ##     ##   ##
    ######   ##     ## ########  ## ### ## ##     ## ##     ##    ##    ##     ##
    ##       ##     ## ##   ##   ##     ## ##     ## #########    ##    #########
    ##       ##     ## ##    ##  ##     ## ##     ## ##     ##    ##    ##     ##
    ##        #######  ##     ## ##     ## ########  ##     ##    ##    ##     ##
    */
    /* This function is used to print out the form data. */
    debFormData: (data) => {
        for (var pair of data.entries()) {
            console.log(pair[0] + ' -> ' + pair[1]);
        }
    },

    pageTitle: (string) => {
        document.title = ` ${string}`
    },


    /*
    ##        #######     ###    ########  #### ##    ##  ######   ########   #######  ########  ######
    ##       ##     ##   ## ##   ##     ##  ##  ###   ## ##    ##  ##     ## ##     ##    ##    ##    ##
    ##       ##     ##  ##   ##  ##     ##  ##  ####  ## ##        ##     ## ##     ##    ##    ##
    ##       ##     ## ##     ## ##     ##  ##  ## ## ## ##   #### ##     ## ##     ##    ##     ######
    ##       ##     ## ######### ##     ##  ##  ##  #### ##    ##  ##     ## ##     ##    ##          ##
    ##       ##     ## ##     ## ##     ##  ##  ##   ### ##    ##  ##     ## ##     ##    ##    ##    ##
    ########  #######  ##     ## ########  #### ##    ##  ######   ########   #######     ##     ######
    */
    /* It's a function that creates a spinner.*/
    loadingDots: (divID, OnOff) => {
        const parentDIV = document.getElementById(divID);
        if (OnOff) {
            const spinnerFrame = document.createElement("div");
            spinnerFrame.id = "spinnerFrame";
            parentDIV.appendChild(spinnerFrame);
            // create stylesheet
            var style = document.createElement("style");
            style.innerHTML = /*CSS*/ `
                .dots {--circle: 40px;--dot: 10px; position: absolute;border-radius: 100%;}
                .dots { width: var(--dot);height: var(--dot);top: calc(50% - var(--dot) / 2);right: calc(50% - var(--dot) / 2);}
                .dots { opacity: 1;animation-duration: 1.5s;animation-fill-mode: both;animation-name: fadeOut;}
                @keyframes fadeOut {0% {opacity: 0;}50% {opacity: 1;}100% {opacity: 0;}}`;
            spinnerFrame.appendChild(style);

            // circle & color vars
            const CoordX = [0, 0.5, 0.866, 1, 0.866, 0.5, 0, -0.5, -0.866, -1, -0.866, -0.5];
            const CoordY = [-1, -0.866, -0.5, 0, 0.5, 0.866, 1, 0.866, 0.5, 0, -0.5, -0.866];
            const color = ["#be5046", "#e06c75", "#d19a66", "#e6c07b", "#98c379", "#56b6c2", "#61aeee", "#c678dd"];
            // create circle
            let wait = 0;
            let lastRand = "";
            // while (OnOff === true) {
            for (let j = 0; j < 100; j++) {
                for (let i = 0; i < 12; i++) {
                    window.setTimeout(function() {
                        if (document.getElementById("dotID_" + i)) {
                            spinnerFrame.removeChild(document.getElementById("dotID_" + i));
                        }

                        let dot = document.createElement("div");
                        dot.id = "dotID_" + i;
                        dot.classList.add("dots");

                        let rand = Math.floor(Math.random() * 7);
                        if (rand === lastRand) {
                            rand = rand + 1;
                        }
                        lastRand = rand;

                        dot.style =
                            "background: " +
                            color[rand] +
                            "; transform: translate(calc(var(--circle) * " +
                            CoordX[i] +
                            "), calc(var(--circle) * " +
                            CoordY[i] +
                            "))";
                        spinnerFrame.appendChild(dot);
                    }, wait);
                    wait += 150;
                }
            }
        } else {
            parentDIV.removeChild(document.getElementById("spinnerFrame"));
        }
    }
};

export default Functions;