import Functions from '../Functions.js';
import Form from '../components/Form.js';

let UserLogin = {
    render: async() => {
        Functions.pageTitle(`Login`)
        await Style();
        await Content();
        await Login();
    }
};

export default UserLogin;



/*
 ######  ######## ##    ## ##       ########
##    ##    ##     ##  ##  ##       ##
##          ##      ####   ##       ##
 ######     ##       ##    ##       ######
      ##    ##       ##    ##       ##
##    ##    ##       ##    ##       ##
 ######     ##       ##    ######## ########
*/
let Style = async() => {
    let styleTags = /*CSS*/ `
        #UserLoginWrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height:100vh;
            display:flex;
            justify-content: center;
        }
        #UserLoginForm {
            position: relative;
            top: 10vh;
            max-width: 300px;
            z-index: 15;
        }
        .FF-item [type="radio"] {
            display:none;
        }
        .FF-item [type="radio"]:valid + label {
            cursor:pointer;
            font-size: 20px!important; 
        }
        .FF-item [type="radio"] + label::before {
            cursor:pointer;
            width: 15px;
            height: 15px;
            border-radius: 0px;
            border: 1px solid  black;
            background-color: transparent;
            box-shadow: 2px 2px 0 black;
            display: block;
            content: ' ';
            float: left;
            margin-right: 15px;
            z-index: 5;
            position: relative;
            top: 4px;
          }
          .FF-item [type="radio"]:checked + label::before {
            box-shadow: inset 0px 0px 0px 2px var(--font_2), 1px 1px 0 var(--bg_3);
            background-color: black;
          }
    `;
    Functions.createStyle('UserLogin_style', styleTags);
};





/*
 ######   #######  ##    ## ######## ######## ##    ## ########
##    ## ##     ## ###   ##    ##    ##       ###   ##    ##
##       ##     ## ####  ##    ##    ##       ####  ##    ##
##       ##     ## ## ## ##    ##    ######   ## ## ##    ##
##       ##     ## ##  ####    ##    ##       ##  ####    ##
##    ## ##     ## ##   ###    ##    ##       ##   ###    ##
 ######   #######  ##    ##    ##    ######## ##    ##    ##
*/
/**
 * This function is used to render the content of the page
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
    <div id=UserLoginWrapper>
        <div id="UserLoginForm">
        <div class="FF-row">
            <form id="loginForm" action="" method="post" autocomplete="off">


                <!-- TESTING -->
                <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:200px;">
                    <input type="radio" id="Admin" name="userlogin" value="Admin">
                    <label for="Admin">Admin</label>
                </div>
                <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:200px;">
                    <input type="radio" id="Manager" name="userlogin" value="Manager">
                    <label for="Manager">Manager</label>
                </div>
                <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:200px;">
                    <input type="radio" id="Staff 0" name="userlogin" value="Staff 0">
                    <label for="Staff 0">Staff 0</label>
                </div>
                <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:200px;">
                    <input type="radio" id="Staff 1" name="userlogin" value="Staff 1">
                    <label for="Staff 1">Staff 1</label>
                </div>
                <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:200px;">
                    <input type="radio" id="Staff 2" name="userlogin" value="Staff 2">
                    <label for="Staff 2">Staff 2</label>
                </div>
                <input id="password" name="password" type="hidden" value="password" >
                <!-- TESTING -->


                <!-- login 
                ${Form.inputText({name: "userlogin",type: "text",widths: "100/150/200", label: "Login",placeholder: "Username or Email",value: "Admin",})}
                ${Form.inputText({name: "password",type: "password",widths: "100/150/200",label: "Password",placeholder: "secret...",value: "password",})}
                -->

                    <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 200px;">
                        <input id="loginSubmit"  type="submit" value="Login">
                    </div>
                </div>
           
            </form>

            <div id="UserLoginFormError" class="template hide"></div>
            </div>
            </div>
    </div>`;
    await Functions.setInnerHTML('main', innerHTML);
}


/*
##        #######   ######   #### ##    ##
##       ##     ## ##    ##   ##  ###   ##
##       ##     ## ##         ##  ####  ##
##       ##     ## ##   ####  ##  ## ## ##
##       ##     ## ##    ##   ##  ##  ####
##       ##     ## ##    ##   ##  ##   ###
########  #######   ######   #### ##    ##
*/
let Login = async() => {
    document.getElementById('loginSubmit').addEventListener('click', async function(event) {
        event.preventDefault();
        // getAPIdata (endpoint, formID)
        Functions.getAPIdata('login', loginForm)
            .then((res) => {
                // deb(res);
                if (res.code === 200) {
                    const user = res.data.user;
                    document.getElementById('body').classList.remove('visible');

                    // add username & avatar to sidebar
                    Functions.setUsername(user.username, user.id, user.avatar);
                    deb(user.avatar)

                    // save userdata in localStorage
                    Functions.setLocal('username', user.username);
                    Functions.setLocal('id', user.id);
                    Functions.setLocal('role', user.role);
                    Functions.setLocal('permission', user.permission);
                    Functions.setLocal('token', res.data.token);
                    Functions.setLocal('lang', user.lang);
                    Functions.setLocal('avatarPath', user.avatar);

                    // activate logout button
                    document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
                    //  redirect to user profile
                    window.location.hash = '#staff/profile/' + user.id;
                    // window.location.hash = '';

                } else {
                    document.getElementById('UserLoginFormError').innerHTML = res.message;
                }
            })
    });
}