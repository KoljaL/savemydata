import Functions from '../Functions.js';

let UserProfileForm = {
    render: async(formtable) => {
        Functions.pageTitle(`edit User Profile Form`);
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

        #UserProfileForm .removeEntry{
            color: var(--fontRed);
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








let getData = async(formtable) => {
    Functions.getAPIdata('get_data_from/' + formtable)
        .then((res) => {
            if (res.code === 200) {
                let formFields = res.data;
                // deb(formFields);

                // sort by position
                formFields.sort((a, b) => {
                    return a.pos - b.pos;
                });
                //sort by row
                formFields.sort((a, b) => {
                    return a.row - b.row;
                });

                // create table
                let innerHTML = /*HTML*/ `<h2 data-lang="P_edit_entry">edit entry</h2>`;
                innerHTML += /*HTML*/ `<table id=editEntry><tr>`;
                Object.keys(formFields[0]).forEach(key => {
                    if ('date' == key) return
                    innerHTML += /*HTML*/ `<th>${key}</th>`;
                })
                innerHTML += /*HTML*/ `<td></td></tr>`;
                formFields.forEach(el => {
                    // deb(el)
                    innerHTML += /*HTML*/ `<tr>`;
                    let inputID;
                    Object.entries(el).forEach(entry => {
                        const [key, value] = entry;
                        // dont show the date
                        if ('date' == key) return
                            // id is not editable and we need the value
                        if ('id' == key) {
                            innerHTML += /*HTML*/ `<td>${value}</td>`;
                            inputID = value;
                        } else {
                            innerHTML += /*HTML*/ `<td><input data-db="${key}/staff_fields/id/${inputID}" type=text name="${key}" value="${value}"></td>`;
                        }
                    });
                    innerHTML += /*HTML*/ `<td><input class="removeEntry button" data-remove="${inputID}" type=submit value="🗑"></td>`;
                    innerHTML += /*HTML*/ `</tr>`;
                });
                innerHTML += /*HTML*/ `</table>`;



                // new entry
                innerHTML += /*HTML*/ `<h2 data-lang="P_new_entry">new entry</h2>`;

                innerHTML += /*HTML*/ `<table><tr>`;
                Object.keys(formFields[0]).forEach(key => {
                    if ('date' == key || 'id' == key) return
                    innerHTML += /*HTML*/ `<th>${key}</th>`
                })
                innerHTML += /*HTML*/ `</tr><form id=newEntry><tr>`;

                Object.keys(formFields[0]).forEach(key => {
                    // debkey, value);
                    if ('date' == key || 'id' == key) return
                    innerHTML += /*HTML*/ `<td><input form=newEntry type=text name="${key}"  ></td>`;
                });
                innerHTML += /*HTML*/ `</tr><tr><td><input type="submit" form=newEntry  id=newEntryButton value=save class=button></td></tr>`;
                innerHTML += /*HTML*/ `</tr></form></table>`;


                Functions.setInnerHTML('UserProfileForm', innerHTML);
            } else {
                deb(res.code)
            }
        })
        .then(() => {
            // edit fields
            document.querySelectorAll('#editEntry input[type="text"]').forEach((input) => {
                // updata db on focusout
                input.addEventListener('focusout', function(el) {
                    // update a single value in db
                    Functions.singleEdit(el.target);
                });
            });
            // REMOVE entry
            document.querySelectorAll('.removeEntry').forEach(remove => {
                remove.addEventListener('click', (el) => {
                    event.preventDefault();
                    let id = el.target.dataset.remove;
                    deb(id);
                    Functions.getAPIdata('delete_entry_in/' + formtable + '/' + id)
                        .then((res) => {
                            deb(res)
                            if (res.code === 200) {
                                Message.success('New entry saved');
                                window.location.hash = window.location.hash + '#';
                            }
                        });
                });
            });
            // NEW entry
            document.getElementById('newEntryButton').addEventListener('click', (el) => {
                event.preventDefault();
                let newEntryForm = new FormData(el.target.form);
                Functions.getAPIdata('new_entry_in/staff_fields', newEntryForm)
                    .then((res) => {
                        // deb(res)
                        if (res.code === 200) {
                            Message.success('New entry saved');
                            window.location.hash = window.location.hash + '#';
                        }
                    });
            })
        });
};