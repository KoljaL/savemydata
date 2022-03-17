'use strict';

// COMMON FUCTIONS
import Functions from './Functions.js';
// import Toast from './Toast.js';

// VIEWS
import UserLogin from './views/UserLogin.js';
import UserProfile from './views/UserProfile.js';


// COMPONENTS
// import CustomerListSelect from './components/CustomerListSelect.js';

// LOAD ROUTER
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

async function router() {
    let request = Functions.parseRequestURL();
    // deb(request);
    switch (request.page) {
        case '/':
            await UserLogin.render();
            break;
        case 'userprofile':
            await UserProfile.render();
            break;

        default:
            // await UserLogin.render();
            break;
    }
}