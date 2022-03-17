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

// LOAD ROUTER
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

async function router() {
    Functions.fadeWraper('in', '#darkWrapper', 20);

    let request = Functions.parseRequestURL();
    let page = checkUserloggedin() || request.page;
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
    Functions.fadeWraper('out', '#darkWrapper', 20);

}




/**
 * If the user is logged in, then return false. Otherwise, return the URL to the login page
 * @returns A string.
 */
function checkUserloggedin() {
    if (Functions.getLocal('token')) {
        // await setUsername(Functions.getLocal('username'))
        // document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
        return false;
    } else {
        return '/';
    }
}