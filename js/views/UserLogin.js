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


                <!-- login -->
                ${Form.inputText({
                    name: "userlogin",
                    type: "text",
                    widths: "100/150/200", 
                    label: "Login",
                    placeholder: "Username or Email",
                    value: "admin",
                })}

                <!-- password -->
                ${Form.inputText({
                    name: "password",
                    type: "password",
                    widths: "100/150/200",
                
                    label: "Password",
                    placeholder: "secret...",
                    value: "password",
                })}

    
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
                    Functions.setUsername(user.username, user.id);
                    deb('Userlogin')

                    // save userdata in localStorage
                    Functions.setLocal('username', user.username);
                    Functions.setLocal('id', user.id);
                    Functions.setLocal('role', user.role);
                    Functions.setLocal('permission', user.permission);
                    Functions.setLocal('token', res.data.token);
                    Functions.setLocal('lang', user.lang);

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