import Functions from '../Functions.js';

let UserLogin = {
    render: async() => {
        Functions.pageTitle(`Login`)
        await Functions.setInnerHTML('sidebar', '');
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
                        <label class=isTop>Name</label>
                        <input type="text" name="username" placeholder="Deinen Namen bitte" value="Admin" />
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
    await Functions.setInnerHTML('content', innerHTML);
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
        getAPIdata('login', loginForm)
            .then(data => {
                deb(data)

            })
    });
}




async function getAPIdata(URL, FormId) {
    let formData = new FormData(FormId);
    formData = JSON.stringify(Object.fromEntries(formData));
    const response = await fetch(URL, {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json();
    return data;
}


//         localStorage.setItem('TC_token', res.token);
//         localStorage.setItem('TC_staffID', res.id);
//         localStorage.setItem('TC_staffName', res.user_display_name);
//         vt.success(`Logged in as ${res.user_display_name} `);

//         // redirect to StaffData
//         window.location.hash = '#Staff-data:' + res.id;