import Functions from '../Functions.js';

let UserLogin = {
    render: async() => {

        /* Used to redirect to the userprofile page if the user is logged in. */
        // if (Functions.getLocal('token')) {
        //     await setUsername(Functions.getLocal('username'))
        //     document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
        //     window.location.hash = '#userprofile';
        // } else {
        // }
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
            top: var(--header_full_height);
            left: 0;
            width: 100vw;
            height:100vh;
            display:flex;
            justify-content: center;
            align-items: center;
        }
        #UserLoginForm {
            position: relative;
            max-width: 300px;
            z-index: 10;
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
                    // document.getElementById('UserLoginFormError').innerHTML = /*HTML*/ `<span id=userLogout>logout</span>`;
                    // document.querySelector('li[data-link="userprofile"] span.link_text').innerHTML = /*HTML*/ `
                    //     <span class="icon" style="background-color:transparent"><img src="uploads/avatars/${user.username}.png"></span>${user.username}
                    //     <span id=userLogout class="logout_icon"></span>
                    //     `;
                    setUsername(user.username);
                    // save userdata in localStorage
                    Functions.setLocal('username', user.username);
                    Functions.setLocal('id', user.id);
                    Functions.setLocal('role', user.role);
                    Functions.setLocal('permission', user.permission);
                    Functions.setLocal('token', res.data.token);
                    Functions.fadeWraper('out', '#darkWrapper', 20);

                    //  redirect to userprofile
                    window.location.hash = '#userprofile';
                } else {
                    document.getElementById('UserLoginFormError').innerHTML = res.message;
                }
            })
            .then(() => {
                document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
            });
    });
}



async function setUsername(username) {
    document.querySelector('li[data-link="userprofile"] span.link_text').innerHTML = /*HTML*/ `
    <span class="icon" style="background-color:transparent">
        <img src="uploads/avatars/${username}.png"></span>
        ${username}
    <span id=userLogout class="logout_icon"></span>
    `;
}