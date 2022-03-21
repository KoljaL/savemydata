import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../Form.js';

// import files for grid
import ("../components/TUIgrid.js");
Functions.addStylesheet('./template/css/TUIgrid.css');



export default {
    render: async(userID) => {
        Functions.pageTitle(`User Table`);
        await Style();
        await Content();
        await Data();
    },
};


/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ ` 
 
    #UserTable .tui-grid-border-line-top {
        border-top: none;
    }      
    #UserTable .tui-grid-body-area {
        background-color: transparent;
      }
      #UserTable .tui-grid-cell {
        background-color: transparent;
        border-color: var(--border_0);
        border-left-width: 0;
        border-right-width: 0;
        border-top-width: 1px;
        border-bottom-width: 1px;
        color: var(--font_0);
      }
      #UserTable .tui-grid-header-area {
        background-color: var(--bg_1);
        border-color: var(--border_0);
      }
      #UserTable .tui-grid-content-area {
        border-color: #ea0000;
      }

    `;
    Functions.createStyle('UserTable_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
        <div id="UserTableWrapper" class="template"> 
            <div id=UserTableHeader>
                <h2>User Table</h2>  
            </div>
            <div id="UserTable"></div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);

};

let Data = async() => {
    let data = await UserList.render('raw');
    data = data.data
        // deb(data)
    const grid = new tui.Grid({
        usageStatistics: false,
        el: document.getElementById('UserTable'),
        data: data,
        // rowHeaders: ['checkbox'],
        rowHeaders: ['rowNum'],
        scrollX: false,
        scrollY: false,
        columnOptions: {
            resizable: true
        },
        columns: [{
                header: 'ID',
                name: 'id',
                sortingType: 'asc',
                sortable: true
            },
            {
                header: 'Username',
                name: 'username',
                sortingType: 'asc',
                sortable: true
            },
            {
                header: 'Firstname',
                name: 'firstname',
                sortingType: 'asc',
                sortable: true
            },
            {
                header: 'Lastname',
                name: 'lastname',
                sortingType: 'asc',
                sortable: true
            },
            {
                header: 'Email',
                name: 'email'
            },
            {
                header: 'Role',
                name: 'role'
            },
            {
                header: 'Permission',
                name: 'permission'
            },
            {
                header: 'Comment',
                name: 'comment'
            }
        ]
    });


    grid.on('click', ev => {
        if (ev.columnName === 'id') {
            let id = grid.getFocusedCell().value
            window.location.hash = '#user/profile/' + id
        }
        // console.log('change focused cell!', ev);
    });
};