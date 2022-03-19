import Functions from '../Functions.js';
import Form from '../Form.js';

export default {
    render: async() => {
        Functions.pageTitle(`Login`);
        await Style();
        await Content();
        await getUserData();
        await addEditFunction();
    },
};

// export default UserLogin;

/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ `
       #editArea{
           position: relative;
           widht:100%; 
       }
       #editButton{
            position: absolute;
            left: 0px;
            top: -2em;
            font-size: 14px;
            cursor:pointer;
       }
       #editButton:hover{
           color: var(--fontBlue);
       }

 
    `;
    Functions.createStyle('UserLogin_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
        <div id="T_UserLoginForm" class="template"> 
            <h2>Profile</h2> 
            <br>

            <div id=editArea>
            <span id="editButton">Edit</span>
                

                <div id=Userdata></div>
            </div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};

/**
 * It gets the user data from the API and displays it on the page.
 */
let getUserData = async() => {
    var formData = new FormData();
    // id muss noch aus der URL kommen!!!!!!!!!
    formData.append('id', Functions.getLocal('id'));

    deb(formData);
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
                        hideEdit: true,
                        label: 'Username',
                        value: user.username,
                        db: 'username/user/id/' + user.id,
                    })}

                    ${Form.inputText({
                        name: 'email',
                        type: 'text',
                        widths: '100/150/300',
                        hideEdit: true,
                        label: 'Email',
                        value: user.email,
                        db: 'email/user/id/' + user.id,
                    })}

                </div>



                        `;
            Functions.setInnerHTML('Userdata', innerHTML);
        } else {
            let innerHTML = /*HTML*/ `
                    <div id="T_UserLoginForm" class="template"> 
                    ${res.message}
                    </div>`;
            Functions.setInnerHTML('Userdata', innerHTML);
        }
    });
};

let addEditFunction = async() => {
    document.getElementById('editButton').addEventListener('click', function() {
        document.querySelectorAll('#editArea input').forEach((input) => {
            // deb(input)
            input.classList.toggle('hideEdit');

            input.addEventListener('focusout', singleEdit);
        });
    });

    function singleEdit() {
        let db = this.dataset.db.split('/');

        var formData = new FormData();
        formData.append('update', db[0]);
        formData.append('table', db[1]);
        formData.append('where', db[2]);
        formData.append('equal', db[3]);
        formData.append('value', this.value);

        Functions.getAPIdata('singleedit', formData)
            .then((res) => {
                deb(res);
                if (200 === res.code)
                    this.classList.add('successEdit')
                setTimeout(() => {
                    this.classList.remove('successEdit')

                }, 1000);
            });
    }
};