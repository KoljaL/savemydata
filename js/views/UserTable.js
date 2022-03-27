import Functions from '../Functions.js';
import CreateTable from '../components/CreateTable.js';


export default {
    render: async(action) => {
        if (action === 'staff') {
            window.slugName = 'Staff';
            window.tableName = 'staff';
            window.formTableName = 'staff_fields';
        }
        if (action === 'customer') {
            window.slugName = 'Customer';
            window.tableName = 'customer';
            window.formTableName = 'customer_fields';
        }

        Functions.pageTitle(`User Table`);
        Style();
        Content(action);
    },
};

/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ ` 
    `;
    Functions.createStyle('UserTable_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async(action) => {

    let data = await Functions.getAPIdata('get_data_from/' + tableName);
    data = data.data;


    let innerHTML = /*HTML*/ `
        <div id="UserTableWrapper" class="template"> 
         
            <div id="UserTable">${await CreateTable.render(data,action)}</div>
        </div>`;
    Functions.setInnerHTML('main', innerHTML);
};