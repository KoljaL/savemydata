import Functions from '../Functions.js';
import Form from '../Form.js';

export default {
    render: async(userID) => {
        Functions.pageTitle(`Login`);
        await Style();
        await Content();
        await getUserData(userID);
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
       #editButton{
            // position: absolute;
            // left: 0px;
            // top: -2em;
            font-size: 14px;
            cursor:pointer;
       }
       #editButton:hover{
           color: var(--fontBlue);
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
            <span id="editButton">Edit</span>
            <br>
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
    var formData = new FormData();
    formData.append('id', userID);
    var currentUserRole = Functions.getLocal('role')
        // getAPIdata (endpoint, formID)
    Functions.getAPIdata('userprofile', formData).then((res) => {
        deb(res);
        if (res.code === 200) {
            const user = res.data;
            let innerHTML = /*HTML*/ `
                     
                <div id=insideform class="FF-row">
        

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
                        name: 'role',
                        type: 'text',
                        widths: '100/150/300',
                        edit: (currentUserRole==='0')?'hide':'forbidden',
                        label: 'Role',
                        value: user.role,
                        db: 'role/user/id/' + user.id,
                    })}



                    ${Form.inputText({
                        name: 'permission',
                        type: 'text',
                        widths: '100/150/300',
                        edit: (currentUserRole==='0')?'hide':'forbidden',
                        label: 'Permission',
                        value: user.permission,
                        db: 'permission/user/id/' + user.id,
                    })}

                </div>



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
                Functions.singleEdit(el.target)
            });
        });
    });

};