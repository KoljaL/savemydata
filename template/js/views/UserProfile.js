import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../Form.js';

export default {
    render: async(userID) => {

        Functions.pageTitle(`Login`);
        await Style();
        await Content();
        await getUserData(userID);
        await dropDownEvent();
        await addNewUser();
        await addEditFunction();
    },
};

// export default UserLogin;

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
       #newUserButton,
       #editButton{ 
            font-size: 14px;
            cursor:pointer;
            color: var(--font_0);
            background: var(--bg_3);
            line-height: 1.2em;
            outline: none;
            padding: 0.3em .3em .2em .4em;
            border: none;
            outline: var(--border_0) solid 1px;
            transition: all 0.5s ease-in-out;
            border-radius: 0.2em;
            font-size: 1em;
           margin-left: 1em;

       }
       #newUserButton:hover,
       #editButton:hover{
           color: var(--fontBlue);
       }

       #UserProfileList {
        display: inline-block;
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
            <h2>Profile</h2> 
            <div id=UserProfileList>${await UserList.render('dropdown')}</div>
            <span id="editButton">Edit</span>
            <span id="newUserButton">New</span>
            <br>
            <div id=editArea>
                <div id=Userdata></div>
            </div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};


let addNewUser = () => {
    const currentUserRole = Functions.getLocal('role');

    if (currentUserRole === '0') {

        document.getElementById('newUserButton').addEventListener('click', (button) => {
            if ('Save' === button.target.innerHTML) {
                deb('SAVE')

                let userProfilForm = document.getElementById('userProfilForm')
                userProfilForm = new FormData(userProfilForm);
                Functions.getAPIdata('newuser', userProfilForm)
                    .then((res) => {
                        deb(res)
                        if (res.code === 200) {
                            window.location.hash = '#user/profile/' + res.data.id;
                        }
                    })
            }

            if ('New' === button.target.innerHTML) {
                deb('NEW')
                document.querySelectorAll('#editArea input').forEach(el => {
                    delete el.dataset.db;
                    el.value = '';
                    el.classList.remove('hideEdit');
                    button.target.innerHTML = 'Save';
                });
            }
        })

    }
    // if not admin, delete this button
    else {
        document.getElementById('newUserButton').remove();
    }
}



let dropDownEvent = () => {
    const currentUserRole = Functions.getLocal('role');

    if (currentUserRole === '0') {
        document.getElementById('UserListSelect').addEventListener('change', (el) => {
            // deb(el.target.value)
            window.location.hash = '#user/profile/' + el.target.value;

        })
    } else {
        document.getElementById('UserProfileList').remove();
    }
}




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
                     
                <form id=userProfilForm class="FF-row">
        

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


                    ${Form.inputText({
                        name: 'role',
                        type: 'text',
                        widths: '100/150/300',
                        edit: currentUserRole === '0' ? 'hide' : 'forbidden',
                        label: 'Role',
                        value: user.role,
                        db: 'role/user/id/' + user.id,
                    })}



                    ${Form.inputText({
                        name: 'permission',
                        type: 'text',
                        widths: '100/150/300',
                        edit: currentUserRole === '0' ? 'hide' : 'forbidden',
                        label: 'Permission',
                        value: user.permission,
                        db: 'permission/user/id/' + user.id,
                    })}

                </form>



                        `;
                Functions.setInnerHTML('Userdata', innerHTML);
            }
            // return error message
            else {
                let innerHTML = /*HTML*/ `<div id="T_UserLoginForm"> ${res.message}</div>`;
                Functions.setInnerHTML('Userdata', innerHTML);
            }
        });
};

let addEditFunction = async() => {
    document.getElementById('editButton').addEventListener('click', function() {
        document.querySelectorAll('#editArea input').forEach((input) => {
            // deb(input)

            // make fields editable
            input.classList.toggle('hideEdit');

            // updata db on focusout
            input.addEventListener('focusout', function(el) {
                // update a single value in db
                Functions.singleEdit(el.target);
            });
        });
    });
};