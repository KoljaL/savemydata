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
        // deb(action)
        Functions.pageTitle(`${slugName} Profile`);
        await Style();
        await Content(userID);
        if (tableName === 'staff') await changeAvatar(userID);
        await dropDownEvent(tableName);
        await deleteUserButton(userID);
        await editUserButton(userID);
        await getUserData(userID);
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
   
        #deleteUserButton:hover{
            color: var(--fontRed);
        }
        #newUserButton:hover{
            color: var(--fontGreen);
        }
        #editUserButton:hover{
            color: var(--fontBlue);
        }
        #changeAvatar,
        #UserProfileList {
            display: inline-block;
            margin-right: 1em;
        }
        #UserProfileHeader{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: start;
        }
        #UserProjects:empty,
        #UserAppointments:empty{
            // display:none;
        }
        .ActionButtons{
            margin-top: -2em;
            margin-bottom: -1.5em;
            margin-left: auto;
            width: max-content;
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
                <div style="display:flex; align-items: setAttribute;">
                    <h2 data-lang="${slugName}-Profile">Profile</h3>
                    <h2 id=profileName></h2>
                </div>
                    <div id=UserProfileList></div>
            </div>
            <div id=editArea>
                <details>
                    <summary id=openProfile><span data-lang="H_sharing">Profile data</span></summary>

                    <div class="ActionButtons">
                        <div id="changeAvatar"></div>
                        <span id="editUserButton" class="boxShadow button"></span>
                        <span id="deleteUserButton" class="boxShadow button"></span>
                    </div>

                    <div id=Userdata class=content></div>

                </details>

                <div style="display:flex;gap: 1em;margin: 1em;flex-wrap: wrap;">
                    <div id=UserProjects></div>
                    <div id=UserAppointments></div>
                    <div id=UserImages>
                        <h3 data-lang="F_images">Images</h3>
                        <div id=fileUpload></div>
                        <div id=thumbnails></div>
                        ${Images.render({origin: tableName,origin_id:userID,type:'image',name:'default'})}
                    </div>

                    <div class="CustomerSharings">
                        ${ShareItem.render({type:'Customer',shared_id: userID,})}
                    </div>
                </div>

            </div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
    if (tableName === 'staff') document.querySelector('.CustomerSharings').remove();

};


/**
 * 
 * Avatar Upload
 *  
 */
function changeAvatar(userID) {

    let innerHTML = /*HTML*/ `
        <form id="uploadAvatarForm">
            <input for=uploadAvatarForm type="hidden" name="origin" id="origin"  value="${tableName}" />
            <input for=uploadAvatarForm type="hidden" name="origin_id" id="origin_id"  value="${userID}" />
            <label class="boxShadow button" style="display: inline-block;" id=uploadAvatarLabel for="uploadAvatar">Avatar</label>
            <input for=uploadAvatarForm id="uploadAvatar" type="file" accept="image/*" capture="camera" style="display:none">
        </form>`;
    Functions.setInnerHTML('changeAvatar', innerHTML);

    // be shure to load the eventlistener only once
    if (body.getAttribute('uploadAvatar') !== 'true') {
        body.setAttribute('uploadAvatar', true)
        document.body.addEventListener('change', (el) => {
            if (el.target.id === 'uploadAvatar') {
                // event.preventDefault();
                Functions.loadingDots('fileUpload', true)
                const formData = new FormData(el.target.form);
                formData.append('avatar', tableName);
                formData.append('file', el.target.files[0]);
                // Functions.debFormData(formData);
                Functions.uploadToAPI('upload_file', formData)
                    .then((res) => {
                        deb(res.data.path);
                        if (res.code === 200) {
                            Functions.setLocal('avatarPath', res.data.path);
                            // let innerHTML = /*HTML*/ `<img src="${res.data.path}" width="150px"  style="padding:0;">`;
                            // Functions.setInnerHTML('uploadAvatarLabel', innerHTML);
                            if (Functions.getLocal('id') === userID) {
                                document.querySelector('nav .sidebar_userpanel img').src = res.data.path;
                            }
                            // addImage(res.data);
                            Functions.loadingDots('fileUpload', false)
                        } else {
                            Functions.loadingDots('fileUpload', false)
                        }
                    });
            }
        });
    }
}


/**
 * It gets the user data from the API and displays it on the page.
 */
let getUserData = async(userID) => {
    if (userID) {
        const currentUserRole = Functions.getLocal('role');

        var formFields = await Functions.getAPIdata('get_data_from/' + window.formTableName);

        Functions.getAPIdata(`get_profile/${tableName}/${userID}`)
            .then((res) => {
                // deb(res);
                if (res.code === 200) {
                    const user = res.data;
                    // deb(user)
                    // deb(formFields)
                    window.userName = user.username;
                    document.getElementById('profileName').innerHTML = userName;
                    Functions.pageTitle(`${userName}'s Profile`);

                    let shared_staff = '';
                    if (user.shared) {
                        shared_staff = `shared from ${user.shared.user_name}`;
                    }
                    if (formFields.code === 200) {
                        formFields = formFields.data;
                        deb(formFields);

                        // sort by position
                        formFields.sort((a, b) => {
                            return a.pos - b.pos;
                        });
                        //sort by row
                        formFields.sort((a, b) => {
                            return a.row - b.row;
                        });

                        // start with a form and the first row
                        var innerHTML = `<span>&nbsp; ${shared_staff}</span><br><form id=userProfilForm>`;
                        innerHTML += '<div class="FF-row">';
                        var row = 1;
                        if (Functions.getLocal('role') !== 'admin') {
                            formFields = formFields.filter(f => f.name !== 'permission');
                            formFields = formFields.filter(f => f.name !== 'role');
                        }
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
                        // copy to DOM
                        Functions.setInnerHTML('Userdata', innerHTML);
                    } else {
                        deb(formFields.message)
                    }


                    // get AppointmentsList
                    Functions.getAPIdata(`get_appointments_from/${tableName}/${userID}`)
                        .then((res) => {
                            // deb(res);
                            let app;
                            if (res.code === 200) {
                                // deb(res.data)
                                app = AppointmentsList.render(res.data, userID)
                            } else {
                                app = /*HTML*/ `
                                <div id=Projects>
                                    <h3 data-lang="H_appointments">Appointments</h3>
                                    <a href="#appointment/new/${userID}" class="button boxShadow">new Appointment</a>
                                </div>`;
                            }
                            Functions.setInnerHTML('UserAppointments', app);
                        });

                    // get ProjectsList
                    Functions.getAPIdata(`get_projects_from/${tableName}/${userID}`)
                        .then((res) => {
                            // deb(res);
                            let Projects
                            if (res.code === 200) {
                                // deb(res.data)
                                Projects = ProjectsList.render(res.data)
                            } else {
                                Projects = /*HTML*/ `
                                <div id=Projects>
                                    <h3 data-lang="H_projects">Projects</h3>
                                    <a href="#project/new/${userID}" class="button boxShadow">new Project</a>
                                </div>`;
                            }
                            Functions.setInnerHTML('UserProjects', Projects);

                        });
                } else if (res.code === 403) {
                    isAllowed = false;
                    document.getElementById('editArea').innerHTML = res.message;
                    document.getElementById('editUserButton').remove();
                    document.getElementById('deleteUserButton').remove();
                }
            })

    }
};

/**
 * It adds an event listener to the dropdown menu.
 */
let dropDownEvent = async(tableName) => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === 'admin') {
        let innerHTML = await UserList.render('dropdown', tableName);
        await Functions.setInnerHTML('UserProfileList', innerHTML)
            .then(() => {
                document.getElementById(tableName + 'ListSelect').addEventListener('change', (el) => {
                    Message.info('User Profile: ' + el.target.options[el.target.selectedIndex].text);
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
    if (Functions.getLocal('role') !== 'xxx') {
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
    if (Functions.getLocal('role') !== 'xxx') {
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