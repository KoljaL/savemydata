let Functions = {

    /*
    //  
    //   ######  ########  ########    ###    ######## ########     ######  ######## ##    ## ##       ########
    //  ##    ## ##     ## ##         ## ##      ##    ##          ##    ##    ##     ##  ##  ##       ##
    //  ##       ##     ## ##        ##   ##     ##    ##          ##          ##      ####   ##       ##
    //  ##       ########  ######   ##     ##    ##    ######       ######     ##       ##    ##       ######
    //  ##       ##   ##   ##       #########    ##    ##                ##    ##       ##    ##       ##
    //  ##    ## ##    ##  ##       ##     ##    ##    ##          ##    ##    ##       ##    ##       ##
    //   ######  ##     ## ######## ##     ##    ##    ########     ######     ##       ##    ######## ########
    //  
    */
    createStyle: async(styleID, styleTags) => {
        if (!document.getElementById(styleID + 'Style')) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = styleID + 'Style';
            style.innerHTML = styleTags;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    },


    addStylesheet: async(path) => {
        var ss = document.createElement("link");
        ss.type = "text/css";
        ss.rel = "stylesheet";
        ss.href = path;
        document.getElementsByTagName("head")[0].appendChild(ss);
    },



    /*
    //  
    //   ######  ######## ########    #### ##    ## ##    ## ######## ########  ##     ## ######## ##     ## ##
    //  ##    ## ##          ##        ##  ###   ## ###   ## ##       ##     ## ##     ##    ##    ###   ### ##
    //  ##       ##          ##        ##  ####  ## ####  ## ##       ##     ## ##     ##    ##    #### #### ##
    //   ######  ######      ##        ##  ## ## ## ## ## ## ######   ########  #########    ##    ## ### ## ##
    //        ## ##          ##        ##  ##  #### ##  #### ##       ##   ##   ##     ##    ##    ##     ## ##
    //  ##    ## ##          ##        ##  ##   ### ##   ### ##       ##    ##  ##     ##    ##    ##     ## ##
    //   ######  ########    ##       #### ##    ## ##    ## ######## ##     ## ##     ##    ##    ##     ## ########
    //  
    */
    setInnerHTML: async(el, innerHTML) => {
        let element = document.getElementById(el);
        // element.classList.remove('visible');
        // await Functions.sleep(200)
        element.innerHTML = innerHTML;
        // await Functions.sleep(200)
        // element.classList.add('visible');
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
        if (url.includes('/')) {
            let arr = url.split('/');
            request.page = arr[0];
            request.key = arr[1];
            request.value = arr[2];
        } else {
            request.page = url;
            request.key = '';
            request.value = '';
        }
        // deb(request)
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
    sleep: async(ms) => {
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
    /* This is a JavaScript function that allows you to drag an element on the screen. */
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
        document.title = ` ${string}`;
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
            const spinnerFrame = document.createElement('div');
            spinnerFrame.id = 'spinnerFrame';
            parentDIV.appendChild(spinnerFrame);
            // create stylesheet
            var style = document.createElement('style');
            style.innerHTML = /*CSS*/ `
                .dots {--circle: 40px;--dot: 10px; position: absolute;border-radius: 100%;}
                .dots { width: var(--dot);height: var(--dot);top: calc(50% - var(--dot) / 2);right: calc(50% - var(--dot) / 2);}
                .dots { opacity: 1;animation-duration: 1.5s;animation-fill-mode: both;animation-name: fadeOut;}
                @keyframes fadeOut {0% {opacity: 0;}50% {opacity: 1;}100% {opacity: 0;}}`;
            spinnerFrame.appendChild(style);

            // circle & color vars
            const CoordX = [0, 0.5, 0.866, 1, 0.866, 0.5, 0, -0.5, -0.866, -1, -0.866, -0.5];
            const CoordY = [-1, -0.866, -0.5, 0, 0.5, 0.866, 1, 0.866, 0.5, 0, -0.5, -0.866];
            const color = ['#be5046', '#e06c75', '#d19a66', '#e6c07b', '#98c379', '#56b6c2', '#61aeee', '#c678dd'];
            // create circle
            let wait = 0;
            let lastRand = '';
            // while (OnOff === true) {
            for (let j = 0; j < 100; j++) {
                for (let i = 0; i < 12; i++) {
                    window.setTimeout(function() {
                        if (document.getElementById('dotID_' + i)) {
                            // spinnerFrame.removeChild(document.getElementById('dotID_' + i));
                            document.getElementById('dotID_' + i).remove();
                        }

                        let dot = document.createElement('div');
                        dot.id = 'dotID_' + i;
                        dot.classList.add('dots');

                        let rand = Math.floor(Math.random() * 7);
                        if (rand === lastRand) {
                            rand = rand + 1;
                        }
                        lastRand = rand;

                        dot.style = 'background: ' + color[rand] + '; transform: translate(calc(var(--circle) * ' + CoordX[i] + '), calc(var(--circle) * ' + CoordY[i] + '))';
                        spinnerFrame.appendChild(dot);
                    }, wait);
                    wait += 150;
                }
            }
        } else {
            if (document.getElementById('spinnerFrame')) {
                document.getElementById('spinnerFrame').remove();
            }
            // parentDIV.removeChild(document.getElementById('spinnerFrame'));
        }
    },

    /*
    //  
    //  ##        #######   ######     ###    ##        ######  ########  #######  ########     ###    ######## ########
    //  ##       ##     ## ##    ##   ## ##   ##       ##    ##    ##    ##     ## ##     ##   ## ##      ##    ##
    //  ##       ##     ## ##        ##   ##  ##       ##          ##    ##     ## ##     ##  ##   ##     ##    ##
    //  ##       ##     ## ##       ##     ## ##        ######     ##    ##     ## ########  ##     ##    ##    ######
    //  ##       ##     ## ##       ######### ##             ##    ##    ##     ## ##   ##   #########    ##    ##
    //  ##       ##     ## ##    ## ##     ## ##       ##    ##    ##    ##     ## ##    ##  ##     ##    ##    ##
    //  ########  #######   ######  ##     ## ########  ######     ##     #######  ##     ## ##     ##    ##    ########
    //  
    */
    /* This is a function that sets a local storage item. */
    setLocal: (key, value) => {
        localStorage.setItem('SMD_' + key, value);
    },
    /* This is a function that gets the value of a key from local storage. */
    getLocal: (key) => {
        return localStorage.getItem('SMD_' + key);
    },
    /* Removing all the data from the local storage. */
    flushLocal: () => {
        // deb('flush')
        var arr = [];
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).substring(0, 4) == 'SMD_') {
                arr.push(localStorage.key(i));
                // deb(localStorage.key(i))
            }
        }
        for (var i = 0; i < arr.length; i++) {
            localStorage.removeItem(arr[i]);
        }
        // window.location.hash = '';
        location.href = './login';

        // document.getElementById('body').classList.add('darkWrapper')
        // history.pushState('', document.title, window.location.pathname);
        // location.reload();
    },

    /*
    //  
    //   ######   ######## ########    ###    ########  #### ########     ###    ########    ###
    //  ##    ##  ##          ##      ## ##   ##     ##  ##  ##     ##   ## ##      ##      ## ##
    //  ##        ##          ##     ##   ##  ##     ##  ##  ##     ##  ##   ##     ##     ##   ##
    //  ##   #### ######      ##    ##     ## ########   ##  ##     ## ##     ##    ##    ##     ##
    //  ##    ##  ##          ##    ######### ##         ##  ##     ## #########    ##    #########
    //  ##    ##  ##          ##    ##     ## ##         ##  ##     ## ##     ##    ##    ##     ##
    //   ######   ########    ##    ##     ## ##        #### ########  ##     ##    ##    ##     ##
    //  
    */
    /* This code is fetching the data from the API and returning it. */
    getAPIdata: async(URL, formData = '') => {
        // deb(formData)
        // if called without the formData parameter
        if (formData === '') {
            formData = new FormData();
            // deb('new FormData')
        }
        // almost always add the token
        if (URL !== 'login') {
            // deb('append user token')
            formData.append('user_token', Functions.getLocal('token'));
        }
        // if fornData was just a node, make real FormData of it
        if (!(formData instanceof FormData)) {
            formData = new FormData(formData);
        }

        // URL = 'https://dev.rasal.de/savemydata/api/' + URL;
        // URL = 'http://localhost/savemydata/api/' + URL;
        // URL = 'api/' + URL;
        URL = 'savemydata/api/' + URL;
        formData = JSON.stringify(Object.fromEntries(formData));
        // deb(formData)
        const response = await fetch(URL, {
            method: 'POST',
            credentials: 'same-origin',
            body: formData,
            headers: { 'Content-Type': 'application/json', },
        });
        const data = await response.json();
        return data;
    },

    /* Uploading the form data to the API. */
    uploadToAPI: async(URL, formData) => {
        formData.append('user_token', Functions.getLocal('token'));
        // deb(formData)
        // Functions.debFormData(formData);
        URL = 'api/' + URL;
        // deb(formData)
        const response = await fetch(URL, {
            method: 'POST',
            credentials: 'same-origin',
            body: formData,
            // headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = await response.json();
        return data;
    },


    /*
    //  
    //  ##     ##  ######  ######## ########  ##    ##    ###    ##     ## ########
    //  ##     ## ##    ## ##       ##     ## ###   ##   ## ##   ###   ### ##
    //  ##     ## ##       ##       ##     ## ####  ##  ##   ##  #### #### ##
    //  ##     ##  ######  ######   ########  ## ## ## ##     ## ## ### ## ######
    //  ##     ##       ## ##       ##   ##   ##  #### ######### ##     ## ##
    //  ##     ## ##    ## ##       ##    ##  ##   ### ##     ## ##     ## ##
    //   #######   ######  ######## ##     ## ##    ## ##     ## ##     ## ########
    //  
    */

    /* Setting the username in the navbar. */
    setUsername: async(username, userID, avatarPath) => {
        if (!avatarPath) {
            avatarPath = 'userdata/uploads/avatars/admin.png';
            // deb(avatarPath)
        }
        document.querySelector('nav .sidebar_userpanel').innerHTML = /*HTML*/ `
            <img src="${avatarPath}" class=boxShadow width="40" height="40">
            <span class=username  onclick='window.location.hash ="staff/profile/"+${userID}'>${username}</span>
            <span id=userLogout class="logout_icon"></span>`;
    },


    /*
    //  
    //   ######  #### ##    ##  ######   ##       ########    ######## ########  #### ########
    //  ##    ##  ##  ###   ## ##    ##  ##       ##          ##       ##     ##  ##     ##
    //  ##        ##  ####  ## ##        ##       ##          ##       ##     ##  ##     ##
    //   ######   ##  ## ## ## ##   #### ##       ######      ######   ##     ##  ##     ##
    //        ##  ##  ##  #### ##    ##  ##       ##          ##       ##     ##  ##     ##
    //  ##    ##  ##  ##   ### ##    ##  ##       ##          ##       ##     ##  ##     ##
    //   ######  #### ##    ##  ######   ######## ########    ######## ########  ####    ##
    //  
    */
    /* This is the code that is used to update a single value in the database. */
    singleEdit: async(el) => {
        // deb(el)
        if (el.dataset.db) {

            let db = el.dataset.db.split('/');

            var formData = new FormData();
            formData.append('update', db[0]);
            formData.append('table', db[1]);
            formData.append('where', db[2]);
            formData.append('equal', db[3]);
            formData.append('value', el.value);

            Functions.getAPIdata('edit_single_field', formData)
                .then((res) => {
                    // deb(res);
                    if (200 === res.code) {
                        el.classList.add('successEdit')
                        Message.info("Value '" + el.value + "' saved");
                        setTimeout(() => {
                            el.classList.remove('successEdit')
                        }, 2000);
                    }
                    // no else, so we have a chance of no extra class ;-)
                    if (400 === res.code) {
                        el.classList.add('errorEdit')
                    }
                });
        }
    },

    /* This is a function that generates a random string of a given length. */
    makeid: (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    /* The above code is checking to see if the form is valid. */
    validForm: (form) => {
        for (let i = 0; i < form.length; i++) {
            // deb(form[i])
            if (!form[i].value && form[i].type !== 'hidden') {
                return false;
            }
        }
        return true;
    },


    /* Formatting the date to a more readable format. */
    formatDate: (str) => {
        let d = new Date(str);
        let year = d.getFullYear();
        let month = ('0' + (d.getMonth() + 1)).slice(-2)
        let day = ('0' + (d.getDate())).slice(-2)
        let hour = ('0' + (d.getHours())).slice(-2)
        let minute = ('0' + (d.getMinutes())).slice(-2)
        return `${day}.${month}.${year} &nbsp; ${hour}:${minute}`
    }


};

export default Functions;