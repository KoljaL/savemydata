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
    Functions.getAPIdata('get_data_from/user_profile_form')
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

                // create table
                let innerHTML = '<h2>edit entry</h2>';
                innerHTML += '<table id=editEntry><tr>';
                Object.keys(formFields[0]).forEach(key => {
                    if ('date' == key) return
                    innerHTML += `<th>${key}</th>`
                })
                innerHTML += '</tr>'
                formFields.forEach(el => {
                    // deb(el)
                    innerHTML += `<tr>`;
                    let inputID;
                    Object.entries(el).forEach(entry => {
                        const [key, value] = entry;
                        // dont show the date
                        if ('date' == key) return
                            // id is not editable and we need the value
                        if ('id' == key) {
                            innerHTML += `<td>${value}</td>`;
                            inputID = value;
                        } else {
                            innerHTML += `<td><input data-db="${key}/user_profile_form/id/${inputID}" type=text name="${key}" value="${value}"></td>`;
                        }
                    });
                    innerHTML += `</tr>`;
                });
                innerHTML += '</table>';



                // new entry
                innerHTML += '<h2>new entry</h2>';
                innerHTML += '<table><tr>';
                Object.keys(formFields[0]).forEach(key => {
                    if ('date' == key || 'id' == key) return
                    innerHTML += `<th>${key}</th>`
                })
                innerHTML += '</tr><form id=newEntry><tr>'

                Object.keys(formFields[0]).forEach(key => {
                    // debkey, value);
                    if ('date' == key || 'id' == key) return
                    innerHTML += `<td><input form=newEntry type=text name="${key}"  ></td>`;
                });
                innerHTML += '</tr><tr><td><input type="submit" form=newEntry  id=newEntryButton value=save class=button></td></tr>';
                innerHTML += '</tr></form></table>';


                Functions.setInnerHTML('UserProfileForm', innerHTML);
            } else {
                deb(res.code)
            }
        })
        .then(() => {
            // edit fields
            document.querySelectorAll('#editEntry input').forEach((input) => {
                // updata db on focusout
                input.addEventListener('focusout', function(el) {
                    // update a single value in db
                    Functions.singleEdit(el.target);
                });
            });
            document.getElementById('newEntryButton').addEventListener('click', (el) => {
                event.preventDefault();

                deb(el.target.form)

                let newEntryForm = new FormData(el.target.form);
                // newEntryForm.append('table', 'user_profile_form');
                Functions.getAPIdata('new_entry_in/user_profile_form', newEntryForm)
                    .then((res) => {
                        deb(res)
                        if (res.code === 200) {
                            // window.location.hash = '#user/profile/' + res.data.id;
                        }
                    });
            })
        });
};