import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: async(type, table) => {
        let list = await getUserList(table);
        // deb(list)

        if (table === 'staff') {
            window.slugName = 'Staff';
            window.tableName = 'staff';
        }
        if (table === 'customer') {
            window.slugName = 'Customer';
            window.tableName = 'customer';
        }



        if ('dropdown' === type) {
            // deb(table)
            // deb(name)
            let innerHTML;
            list.data.forEach(key => {
                innerHTML += `<option value="${key.id}">${key.username}</option>`;
            })
            return /*html*/ ` 
                <select id="${tableName}ListSelect" class=boxShadow name="${tableName}_id">
                    <option value="" hidden disabled selected data-lang="select-${slugName}">Select ${slugName}</option>
                    ${innerHTML}
                </select> `;
            LanguageSwitch.render();

        }
    },
};

let getUserList = async(table) => {
    try {
        let staff_id = '';
        if (slugName === 'customer') {
            staff_id = ',staff_id';
        }
        const response = Functions.getAPIdata('get_list_from/' + table + '/id,username' + staff_id);
        return response;
    } catch (err) {
        console.log('Error getting documents', err);
    }
};