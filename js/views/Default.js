import Functions from '../Functions.js';

let Default = {
    render: async() => {

        Functions.pageTitle(`Default`)
        await Style();
        await Content();
        // await Login();
    }
};

export default Default;



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
        #DefaultWrapper {
            padding:1em;
        } 
        #DefaultWrapper li{
            padding:.5em;
            margin-left:1em;
        } 
       
    `;
    Functions.createStyle('Default_style', styleTags);
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
    <div id=DefaultWrapper>
       <h2>Save my data2</h2>
       <p>CRM on its own<br>link to repo at the bottom</p>
       <h3>works now</h3>
            <li>two themes in two colors</li>
            <li>full responsive with three states</li>
            <li>Auth via Token</li>
            <li>database init on first run</li>
            <li>create admin & user</li>
            <li>create dummy data</li>
            <li>admin can create user & customer</li>
            <li>user can only see other user</li>
            <li>user & customer profile</li>
            <li>user & customer table</li>
            <li>input text fields via component</li>
        <h3>to do</h3>
        <li>projects</li>
        <li>appointments</li>
            <li>real roles & permissions in API & frontend</li>
        
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

                } else {
                    document.getElementById('DefaultFormError').innerHTML = res.message;
                }
            })
            .then(() => {
                document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
            });
    });
}