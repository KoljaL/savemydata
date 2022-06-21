import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../components/Form.js';
import LanguageSwitch from '../components/LanguageSwitch.js';
import Images from '../components/Images.js';
import AppointmentsList from '../components/AppointmentsList.js';
import ProjectsList from '../components/ProjectsList.js';
import ShareItem from '../components/ShareItem.js';


export default {
    render: async(userID, action) => {
        window.isAllowed = true;
        if (action === 'staff') {
            window.slugName = 'Staff';
            window.tableName = 'staff';
            window.formTableName = 'staff_fields';
        }
        if (action === 'customer') {
            window.slugName = 'Customer';
            window.tableName = 'customer';
            window.formTableName = 'customer_fields';
        }
        // deb(userID)
        Functions.pageTitle(`${slugName} Profile`);
        await Style();
        await Content();
        await newUserButton();
        await getUserData();
    },
};

/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ `
        #T_UserLoginForm h2{
            display:inline-block;
            margin-right: 1em;
            margin-top: 0;
        }
 
        #T_UserLoginForm #editArea{
            position: relative;
            top:-2em;
        }
        #newUserButton{
            position:relative;
            left:1em; 
            top:.5em; 
            padding:.5em 1em;
        }
        #newUserButton:hover{ 
            color: var(--fontGreen);
        }
        #UserProfileHeader{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: start;
        }
    `;
    Functions.createStyle('UserProfile_8284_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
        <div id="T_UserLoginForm" class="template">
            <div id=UserProfileHeader>
                <h2 data-lang="New_${slugName}-Profile">New Profile</h3>
            </div>
            <div id=editArea>
                <div id=Userdata class=content></div>
                <span id="newUserButton" class="boxShadow button">Save</span>
            </div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};


/**
 * It gets the user data from the API and displays it on the page.
 */
let getUserData = async(userID) => {
    const currentUserRole = Functions.getLocal('role');

    var formFields = await Functions.getAPIdata('get_data_from/' + window.formTableName);
    // deb(formFields)
    Functions.pageTitle(`New Profile`);


    if (formFields.code === 200) {
        formFields = formFields.data;
        // deb(formFields);

        // sort by position
        formFields.sort((a, b) => {
            return a.pos - b.pos;
        });
        //sort by row
        formFields.sort((a, b) => {
            return a.row - b.row;
        });

        // start with a form and the first row
        var innerHTML = `<br><form id=userProfilForm>`;
        innerHTML += '<div class="FF-row">';
        var row = 1;
        formFields.forEach((formField) => {
            // for the next row, close the old one and open the new row
            if (formField.row * 1 > row) {
                innerHTML += '</div>';
                innerHTML += '<div class="FF-row">';
                row++;
            }
            // create the form field
            innerHTML += Form.inputTextDB(formField, 'user');
        });
        // close last row & form 
        innerHTML += '</div>';
        innerHTML += '</form>';
        // copy to DOM
        Functions.setInnerHTML('Userdata', innerHTML);

        document.querySelectorAll('#editArea input,#editArea textarea').forEach((input) => {
            delete input.dataset.db;
            input.value = '';
            input.classList.remove('hideEdit');
        });

    } else {
        deb(formFields.message)
    }


};

/**
 * It adds a new user to the database. newUserButton
 */
let newUserButton = async() => {
    // only admin '0' can do this
    if (Functions.getLocal('role') !== 'xxx') {

        document.getElementById('newUserButton').addEventListener('click', (button) => {
            // send all inputfields to API & get directed to the new users profile
            if (document.getElementById('username').value !== '') {

                let userProfilForm = document.getElementById('userProfilForm');
                userProfilForm = new FormData(userProfilForm);
                userProfilForm.append('staff_id', Functions.getLocal('id'));
                Functions.getAPIdata('new_entry_in/' + tableName, userProfilForm).then((res) => {
                    deb(res)
                    if (res.code === 200) {
                        Message.success('New User created');
                        window.location.hash = `#${tableName}/profile/${res.data.id}`;
                    }
                });
            } else {
                Message.warn('Please enter a Username');
            }


            LanguageSwitch.render();
        }); // eventListener
    }
};