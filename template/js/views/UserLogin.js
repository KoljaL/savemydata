import Functions from '../Functions.js';

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
        #T_StaffPreferences {
            float: right;
        }
        #T_UserLoginForm {
            position: relative;
            width: 300px;
        }
        #StaffLogOut {
            color: darkred;
            padding: 0 4em 0 1em;
            cursor: pointer;
        }
        .loginError {
            width: 600px;
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
        <div id="T_UserLoginForm" class="template">
            <fieldset>
                <legend>Staff Login</legend>
                <form id="loginForm" action="" method="post" autocomplete="off">
                    <div class="InputElement">
                        <label class=isTop>Name or Mail</label>
                        <input type="text" name="userlogin" placeholder="Deinen Namen bitte" value="admin" />
                    </div>
                    <div class="InputElement">
                        <label class=isTop>Password</label>
                        <input type="password" name="password" placeholder="geheim..." value="password" />
                    </div>
                    <button id="loginSubmit" class="button">Login</button>
                </form>
            </fieldset>
            <div id="T_UserLoginFormError" class="template hide"></div>
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
                deb(res);
                if (res.code === 200) {
                    const user = res.data.user;
                    document.getElementById('T_UserLoginFormError').innerHTML = /*HTML*/ `<span id=userLogout>logout</span>`;
                    document.getElementById('staffName').innerHTML = user.username;
                    document.getElementById('staffAvatar').style.backgroundColor = 'transparent';
                    document.getElementById('staffAvatar').classList.remove('user_icon');
                    document.getElementById('staffAvatar').innerHTML = /*HTML*/ `<img src="uploads/avatars/${user.username}.png">`;
                    // save userdata in localStorage
                    Functions.setLocal('username', user.username);
                    Functions.setLocal('id', user.id);
                    Functions.setLocal('role', user.role);
                    Functions.setLocal('permission', user.permission);
                    Functions.setLocal('token', res.data.token);
                } else {
                    document.getElementById('T_UserLoginFormError').innerHTML = res.message;
                }
            })
            .then(() => {
                document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
            });
    });
}







//         localStorage.setItem('TC_token', res.token);
//         localStorage.setItem('TC_staffID', res.id);
//         localStorage.setItem('TC_staffName', res.user_display_name);
//         vt.success(`Logged in as ${res.user_display_name} `);

//         // redirect to StaffData
//         window.location.hash = '#Staff-data:' + res.id;