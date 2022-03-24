import Functions from '../Functions.js';


export default {
    render: async(type, table) => {
            let list = await getUserList(table);
            // deb(list)

            var name = (table === 'user') ? 'username' : 'customername';
            if ('dropdown' === type) {
                // deb(table)
                // deb(name)
                return /*html*/ ` 
                <select id="UserListSelect" name=user>
                    <option value="" hidden disabled selected>Select User</option>
                    ${Object.keys(list.data).map(key => (
                        // deb(list.data[key])
                        `<option value="${list.data[key].id}">${list.data[key][name]}</option>`
                    )).join('')}
                </select> `;
            };
            
            // all data as array
            if ('raw' === type) {
                return list;
                };

    },
};



let getUserList = async(table) => {
    try {
        var form = new FormData();
        form.append('table', table );
        const response = Functions.getAPIdata('userlist', form);
        return response;
    } catch (err) {
        console.log('Error getting documents', err);
    }
};