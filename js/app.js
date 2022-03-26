'use strict';

// COMMON FUCTIONS
import ("./components/ModalMessage.js");
import Functions from './Functions.js';


// VIEWS
import Default from './views/Default.js';
import UserLogin from './views/UserLogin.js';
import UserTable from './views/UserTable.js';
import UserBetterTable from './views/UserBetterTable.js';
import UserProfile from './views/UserProfile.js';
import CustomerTable from './views/CustomerTable.js';
import UserProfileForm from './views/UserProfileForm.js';


// dummy
import Form from './views/dummy/Form.js';
import Form1 from './views/dummy/Form1.js';
import Form2 from './views/dummy/Form2.js';
import Solar from './views/dummy/Solar.js';


// COMPONENTS
// import CustomerListSelect from './components/CustomerListSelect.js';
// https://gist.github.com/gre/1650294
// LOAD ROUTER
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

async function router() {

    let request = Functions.parseRequestURL();
    let page = checkUserLoggedIn() || request.page;
    // deb(request);

    // remove the opycity class, wait, call async switch :-)
    document.getElementById('main').classList.remove('visible');
    await Functions.sleep(200);
    (async() => {

        switch (page) {

            case '/':
                await UserLogin.render();
                break;

            case 'user':
                switch (request.key) {
                    case 'profile':
                        await UserProfile.render(request.value, 'user')
                        break;
                    case 'table':
                        await UserBetterTable.render()
                        break;
                    default:
                        await UserTable.render()
                        break;
                }
                break;

            case 'formeditor':
                switch (request.key) {
                    case 'user_profile_form':
                        await UserProfileForm.render(request.key)
                        break;
                    case 'customer_profile_form':
                        await UserProfileForm.render(request.key)
                        break;

                        // default:
                        //     await UserTable.render()
                        //     break;
                }
                break;

            case 'customer':
                switch (request.key) {
                    case 'profile':
                        await UserProfile.render(request.value, 'customer')
                        break;
                    case 'table':
                        await CustomerTable.render()
                        break;
                    default:
                        await CustomerTable.render()
                        break;
                }
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

    })()
    // when content is loaded, turn bach the opacity :-)
    .then(() => {
        document.getElementById('main').classList.add('visible');
    })






}



/**
 * If the user is logged in, then return false. Otherwise, return the URL to the login page
 * @returns A string.
 */
function checkUserLoggedIn() {
    // if there is a token in localStorage, we aim that the user ist valid
    if (Functions.getLocal('token')) {
        // set name and avatar in sidebar
        Functions.setUsername(Functions.getLocal('username'), Functions.getLocal('id'));
        // remove the darkWrapper from body
        document.getElementById('body').classList.remove('darkWrapper');
        // set logout Button
        document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
        return false;
    } else {
        return '/';
    }
}