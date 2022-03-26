import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../Form.js';

export default {
    render: async(userID, action) => {
        if (action === 'user') {
            window.slugName = 'User';
            window.tableName = 'user';
            window.formTableName = 'user_profile_form';
        }
        if (action === 'customer') {
            window.slugName = 'Customer';
            window.tableName = 'customer';
            window.formTableName = 'customer_profile_form';
        }

        Functions.pageTitle(`${slugName} Profile`);
        await Style();
        await Content();
        await getUserData(userID);
        await dropDownEvent(tableName);
        await newUserButton();
        await editUserButton(userID);
        await deleteUserButton(userID);
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
        }
        #editArea{
            position: relative;
            widht:100%; 
        }
        #deleteUserButton:empty,
        #newUserButton:empty,
        #editUserButton:empty{
            border: none;
            outline: none;
            background: transparent;
        }
        #deleteUserButton,
        #newUserButton,
        #editUserButton{ 
            font-size: 14px;
            cursor:pointer;
            color: var(--font_0);
            background: var(--bg_3);
            line-height: 1.2em;
            padding: 0.3em .3em .2em .4em;
            outline: var(--border_0) solid 1px;
            transition: all 0.5s ease-in-out;
            border-radius: 0.2em;
            font-size: 1em;
            margin-left: 1em;
        }
        #deleteUserButton:hover{
            color: var(--fontRed);
        }
        #newUserButton:hover{
            color: var(--fontGreen);
        }
        #editUserButton:hover{
            color: var(--fontBlue);
        }

        #UserProfileList {
            display: inline-block;
        }
        #UserProfileHeader{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: start;
        }
        .ActionButtons{
            margin-bottom: 1.5em;
        }
 
    `;
    Functions.createStyle('UserProfile_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
        <div id="T_UserLoginForm" class="template"> 
            <div id=UserProfileHeader>
                <h2>UserProfile</h2> 
                <div class="ActionButtons">
                    <div id=UserProfileList></div>
                    <span id="editUserButton"></span>
                    <span id="newUserButton"></span>
                    <span id="deleteUserButton"></span>
                </div>
            </div>
            <div id=editArea>
                <div id=Userdata></div>
            </div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};

/**
 * It gets the user data from the API and displays it on the page.
 */
let getUserData = async(userID) => {
    if (userID) {

        const currentUserRole = Functions.getLocal('role');

        var formFields = await Functions.getAPIdata('get_data_from/' + window.formTableName);

        // var formData = new FormData();
        // formData.append('id', userID);
        // formData.append('table', 'user');
        // getAPIdata (endpoint, formID)
        Functions.getAPIdata(`get_data_from/${tableName}/${userID}`).then((res) => {
            // deb(res);
            if (res.code === 200) {
                const user = res.data[0];
                window.userName = user.username;

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
                    var innerHTML = '<form id=userProfilForm>';
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
                        innerHTML += Form.inputTextDB(formField, user);

                    });
                    // close last row & form 
                    innerHTML += '</div>';
                    innerHTML += '</form>';

                }


                // copy to DOM
                Functions.setInnerHTML('Userdata', innerHTML);
            }
            // return error message
            else {
                let innerHTML = /*HTML*/ `<div id="T_UserLoginForm"> ${res.message}</div>`;
                Functions.setInnerHTML('Userdata', innerHTML);
            }
        });
    }
};

/**
 * It adds an event listener to the dropdown menu.
 */
let dropDownEvent = async(tableName) => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === '0') {
        let innerHTML = await UserList.render('dropdown', tableName);
        await Functions.setInnerHTML('UserProfileList', innerHTML).then(() => {
            document.getElementById('UserListSelect').addEventListener('change', (el) => {
                Message.info('User Profile: ' + el.target.options[el.target.selectedIndex].text);
                // Message.success()
                // Message.error()
                // Message.warn()
                window.location.hash = '#' + tableName + '/profile/' + el.target.value;
            });
        });
    }
};

/**
 * It makes the edit button clickable and makes the fields editable.
 */
let editUserButton = async(userID) => {
    // only admin '0' can do this, or youser himselfs
    if (Functions.getLocal('role') === '0' || Functions.getLocal('id') === userID) {
        await Functions.setInnerHTML('editUserButton', 'Edit').then(() => {
            document.getElementById('editUserButton').addEventListener('click', function() {
                document.querySelectorAll('#editArea input,#editArea textarea').forEach((input) => {
                    // make fields editable
                    input.classList.toggle('hideEdit');
                    // updata db on focusout
                    input.addEventListener('focusout', function(el) {
                        // update a single value in db
                        Functions.singleEdit(el.target);
                    });
                });
            });
        });
    }
};

let deleteUserButton = (userID) => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === '0') {
        // set text, make the button visible
        Functions.setInnerHTML('deleteUserButton', 'Delete');

        document.getElementById('deleteUserButton').addEventListener('click', function() {
            var userDeleteForm = new FormData();

            Functions.getAPIdata(`delete_entry_in/${tableName}/${userID}`).then((res) => {
                deb(res);
                if (res.code === 200) {
                    Message.warn('Deleted User: ' + window.userName);
                    window.location.hash = '#user/table/';
                }
            });
        });
    }
    // if not admin, delete this button
    else {
        document.getElementById('deleteUserButton').remove();
    }
};

/**
 * It adds a new user to the database. newUserButton
 */
let newUserButton = async() => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === '0') {
        // set text, make the button visible
        Functions.setInnerHTML('newUserButton', 'New');

        document.getElementById('newUserButton').addEventListener('click', (button) => {
            // send all inputfields to API & get directed to the new users profile
            if ('Save' === button.target.innerHTML) {
                let userProfilForm = document.getElementById('userProfilForm');
                userProfilForm = new FormData(userProfilForm);
                userProfilForm.append('table', tableName);
                Functions.getAPIdata('newuser', userProfilForm).then((res) => {
                    // deb(res)
                    if (res.code === 200) {
                        window.location.hash = `#${tableName}/profile/${res.data.id}`;
                    }
                });
            } // save

            // delete all form values, make them editable & remove the data-db for singeedit
            if ('New' === button.target.innerHTML) {
                document.getElementById('editUserButton').remove();
                document.getElementById('deleteUserButton').remove();
                document.querySelectorAll('#editArea input,#editArea textarea').forEach((input) => {
                    delete input.dataset.db;
                    input.value = '';
                    input.classList.remove('hideEdit');
                    button.target.innerHTML = 'Save';
                });
            } //new
        });
    }
};