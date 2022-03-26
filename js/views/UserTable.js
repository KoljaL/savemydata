import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../Form.js';

// import files for grid
import ('../components/TUIgrid.js');
Functions.addStylesheet('./style/css/TUIgrid.css');

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
    #UserTable .tui-grid-layer-focus-border {
        background-color: transparent;
      }
    #UserTable  .tui-grid-layer-focus-deactive .tui-grid-layer-focus-border {
        background-color: transparent;
    }
    
    #UserTable [data-column-name="_number"] .tui-grid-cell-content {
        color: var(--font_2);
    }

    #UserTable [data-column-name="username"] .tui-grid-cell-content {
        color: var(--fontBlue);
        font-weight: bold;
    }     
    #UserTable [data-column-name="username"] {
        cursor:pointer;
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
    let data = await Functions.getAPIdata('get_data_from/user');
    data = data.data;
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
            // resizable: true
        },
        header: {
            align: 'left',
        },
        columns: [{
                header: 'ID',
                name: 'id',
                sortingType: 'asc',
                sortable: true,
                width: 50,
            },
            {
                header: 'Username',
                name: 'username',
                sortingType: 'asc',
                sortable: true,
                width: 200,
            },
            {
                header: 'Firstname',
                name: 'firstname',
                sortingType: 'asc',
                sortable: true,
            },
            {
                header: 'Lastname',
                name: 'lastname',
                sortingType: 'asc',
                sortable: true,
            },
            {
                header: 'Email',
                name: 'email',
            },
            {
                header: 'Role',
                name: 'role',
                width: 50,
            },
            {
                header: 'Permission',
                name: 'permission',
                width: 50,
            },
            {
                header: 'Comment',
                name: 'comment',
            },
        ],
    });

    grid.on('click', (ev) => {
        // deb(grid.getFocusedCell())
        // deb(grid.getFormattedValue(grid.getFocusedCell().rowKey, 'id'))

        if (ev.columnName === 'username') {
            let id = grid.getFormattedValue(grid.getFocusedCell().rowKey, 'id');
            window.location.hash = '#user/profile/' + id;
        }
        if (ev.columnName === 'id') {
            let id = grid.getFocusedCell().value;
            window.location.hash = '#user/profile/' + id;
        }
    });
};