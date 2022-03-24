import Functions from '../Functions.js';

let UserProfileForm = {
    render: async(formtable) => {
        Functions.pageTitle(`UserProfileForm`);
        await Style();
        await Content();
        await getData(formtable);
    },
};

export default UserProfileForm;

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
        #UserProfileFormWrapper {
            padding:1em;
        } 
        #UserProfileFormWrapper li{
            padding:.5em;
            margin-left:1em;
        } 
       .formEdit input{
           width: 150px;
           margin: .25em;
       }
    `;
    Functions.createStyle('UserProfileForm_style', styleTags);
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
    <div id=UserProfileFormWrapper>
        <div id=UserProfileForm></div>
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
let getData = async(formtable) => {
    // getAPIdata (endpoint, formID)
    var dummy = new FormData();
    Functions.getAPIdata('form_profile/user_profile_form', dummy)
        .then((res) => {
            if (res.code === 200) {
                let formFields = res.data;
                deb(formFields);

                // sort by position
                formFields.sort((a, b) => {
                    return a.pos - b.pos;
                });
                //sort by row
                formFields.sort((a, b) => {
                    return a.row - b.row;
                });




                let innerHTML = '<table><tr>';
                Object.keys(formFields[0]).forEach(e => {
                    innerHTML += `<th>${e}</th>`
                })
                innerHTML += '<th>save</th></tr>'
                formFields.forEach(el => {
                    let formID = Functions.makeid(5);
                    // deb(el)
                    innerHTML += `<form id=${formID} class=formEdit><tr>`;

                    Object.entries(el).forEach(entry => {
                        const [key, value] = entry;
                        // debkey, value);
                        innerHTML += `<td><input form=${formID} type=text name="${key}" value="${value}"></td>`;
                    });

                    innerHTML += `<td><input  form=${formID}  type=submit value=save></td></tr></form>`;
                });
                innerHTML += '</table>';
                Functions.setInnerHTML('UserProfileForm', innerHTML);

            } else {

            }
        })
        .then(() => {
            document.querySelectorAll('input[type="submit"]').forEach(button => {
                button.addEventListener('click', (el) => {
                    event.preventDefault();
                    deb(el.target.form)
                    deb(formtable);
                    var dummy = new FormData(el.target.form);
                    Functions.debFormData(dummy)
                        // Functions.getAPIdata('form_profile/user_profile_form', dummy)
                        //     .then((res) => {
                        //         if (res.code === 200) {
                        //             let formFields = res.data;
                        //             deb(formFields);
                        //         }
                        //     }); //in die datenbank schrieben, komplett!


                })
            });
        });


};