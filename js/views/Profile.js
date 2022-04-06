import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../components/Form.js';
import LanguageSwitch from '../components/LanguageSwitch.js';
import Images from '../components/Images.js';
import AppointmentsList from '../components/AppointmentsList.js';
import ProjectsList from '../components/ProjectsList.js';


export default {
    render: async(userID, action) => {
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
        // deb(action)
        Functions.pageTitle(`${slugName} Profile`);
        await Style();
        await Content(userID);
        getUserData(userID);
        dropDownEvent(tableName);
        await newUserButton();
        deleteUserButton(userID);
        editUserButton(userID);
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
            transition: all 0.5s ease-in-out;
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
    Functions.createStyle('UserProfile_8284_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async(userID) => {
    let innerHTML = /*HTML*/ `
        <div id="T_UserLoginForm" class="template"> 
            <div id=UserProfileHeader> 
                <h2 data-lang="${slugName}-Profile">Profile</h2> 
                <div class="ActionButtons">
                    <div id=UserProfileList></div>
                    <span id="editUserButton" class=boxShadow></span>
                    <span id="newUserButton" class=boxShadow></span>
                    <span id="deleteUserButton" class=boxShadow></span>
                </div>
            </div>
           
            <div id=editArea>
                <div id=Userdata></div>
                <div style="display:flex;gap: 1em;">
                    <div id=UserProjects></div>
                    <div id=UserAppointments></div>
                </div>
                <div id=ProjectImages>
                    <h3 data-lang="F_images">Images</h3>
                    <div id=thumbnails></div>
                    <div id=fileUpload></div>
                    ${Images.render({origin: 'customer',origin_id:userID})}
                </div>
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

        Functions.getAPIdata(`get_data_from/${tableName}/${userID}`)
            .then((res) => {
                // deb(res);
                if (res.code === 200) {
                    const user = res.data[0];
                    window.userName = user.username;

                    Functions.pageTitle(`${userName}'s Profile`);


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

                    // get AppointmentsList
                    Functions.getAPIdata(`get_appointments_from/${tableName}/${userID}`)
                        .then((res) => {
                            // deb(res);
                            if (res.code === 200) {
                                // deb(res.data)
                                let app = AppointmentsList.render(res.data)
                                Functions.setInnerHTML('UserAppointments', app);

                            }
                        });

                    // get ProjectsList
                    Functions.getAPIdata(`get_projects_from/${tableName}/${userID}`)
                        .then((res) => {
                            // deb(res);
                            if (res.code === 200) {
                                // deb(res.data)
                                let app = ProjectsList.render(res.data)
                                Functions.setInnerHTML('UserProjects', app);

                            }
                        });
                }
                // return error message
                else {
                    let innerHTML = /*HTML*/ `<div id="T_UserLoginForm"> ${res.message}</div>`;
                    Functions.setInnerHTML('Userdata', innerHTML);
                }
            })

    }
};

/**
 * It adds an event listener to the dropdown menu.
 */
let dropDownEvent = async(tableName) => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === '0') {
        let innerHTML = await UserList.render('dropdown', tableName);
        await Functions.setInnerHTML('UserProfileList', innerHTML)
            .then(() => {
                document.getElementById(tableName + 'ListSelect').addEventListener('change', (el) => {
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
            document.getElementById('editUserButton').dataset.lang = 'edit'

            document.getElementById('editUserButton').addEventListener('click', function() {
                document.querySelectorAll('#editArea input,#editArea textarea, #editArea .thumbnailWrapper').forEach((input) => {
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
        document.getElementById('deleteUserButton').dataset.lang = 'delete'

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
        document.getElementById('newUserButton').dataset.lang = 'new'
        document.getElementById('newUserButton').dataset.action = 'new'

        document.getElementById('newUserButton').addEventListener('click', (button) => {
            // send all inputfields to API & get directed to the new users profile
            if ('save' === button.target.dataset.action) {
                let userProfilForm = document.getElementById('userProfilForm');
                userProfilForm = new FormData(userProfilForm);
                userProfilForm.append('table', tableName);
                Functions.getAPIdata('newuser', userProfilForm).then((res) => {
                    // deb(res)
                    if (res.code === 200) {
                        Message.success('New User created')
                        window.location.hash = `#${tableName}/profile/${res.data.id}`;
                    }
                });
            } // save

            // delete all form values, make them editable & remove the data-db for singeedit
            if ('new' === button.target.dataset.action) {
                document.getElementById('editUserButton').remove();
                document.getElementById('deleteUserButton').remove();
                document.querySelectorAll('#editArea input,#editArea textarea').forEach((input) => {
                    delete input.dataset.db;
                    input.value = '';
                    input.classList.remove('hideEdit');
                    button.target.innerHTML = 'Save';
                    document.getElementById('newUserButton').dataset.lang = 'save'
                    document.getElementById('newUserButton').dataset.action = 'save'

                });
            } //new
            LanguageSwitch.render();
        }); // eventListener
    }
};