import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: async(type, table) => {
        let list = await getUserList(table);
        // deb(list)

        var name = (table === 'customer') ? 'Customer' : 'Staff';
        if ('dropdown' === type) {
            // deb(table)
            // deb(name)
            let innerHTML;
            list.data.forEach(key => {
                innerHTML += `<option value="${key.id}">${key.username}</option>`;
            })
            return /*html*/ ` 
                <select id="UserListSelect" name=user>
                    <option value="" hidden disabled selected data-lang="select-${name}">Select ${name}</option>
                    ${innerHTML}
                </select> `;
            LanguageSwitch.render();

        }
    },
};

let getUserList = async(table) => {
    try {
        const response = Functions.getAPIdata('get_list_from/' + table + '/id,username');
        return response;
    } catch (err) {
        console.log('Error getting documents', err);
    }
};