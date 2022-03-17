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
            // align-items: center;
        }
        #UserLoginForm {
            position: relative;
            top: 10vh;
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


                <div class="FF-row">
                    <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 300px;">
                        <input id="userlogin" name="userlogin" type="text" placeholder="Username or Email" value="admin" required="">
                        <label for="userlogin">Login</label>    
                    </div>
                </div>
                <div class="FF-row">
                    <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 300px;">
                        <input id="password" name="password" type="password" placeholder="secret..." value="password" required="">
                        <label for="password">Password</label>    
                    </div>
                </div>

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

                    Functions.setUsername(user.username);
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