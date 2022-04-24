'use strict';

// COMMON FUCTIONS
import ("./components/ModalMessage.js");
// import ("./components/Accordion.js");
import Functions from './Functions.js';


// VIEWS
import Default from './views/Default.js';
import Feedback from './views/Feedback.js';
// import Login from './views/Login.js';
import Table from './views/Table.js';
import Appointment from './views/Appointment.js';
import Calendar from './views/Calendar.js';
import Profile from './views/Profile.js';
import Project from './views/Project.js';
import ProfileForm from './views/ProfileForm.js';
import LanguageSwitch from './components/LanguageSwitch.js';
import Accordion from './components/Accordion.js';


let role = Functions.getLocal('role');
// deb(role)
if (role !== 'admin' && role !== 'manager') {
    // document.getElementById('staffItem').remove();
    // document.getElementById('customerProfileElements').remove();
}
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
    Functions.loadingDots('body', true)
    document.getElementById('main').classList.remove('visible');
    await Functions.sleep(200);
    // remove calendar sidebar 
    await Functions.setInnerHTML('calendarSidebar', '');
    await asyncSwitch(API_page);
    // (async() => {
    async function asyncSwitch(API_page) {
        switch (API_page) {

            case '/':
                location.href = './login';
                // await Login.render();
                break;

            case 'staff':
                switch (API_key) {
                    case 'profile':
                        await Profile.render(API_value, API_page);
                        break;
                    case 'table':
                        await Table.render(API_page);
                        break;
                    default:
                        await Table.render();
                        break;
                }
                break;

            case 'formeditor':
                switch (API_key) {
                    case 'staff_fields':
                        await ProfileForm.render(API_key);
                        break;
                    case 'customer_fields':
                        await ProfileForm.render(API_key);
                        break;

                        // default:
                        //     await Table.render()
                        //     break;
                }
                break;

            case 'customer':
                switch (API_key) {
                    case 'profile':
                        await Profile.render(API_value, API_page);
                        break;
                    case 'table':
                        await Table.render(API_page);
                        break;
                }
                break;

            case 'project':
                switch (API_key) {
                    case 'id':
                        await Project.render(API_value);
                        break;
                    case 'table':
                        await Table.render(API_page);
                        break;
                }
                break;

            case 'appointment':
                switch (API_key) {
                    case 'id':
                        await Appointment.render(API_value);
                        break;
                    case 'table':
                        await Table.render(API_page);
                        break;
                }
                break;


            case 'calendar':
                await Calendar.render(API_key, API_value);
                break;


            case 'feedback':
                await Feedback.render();
                break;


            default:
                await Default.render();
                break;
        }

    }
    // })()
    // when content is loaded, turn bach the opacity :-)
    await Functions.sleep(400)
        .then(() => {

            document.getElementById('main').classList.add('visible');
            Functions.loadingDots('body', false);
            LanguageSwitch.render();
        })
        .then(() => {
            setTimeout(() => {
                document.querySelectorAll('details').forEach((el) => {
                    new Accordion(el);
                });
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
        Functions.setUsername(Functions.getLocal('username'), Functions.getLocal('id'), Functions.getLocal('avatarPath'));
        // remove the darkWrapper from body
        document.getElementById('body').classList.remove('darkWrapper');
        // set logout Button
        document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
        return false;
    } else {
        return '/';
    }
}