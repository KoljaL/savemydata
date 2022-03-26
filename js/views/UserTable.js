import Functions from '../Functions.js';
import CreateTable from '../components/CreateTable.js';


export default {
    render: async(action) => {
        deb(action)

        if (action === 'user') {
            window.slugName = 'User';
            window.tableName = 'user';
            window.formTableName = 'user_profile_form';
        }
        if (action === 'customer') {
            window.slugName = 'Customer';
            window.tableName = 'customer';
            window.formTableName = 'customer_profile_form';
        }

        Functions.pageTitle(`User Better Table`);
        await Style();
        await Content();
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
let Content = async() => {

    let data = await Functions.getAPIdata('get_data_from/' + tableName);
    data = data.data;


    let innerHTML = /*HTML*/ `
        <div id="UserTableWrapper" class="template"> 
         
            <div id="UserTable">${await CreateTable.render(data,slugName)}</div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};