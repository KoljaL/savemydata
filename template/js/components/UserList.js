import Functions from '../Functions.js';


export default {
    render: async(type) => {
            let post = await getUserList();
            deb(post)

            if ('dropdown' === type) {
                return /*html*/ ` 
                <select id="UserListSelect" name=user>
                    <option value="" hidden disabled selected>Select User</option>
                    ${Object.keys(post.data).map(key => (
                        `<option value="${post.data[key].id}">${post.data[key].username}</option>`
                    )).join('')}
                </select> `;
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