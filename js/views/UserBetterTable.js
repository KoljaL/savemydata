import Functions from '../Functions.js';
import CreateTable from '../components/CreateTable.js';


export default {
    render: async(userID) => {
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

    let data = await Functions.getAPIdata('get_data_from/customer');
    data = data.data;


    let innerHTML = /*HTML*/ `
        <div id="UserTableWrapper" class="template"> 
         
            <div id="UserTable">${await CreateTable.render(data)}</div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};