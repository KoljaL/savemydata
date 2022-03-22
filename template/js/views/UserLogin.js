import Functions from '../Functions.js';
import Form from '../Form.js';

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
            <fieldset>
            <legend>Staff Login</legend>
            <form id="loginForm" action="" method="post" autocomplete="off">


            <!-- login -->
            ${Form.inputText({
                name: "userlogin",
                type: "text",
                // widths: "100/150/300", 
                label: "Login",
                placeholder: "Username or Email",
                value: "admin",
            })}

            <!-- password -->
            ${Form.inputText({
                name: "password",
                type: "password",
                widths: "100px/150/300em",
            
                label: "Password",
                placeholder: "secret...",
                value: "password",
            })}


                <div class="FF-row">
                <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 300px;">
                    <input id="loginSubmit"  type="submit" value="Login">
                </div>
            </div>
              


                </form>
            </fieldset>

            <div id="UserLoginFormError" class="template hide"></div>
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
                    Functions.setUsername(user.username, user.id);

                    // save userdata in localStorage
                    Functions.setLocal('username', user.username);
                    Functions.setLocal('id', user.id);
                    Functions.setLocal('role', user.role);
                    Functions.setLocal('permission', user.permission);
                    Functions.setLocal('token', res.data.token);

                    // activate logout button
                    document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
                    //  redirect to userprofile
                    window.location.hash = '#user/profile/' + user.id;

                } else {
                    document.getElementById('UserLoginFormError').innerHTML = res.message;
                }
            })
    });
}