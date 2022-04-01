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
        Style();
        Content(action);
        newItem();
    },
};

/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ ` 
    /* table.project .staff_id,*/
    table.appointment .staff_id,
    table.appointment .project_id,
    table.appointment .customer_id,
    table.appointment .date,
    table.appointment .end_time,
    table.project .customer_id,
    table.project .date{
        display:none;
    }

    .start_time,.duration,.public {
        font-variant-numeric: tabular-nums;
        font-family: 'Zilla Slab Medium', sans-serif;
        font-size: 1.1em;
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
    if ('project' == tableName) {
        data = await Functions.getAPIdata('get_projects_as_table/' + tableName);
    }
    if ('appointment' == tableName) {
        data = await Functions.getAPIdata('get_appointments_as_table/' + tableName);
    } else {
        data = await Functions.getAPIdata('get_data_from/' + tableName);
    }
    data = data.data;
    // deb(data)
    // deb(tableName)


    let innerHTML = /*HTML*/ `
        <div id="UserTableWrapper" class="template"> 
            <div id="UserTable">${await CreateTable.render(data,action)}</div>
        </div>`;

    if ('project' == tableName) {
        let userList = await UserList.render('dropdown', 'customer');
        innerHTML += /*HTML*/ `
        <div id=newProject>
        <h3>new Project</h3>
            <form id=newProjectForm>
                <div class="FF-row" style="max-width:max-content;">
                    <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:200px;;">
                        <input id="title" name="title" type="text" placeholder="" required="">
                        <label data-lang="F_title" for="title">Title</label>
                    </div>
                    <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:200px;;">
                        ${userList} 
                    </div> 
                    <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:100px;;">
                        <input id=newProjectButton class="button" type="submit" value=send>
                    </div>
                        <input type="hidden" name=staff_id value="${Functions.getLocal('id')}">
                </div>
                
            </form>
        </div>
        `;
    }
    Functions.setInnerHTML('main', innerHTML);
};


let newItem = async() => {
    document.addEventListener('click', (el) => {
        // send new project form
        if (el.target.id === 'newProjectButton') {
            event.preventDefault();
            let form = el.target.form;
            if (Functions.validForm(form)) {
                let newEntryForm = new FormData(form);
                Functions.getAPIdata('new_entry_in/project', newEntryForm)
                    .then((res) => {
                        deb(res)
                        if (res.code === 200) {
                            Message.success('New Project created')
                            window.location.hash = `#project/id/${res.data.id}`;
                        }
                    });
            } else {
                Message.error('Fill all Fields')
            }
        }
    })
};