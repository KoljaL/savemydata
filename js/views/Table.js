import Functions from '../Functions.js';
import CreateTable from '../components/CreateTable.js';
import UserList from '../components/UserList.js';


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
        if (action === 'project') {
            window.slugName = 'Project';
            window.tableName = 'project';
            window.formTableName = 'project_fields';
        }
        if (action === 'appointment') {
            window.slugName = 'Appointment';
            window.tableName = 'appointment';
            window.formTableName = 'project_fields';
        }

        Functions.pageTitle(`${slugName} Table`);
        await Style();
        await Content(action);
    },
};

/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ ` 
    table.project .staff_id,
    table.customer .staff_id,
    table.appointment .staff_id,
    table.appointment .project_id,
    table.appointment .customer_id,
    table.appointment .date,
    table.appointment .end_time,
    table.project .customer_id,
    table.project .date{
        display:none;
    }

    .start_time,.start_date,.duration,.public {
        font-variant-numeric: tabular-nums;
        font-family: 'Zilla Slab', sans-serif;
        font-size: 1.1em;
    }

    #newProjectForm .FF-row.content .FF-item{
        margin-top: 0;
    }
    `;
    Functions.createStyle('UserTable_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async(action) => {
    let data;
    // deb(tableName)
    // PROJECTS
    if ('project' == tableName) {
        data = await Functions.getAPIdata('get_table_or_list_from/' + tableName);
        data = data.data;
    }
    // APPOINTMENTS
    else if ('appointment' == tableName) {
        let res = await Functions.getAPIdata('get_table_or_list_from/' + tableName);
        // deb(res.data);
        // TODO add new fields at  the end
        // sort by list
        // !!! IDs must before the name !! project_id => projectname
        let field_order = ["id", "title", "start_date", "start_time", "duration", "customer_id", "username", "state", "project_id", "projectname", "staff_id", "staffname", "comment"]
        var presort_data = []
        res.data.forEach(d => {
            let field = field_order.reduce((obj, v) => {
                obj[v] = d[v];
                return obj;
            }, {});
            presort_data.push(field)
        });
        data = presort_data;
        // deb(presort_data);
        // data = res.data;
    }
    // USER
    else {
        data = await Functions.getAPIdata('get_table_or_list_from/' + tableName);
        data = data.data;
    }

    /**
     * 
     *  call CreateTable component 
     * 
     */
    let innerHTML = /*HTML*/ `
        <div id="UserTableWrapper" class="template"> 
            <div id="UserTable">${await CreateTable.render(data,action)}</div>
        </div>`;
    Functions.setInnerHTML('main', innerHTML);

    // WAS AN ADD NEW PROJECT BUTTON 
    // REMOVED 18.07. 13:50 because useless and makes bugs
};