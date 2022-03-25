import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../Form.js';

// import files for grid
import ('../components/TUIgrid.js');
Functions.addStylesheet('./template/css/TUIgrid.css');

export default {
    render: async() => {
        Functions.pageTitle(`Customer Table`);
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
 
    #CustomerTable .tui-grid-border-line-top {
        border-top: none;
    }      
    #CustomerTable .tui-grid-body-area {
        background-color: transparent;
      }
    #CustomerTable .tui-grid-cell {
        background-color: transparent;
    border-color: var(--border_0);
    border-left-width: 0;
    border-right-width: 0;
    border-top-width: 1px;
    border-bottom-width: 1px;
        color: var(--font_0);
    }
    #CustomerTable .tui-grid-header-area {
        background-color: var(--bg_1);
        border-color: var(--border_0);
    }
    #CustomerTable .tui-grid-content-area {
        border-color: #ea0000;
    }
    #CustomerTable .tui-grid-layer-focus-border {
        background-color: transparent;
      }
    #CustomerTable  .tui-grid-layer-focus-deactive .tui-grid-layer-focus-border {
        background-color: transparent;
    }
    
    
    #CustomerTable [data-column-name="_number"] .tui-grid-cell-content {
        color: var(--font_2);
    }
    
    #CustomerTable [data-column-name="username"] .tui-grid-cell-content {
        color: var(--fontBlue);
        font-weight: bold;
    }

    #CustomerTable [data-column-name="username"] {
        cursor:pointer;
    }

    `;
    Functions.createStyle('CustomerTable_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
        <div id="CustomerTableWrapper" class="template"> 
            <div id=CustomerTableHeader>
                <h2>Customer Table</h2>  
            </div>
            <div id="CustomerTable"></div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};

let Data = async() => {
    let data = await Functions.getAPIdata('get_data_from/customer/');

    data = data.data;
    // deb(data)
    const grid = new tui.Grid({
        usageStatistics: false,
        el: document.getElementById('CustomerTable'),
        data: data,
        // rowHeaders: ['checkbox'],
        rowHeaders: ['rowNum'],
        scrollX: true,
        scrollY: false,
        // bodyHeight: "90%",
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
                header: 'Customername',
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
                width: 120,
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
                header: 'Street',
                name: 'street',
            },
            {
                header: 'Nr',
                name: 'street_nr',
                width: 50,

            },
            {
                header: 'City',
                name: 'city',
                width: 60,
            },
            {
                header: 'Post',
                name: 'city_nr',
                width: 50,
            },
            {
                header: 'Phone',
                name: 'phone',
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
            window.location.hash = '#customer/profile/' + id;
        }
        if (ev.columnName === 'id') {
            let id = grid.getFocusedCell().value;
            window.location.hash = '#customer/profile/' + id;
        }
    });
};