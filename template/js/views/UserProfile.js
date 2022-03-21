import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../Form.js';

export default {
    render: async(userID) => {
        Functions.pageTitle(`User Profile`);

        await Style();
        await Content();
        await getUserData(userID);
        await dropDownEvent();
        await newUserButton();
        await editUserButton(userID);
        await deleteUserButton();
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

{ /* <div id=UserProfileList>${await UserList.render('dropdown')}</div> */ }



/**
 * It gets the user data from the API and displays it on the page.
 */
let getUserData = async(userID) => {

    const currentUserRole = Functions.getLocal('role');

    var formData = new FormData();
    formData.append('id', userID);
    // getAPIdata (endpoint, formID)
    Functions.getAPIdata('userprofile', formData)
        .then((res) => {
            // deb(res);
            if (res.code === 200) {
                const user = res.data;
                let innerHTML = /*HTML*/ `
                     
                <form id=userProfilForm >
                
                <div class="FF-row">

                    ${Form.inputText({
                        name: 'username',
                        type: 'text',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Username',
                        value: user.username,
                        db: 'username/user/id/' + user.id,
                    })}

                    ${Form.inputText({
                        name: 'firstname',
                        type: 'text',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Firstname',
                        value: user.firstname,
                        db: 'firstname/user/id/' + user.id,
                    })}


                    ${Form.inputText({
                        name: 'lastname',
                        type: 'text',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Lastname',
                        value: user.lastname,
                        db: 'lastname/user/id/' + user.id,
                    })}


                    ${Form.inputText({
                        name: 'email',
                        type: 'text',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Email',
                        value: user.email,
                        db: 'email/user/id/' + user.id,
                    })}

                    ${Form.inputText({
                        name: 'password',
                        type: 'password',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Password',
                        value: 'xxx',
                        db: 'password/user/id/' + user.id,
                    })}

                </div>
              
                <div class="FF-row">

                    ${Form.inputText({
                        name: 'comment',
                        type: 'textarea',
                        widths: '300/400/500',
                        edit: currentUserRole === '0' ? 'hide' : 'forbidden',
                        label: 'Comment',
                        value: user.comment,
                        db: 'comment/user/id/' + user.id,
                    })}

                    </div>
                    <div class="FF-row">

                    ${Form.inputText({
                        name: 'role',
                        type: 'text',
                        widths: '50/50/50',
                        edit: currentUserRole === '0' ? 'hide' : 'forbidden',
                        label: 'Role',
                        value: user.role,
                        db: 'role/user/id/' + user.id,
                    })}

                    ${Form.inputText({
                        name: 'permission',
                        type: 'text',
                        widths: '100/100/100',
                        edit: currentUserRole === '0' ? 'hide' : 'forbidden',
                        label: 'Permission',
                        value: user.permission,
                        db: 'permission/user/id/' + user.id,
                    })}
            </div>
                </form>`;

                // copy to DOM
                Functions.setInnerHTML('Userdata', innerHTML);
            }
            // return error message
            else {
                let innerHTML = /*HTML*/ `<div id="T_UserLoginForm"> ${res.message}</div>`;
                Functions.setInnerHTML('Userdata', innerHTML);
            }
        });
};




/**
 * It adds an event listener to the dropdown menu.
 */
let dropDownEvent = async() => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === '0') {
        let innerHTML = await UserList.render('dropdown')
        await Functions.setInnerHTML('UserProfileList', innerHTML)
            .then(() => {

                document.getElementById('UserListSelect').addEventListener('change', (el) => {
                    Message.info("User Profile: " + el.target.options[el.target.selectedIndex].text);
                    // Message.success()
                    // Message.error()
                    // Message.warn()
                    window.location.hash = '#user/profile/' + el.target.value;
                })
            })
    }
}





/**
 * It makes the edit button clickable and makes the fields editable.
 */
let editUserButton = async(userID) => {

    // only admin '0' can do this
    if (Functions.getLocal('role') === '0' || Functions.getLocal('id') === userID) {
        await Functions.setInnerHTML('editUserButton', 'Edit')
            .then(() => {

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

            })
    }

};


let deleteUserButton = () => {
    if (Functions.getLocal('role') === '0') {
        Functions.setInnerHTML('deleteUserButton', 'Delete')

        document.getElementById('deleteUserButton').addEventListener('click', function() {


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
        Functions.setInnerHTML('newUserButton', 'New')

        document.getElementById('newUserButton').addEventListener('click', (button) => {

            // send all inputfields to API & get directed to the new users profile
            if ('Save' === button.target.innerHTML) {
                let userProfilForm = document.getElementById('userProfilForm')
                userProfilForm = new FormData(userProfilForm);
                Functions.getAPIdata('newuser', userProfilForm)
                    .then((res) => {
                        deb(res)
                        if (res.code === 200) {
                            window.location.hash = '#user/profile/' + res.data.id;
                        }
                    })
            } // save

            // delete all form values, make them editable & remove the data-db for singeedit
            if ('New' === button.target.innerHTML) {
                document.getElementById('editUserButton').remove();
                document.getElementById('deleteUserButton').remove();
                document.querySelectorAll('#editArea input,#editArea textarea').forEach(el => {
                    delete el.dataset.db;
                    el.value = '';
                    el.classList.remove('hideEdit');
                    button.target.innerHTML = 'Save';
                });
            } //new

        })
    }
}