'use strict';

// COMMON FUCTIONS
import Functions from './Functions.js';
// import Toast from './Toast.js';

// VIEWS
import Default from './views/Default.js';
import UserLogin from './views/UserLogin.js';
import UserProfile from './views/UserProfile.js';
import Form from './views/Form.js';
import Form1 from './views/Form1.js';
import Form2 from './views/Form2.js';
import Solar from './views/Solar.js';


// COMPONENTS
// import CustomerListSelect from './components/CustomerListSelect.js';
// https://gist.github.com/gre/1650294
// LOAD ROUTER
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

async function router() {
    // Functions.fadeWraper('in', '#darkWrapper', 20);
    // await fadeOut('main', 200);
    // document.querySelector('main').style.opacity = 0;
    deb("1")
    await fadeOut('main', 200)
    deb("3")


    let request = Functions.parseRequestURL();
    let page = checkUserLoggedIn() || request.page;
    // deb(request);
    switch (page) {

        case '/':
            await UserLogin.render();
            break;

        case 'userprofile':
            await UserProfile.render();
            break;

        case 'form':
            await Form.render();
            break;

        case 'form1':
            await Form1.render();
            break;

        case 'form2':
            await Form2.render();
            break;

        case 'solar':
            await Solar.render();
            break;

        default:
            await Default.render();
            break;
    }
    await fadeIn('main', 200);

    // Userlogin has its own fadeWrapper()
    if ('/' !== page) {
        // Functions.fadeWraper('out', '#darkWrapper', 20);
    }

}

async function fadeIn(el, time) {
    var count = 0;
    if (document.querySelector(el)) {


        var interval = setInterval(() => {

            document.querySelector(el).style.opacity = count;

            count = count + .1;
            if (count > 1) {
                clearInterval(interval);
            }

        }, time);


    }
}

async function fadeOut(el, time) {

    var count = 1;
    if (document.querySelector(el)) {


        var interval = setInterval(() => {
            deb("2")

            document.querySelector(el).style.opacity = count;

            count = count - .1;
            if (count < 0.01) {
                clearInterval(interval);
            }

        }, time);


    }
}


/**
 * If the user is logged in, then return false. Otherwise, return the URL to the login page
 * @returns A string.
 */
function checkUserLoggedIn() {
    if (Functions.getLocal('token')) {
        Functions.setUsername(Functions.getLocal('username'))
        document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
        return false;
    } else {
        return '/';
    }
}