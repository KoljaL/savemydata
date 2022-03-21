import Functions from '../Functions.js';


export default {
    render: async(type) => {
            let list = await getUserList();
            // deb(list)

            if ('dropdown' === type) {
                return /*html*/ ` 
                <select id="UserListSelect" name=user>
                    <option value="" hidden disabled selected>Select User</option>
                    ${Object.keys(list.data).map(key => (
                        `<option value="${list.data[key].id}">${list.data[key].username}</option>`
                    )).join('')}
                </select> `;
                }
            if ('raw' === type) {
                return list;
                }

    },
};



let getUserList = async() => {
    try {
    var dummy = new FormData();
        const response = Functions.getAPIdata('userlist', dummy)
        return response;
    } catch (err) {
        console.log('Error getting documents', err);
    }
};