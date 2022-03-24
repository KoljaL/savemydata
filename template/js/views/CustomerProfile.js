import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../Form.js';

export default {
    render: async(customerID) => {
        Functions.pageTitle(`Customer Profile`);
        await Style();
        await Content();
        await getCustomerData(customerID);
        await dropDownEvent();
        await newCustomerButton();
        await editCustomerButton(customerID);
        await deleteCustomerButton(customerID);
    },
};

/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ `
        #T_CustomerLoginForm h2{
            display:inline-block;
            margin-right: 1em;
        }
        #editArea{
            position: relative;
            widht:100%; 
        }
        #deleteCustomerButton:empty,
        #newCustomerButton:empty,
        #editCustomerButton:empty{
            border: none;
            outline: none;
            background: transparent;
        }
        #deleteCustomerButton,
        #newCustomerButton,
        #editCustomerButton{ 
            font-size: 14px;
            cursor:pointer;
            color: var(--font_0);
            background: var(--bg_3);
            line-height: 1.2em;
            padding: 0.3em .3em .2em .4em;
            outline: var(--border_0) solid 1px;
            transition: all 0.5s ease-in-out;
            border-radius: 0.2em;
            font-size: 1em;
            margin-left: 1em;
        }
        #deleteCustomerButton:hover{
            color: var(--fontRed);
        }
        #newCustomerButton:hover{
            color: var(--fontGreen);
        }
        #editCustomerButton:hover{
            color: var(--fontBlue);
        }

        #CustomerProfileList {
            display: inline-block;
        }
        #CustomerProfileHeader{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: start;
        }
        .ActionButtons{
            margin-bottom: 1.5em;
        }
 
    `;
    Functions.createStyle('CustomerProfile_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
        <div id="T_CustomerLoginForm" class="template"> 
            <div id=CustomerProfileHeader>
                <h2>Customer Profile</h2> 
                <div class="ActionButtons">
                    <div id=CustomerProfileList></div>
                    <span id="editCustomerButton"></span>
                    <span id="newCustomerButton"></span>
                    <span id="deleteCustomerButton"></span>
                </div>
            </div>
            <div id=editArea>
                <div id=Customerdata></div>
            </div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};

/**
 * It gets the customer data from the API and displays it on the page.
 */
let getCustomerData = async(customerID) => {
    const currentCustomerRole = Functions.getLocal('role');




    var formData = new FormData();
    formData.append('id', customerID);
    formData.append('table', 'customer');
    // getAPIdata (endpoint, formID)
    Functions.getAPIdata('userprofile', formData).then((res) => {
        // deb(res);
        if (res.code === 200) {
            const customer = res.data;
            // deb(customer)
            window.customername = customer.customername;
            let innerHTML = /*HTML*/ `
                     
                <form id=userProfilForm >
                
                <div class="FF-row">

                    ${Form.inputText({
                        name: 'customername',
                        type: 'text',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Customername',
                        value: customer.customername,
                        db: 'customername/customer/id/' + customer.id,
                    })}

                    ${Form.inputText({
                        name: 'firstname',
                        type: 'text',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Firstname',
                        value: customer.firstname,
                        db: 'firstname/customer/id/' + customer.id,
                    })}


                    ${Form.inputText({
                        name: 'lastname',
                        type: 'text',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Lastname',
                        value: customer.lastname,
                        db: 'lastname/customer/id/' + customer.id,
                    })}


                    ${Form.inputText({
                        name: 'email',
                        type: 'text',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Email',
                        value: customer.email,
                        db: 'email/customer/id/' + customer.id,
                    })}

                    ${Form.inputText({
                        name: 'password',
                        type: 'password',
                        widths: '100/150/300',
                        edit: 'hide',
                        label: 'Password',
                        value: '',
                        db: 'password/customer/id/' + customer.id,
                    })}

                </div>
              
                <div class="FF-row">

                    ${Form.inputText({
                        name: 'comment',
                        type: 'textarea',
                        widths: '300/400/500',
                        edit: currentCustomerRole === '0' ? 'hide' : 'forbidden',
                        label: 'Comment',
                        value: customer.comment,
                        db: 'comment/customer/id/' + customer.id,
                    })}

                    </div>
                    <div class="FF-row">

                    ${Form.inputText({
                        name: 'role',
                        type: 'text',
                        widths: '50/50/50',
                        edit: currentCustomerRole === '0' ? 'hide' : 'forbidden',
                        label: 'Role',
                        value: customer.role,
                        db: 'role/customer/id/' + customer.id,
                    })}

                    ${Form.inputText({
                        name: 'permission',
                        type: 'text',
                        widths: '100/100/100',
                        edit: currentCustomerRole === '0' ? 'hide' : 'forbidden',
                        label: 'Permission',
                        value: customer.permission,
                        db: 'permission/customer/id/' + customer.id,
                    })}
            </div>
                </form>`;

            // copy to DOM
            Functions.setInnerHTML('Customerdata', innerHTML);
        }
        // return error message
        else {
            let innerHTML = /*HTML*/ `<div id="T_CustomerLoginForm"> ${res.message}</div>`;
            Functions.setInnerHTML('Customerdata', innerHTML);
        }
    });
};

/**
 * It adds an event listener to the dropdown menu.
 */
let dropDownEvent = async() => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === '0') {
        let innerHTML = await UserList.render('dropdown', 'customer');
        await Functions.setInnerHTML('CustomerProfileList', innerHTML).then(() => {
            document.getElementById('UserListSelect').addEventListener('change', (el) => {
                Message.info('Customer Profile: ' + el.target.options[el.target.selectedIndex].text);
                // Message.success()
                // Message.error()
                // Message.warn()
                window.location.hash = '#customer/profile/' + el.target.value;
            });
        });
    }
};

/**
 * It makes the edit button clickable and makes the fields editable.
 */
let editCustomerButton = async(customerID) => {
    // only admin '0' can do this, or youser himselfs
    if (Functions.getLocal('role') === '0' || Functions.getLocal('id') === customerID) {
        await Functions.setInnerHTML('editCustomerButton', 'Edit').then(() => {
            document.getElementById('editCustomerButton').addEventListener('click', function() {
                document.querySelectorAll('#editArea input,#editArea textarea').forEach((input) => {
                    // make fields editable
                    input.classList.toggle('hideEdit');
                    // updata db on focusout
                    input.addEventListener('focusout', function(el) {
                        // update a single value in db
                        Functions.singleEdit(el.target);
                    });
                });
            });
        });
    }
};

let deleteCustomerButton = (customerID) => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === '0') {
        // set text, make the button visible
        Functions.setInnerHTML('deleteCustomerButton', 'Delete');

        document.getElementById('deleteCustomerButton').addEventListener('click', function() {
            var userDeleteForm = new FormData();
            userDeleteForm.append('table', 'customer');
            userDeleteForm.append('id', customerID);

            Functions.getAPIdata('deleteuser', userDeleteForm).then((res) => {
                deb(res);
                if (res.code === 200) {
                    Message.warn('Deleted Customer: ' + window.customername);
                    window.location.hash = '#customer/table/';
                }
            });
        });
    }
    // if not admin, delete this button
    else {
        document.getElementById('deleteCustomerButton').remove();
    }
};

/**
 * It adds a new customer to the database. newCustomerButton
 */
let newCustomerButton = async() => {
    // only admin '0' can do this
    if (Functions.getLocal('role') === '0') {
        // set text, make the button visible
        Functions.setInnerHTML('newCustomerButton', 'New');

        document.getElementById('newCustomerButton').addEventListener('click', (button) => {
            // send all inputfields to API & get directed to the new users profile
            if ('Save' === button.target.innerHTML) {
                let userProfilForm = document.getElementById('userProfilForm');
                userProfilForm = new FormData(userProfilForm);
                userProfilForm.append('table', 'customer');
                Functions.getAPIdata('newuser', userProfilForm).then((res) => {
                    // deb(res)
                    if (res.code === 200) {
                        window.location.hash = '#customer/profile/' + res.data.id;
                    }
                });
            } // save

            // delete all form values, make them editable & remove the data-db for singeedit
            if ('New' === button.target.innerHTML) {
                document.getElementById('editCustomerButton').remove();
                document.getElementById('deleteCustomerButton').remove();
                document.querySelectorAll('#editArea input,#editArea textarea').forEach((input) => {
                    delete input.dataset.db;
                    input.value = '';
                    input.classList.remove('hideEdit');
                    button.target.innerHTML = 'Save';
                });
            } //new
        });
    }
};