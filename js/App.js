'use strict';

// COMMON FUCTIONS
import ("./components/ModalMessage.js");
import Functions from './Functions.js';


// VIEWS
import Default from './views/Default.js';
import UserLogin from './views/UserLogin.js';
import UserTable from './views/UserTable.js';
import UserProfile from './views/UserProfile.js';
import UserProfileForm from './views/UserProfileForm.js';
import LanguageSwitch from './components/LanguageSwitch.js';


// dummy
import Form from './views/dummy/Form.js';
import Form1 from './views/dummy/Form1.js';
import Form2 from './views/dummy/Form2.js';
import Solar from './views/dummy/Solar.js';

// LanguageSwitch.render();
// COMPONENTS
// import CustomerListSelect from './components/CustomerListSelect.js';
// https://gist.github.com/gre/1650294
// LOAD ROUTER
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

async function router() {

    let request = Functions.parseRequestURL();
    const API_page = checkUserLoggedIn() || request.page;
    const API_key = request.key || '';
    const API_value = request.value || '';
    // deb(request);

    // remove the opycity class, wait, call async switch :-)
    document.getElementById('main').classList.remove('visible');
    await Functions.sleep(200);
    (async() => {

        switch (API_page) {

            case '/':
                await UserLogin.render();
                break;

            case 'staff':
                switch (API_key) {
                    case 'profile':
                        await UserProfile.render(API_value, 'staff')
                        break;
                    case 'table':
                        await UserTable.render(API_page)
                        break;
                    default:
                        await UserTable.render()
                        break;
                }
                break;

            case 'formeditor':
                switch (API_key) {
                    case 'staff_fields':
                        await UserProfileForm.render(API_key)
                        break;
                    case 'customer_fields':
                        await UserProfileForm.render(API_key)
                        break;

                        // default:
                        //     await UserTable.render()
                        //     break;
                }
                break;

            case 'customer':
                switch (API_key) {
                    case 'profile':
                        await UserProfile.render(API_value, 'customer')
                        break;
                    case 'table':
                        await UserTable.render(API_page)
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
    await Functions.sleep(300)
        .then(() => {
            LanguageSwitch.render();
            document.getElementById('main').classList.add('visible');
        }).then(() => {
            setTimeout(() => {
                LanguageSwitch.render();
            }, 500);
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