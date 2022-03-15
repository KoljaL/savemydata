import Functions from '../Functions.js';

let UserLogin = {
    render: async() => {
        Functions.pageTitle(`Login`);
        await Style();
        await Content();
        await getUserData();
    },
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
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};

/*
##        #######   ######   #### ##    ##
##       ##     ## ##    ##   ##  ###   ##
##       ##     ## ##         ##  ####  ##
##       ##     ## ##   ####  ##  ## ## ##
##       ##     ## ##    ##   ##  ##  ####
##       ##     ## ##    ##   ##  ##   ###
########  #######   ######   #### ##    ##
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
                    <div id="T_UserLoginForm" class="template"> 
                    <span>Username: ${user.username}</span>
       
       
       
                    </div>`;
                Functions.setInnerHTML('main', innerHTML);
            } else {
                let innerHTML = /*HTML*/ `
                    <div id="T_UserLoginForm" class="template"> 
                    ${res.message}
                    </div>`;
                Functions.setInnerHTML('main', innerHTML);
            }
        })
};

//         localStorage.setItem('TC_token', res.token);
//         localStorage.setItem('TC_staffID', res.id);
//         localStorage.setItem('TC_staffName', res.user_display_name);
//         vt.success(`Logged in as ${res.user_display_name} `);

//         // redirect to StaffData
//         window.location.hash = '#Staff-data:' + res.id;