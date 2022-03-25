import Functions from '../Functions.js';

export default {
    render: async(type, table) => {
        let list = await getUserList(table);
        // deb(list)

        // var name = table === 'user' ? 'username' : 'customername';
        if ('dropdown' === type) {
            // deb(table)
            // deb(name)
            let innerHTML;
            list.data.forEach(key => {
                innerHTML += `<option value="${key.id}">${key.username}</option>`;
            })
            return /*html*/ ` 
                <select id="UserListSelect" name=user>
                    <option value="" hidden disabled selected>Select User</option>
                    ${innerHTML}
                </select> `;
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