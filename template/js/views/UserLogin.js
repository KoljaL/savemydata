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
        #T_darkWrapper {
            position: absolute;
            top: var(--header_full_height);
            left: 0;
            width: 100vw;
            height:100vh;
            background: var(--bg_1);
            display:flex;
            justify-content: center;
            align-items: center;
            z-index: 5;
        }
        #T_UserLoginForm {
            position: relative;
            max-width: 300px;
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
    <div id=T_darkWrapper>
        <div id="T_UserLoginForm">
            <fieldset>
            <legend>Staff Login</legend>
            <form id="loginForm" action="" method="post" autocomplete="off">
                <div class="row">
                    <div class="u-full-width">
                        <label for="userlogin">Name or Mail</label>
                        <input class="u-full-width" type="text"  id="userlogin" name="userlogin" placeholder="Deinen Namen bitte" value="admin">
                    </div>
                </div>
                <div class="row">
                    <div class="u-full-width">
                        <label for="password">Password</label>
                        <input class="u-full-width" type="password"  id="password" name="password" placeholder="geheim..." value="password">
                    </div>
                </div>
                <input class="button-primary" id="loginSubmit"  type="submit" value="Login">
                </form>
            </fieldset>

            <div id="T_UserLoginFormError" class="template hide"></div>
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
                deb(res);
                if (res.code === 200) {
                    const user = res.data.user;
                    // document.getElementById('T_UserLoginFormError').innerHTML = /*HTML*/ `<span id=userLogout>logout</span>`;
                    document.querySelector('li[data-link="userprofile"] span.link_text').innerHTML = /*HTML*/ `
                        <span class="icon" style="background-color:transparent"><img src="uploads/avatars/${user.username}.png"></span>${user.username}
                        <span id=userLogout class="logout_icon"></span>
                        `;

                    // save userdata in localStorage
                    Functions.setLocal('username', user.username);
                    Functions.setLocal('id', user.id);
                    Functions.setLocal('role', user.role);
                    Functions.setLocal('permission', user.permission);
                    Functions.setLocal('token', res.data.token);

                    //  redirect to userprofile
                    window.location.hash = '#userprofile';
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