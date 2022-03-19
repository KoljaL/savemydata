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
           right: 0px;
           top: -2em;
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
    formData.append('id', Functions.getLocal('id'));
    formData.append('token', Functions.getLocal('token'));


    // getAPIdata (endpoint, formID)
    Functions.getAPIdata('userprofile', formData)
        .then((res) => {
            deb(res);
            if (res.code === 200) {
                const user = res.data;
                let innerHTML = /*HTML*/ `
                     
                <div id=insideform class="FF-row">
        

                    ${Form.inputText({
                        name: "Username",
                        type: "text",
                        widths: "100/150/300", 
                        hideEdit: true,
                        label: "Username",
                        value: user.username,
                    })}

                    ${Form.inputText({
                        name: "Email",
                        type: "text",
                        widths: "100/150/300", 
                        hideEdit: true,
                        label: "Email",
                        value: user.email,
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
        })


};

let addEditFunction = async() => {

    document.getElementById('editButton').addEventListener('click', function() {
        document.querySelectorAll('#editArea input').forEach(el => {
            deb(el)
            el.classList.toggle('hideEdit')
        });

    })
}