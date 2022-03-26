import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import Form from '../Form.js';

// import files for grid
import ('../components/TUIgrid.js');
Functions.addStylesheet('./style/css/TUIgrid.css');

export default {
    render: async(userID) => {
        Functions.pageTitle(`User Better Table`);
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
    #UserTable{
        border-collapse: collapse;
    }
    #UserTable .headerRow {
        // position: fixed;
        background: var(--bg_1);
        padding: .5em;
    }
        #UserTable th {
        padding: .5em 1em .5em .5em;
        text-align: left;
    }
        #UserTable td {
        white-space: nowrap;
        padding: .5em;
        max-width: 20em;
        overflow: hidden;
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
                <h2>User Better Table</h2>  
            </div>
            <input type="text" id="myInput"  placeholder="Search for names..">
            <table id="UserTable"></table>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};

let Data = async() => {
    let data = await Functions.getAPIdata('get_data_from/customer');
    data = data.data;
    // deb(data)
    createTable(data);
    searchTable();
    sortTable();
};

function createTable(data) {
    // https://www.valentinog.com/blog/html-table/
    // deb(data)

    let table = document.querySelector("#UserTable");
    let head = Object.keys(data[0]);
    // generateTableHead(table, head);
    // generateTableBody(table, data);


    // function generateTableHead(table, head) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    row.classList.add('headerRow');
    for (let key of head) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(key));
        row.appendChild(th);
    }
    // }

    // function generateTableBody(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        var ID;
        for (let key in element) {
            let cell = row.insertCell();
            cell.classList.add(key);

            if (key === 'id') {
                ID = element[key];
            }
            if (key === 'username') {
                element[key] = /*MTML*/ `<a href="#user/profile/${ID}">${element[key]}</a>`;
            }
            cell.innerHTML = element[key];
            // cell.appendChild(document.createTextNode(element[key]));
        }
    }
    // }


}

function searchTable() {
    //https://www.w3schools.com/howto/howto_js_filter_table.asp
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    table = document.getElementById("UserTable");
    tr = table.getElementsByTagName("tr");
    input.addEventListener('keyup', (el) => {
        filter = el.target.value.toLowerCase();
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            var cRow = tr[i];
            var cField = cRow.getElementsByTagName("td");
            for (let j = 0; j < cField.length; j++) {
                var td = cField[j];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    // deb(txtValue.toLowerCase())
                    // deb(filter)
                    // deb(txtValue.toLowerCase().indexOf(filter))
                    if (txtValue.toLowerCase().indexOf(filter) === 0) {
                        cRow.style.display = "";
                        break;
                    } else {
                        cRow.style.display = "none";
                    }
                }
            } // for cField
        } // for tr
    })
}

function sortTable() {
    // https://www.w3schools.com/howto/howto_js_sort_table.asp
    document.querySelectorAll('table th').forEach(tableHead => {
        tableHead.addEventListener('click', (el) => {
            // deb(el.target.cellIndex)
            var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
            var n = el.target.cellIndex;
            table = document.getElementById("UserTable");
            switching = true;
            dir = "asc";
            while (switching) {
                switching = false;
                rows = table.rows;
                for (i = 1; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    x = rows[i].getElementsByTagName("TD")[n];
                    y = rows[i + 1].getElementsByTagName("TD")[n];
                    if (dir == "asc") {
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir == "desc") {
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
                if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchcount++;
                } else {
                    if (switchcount == 0 && dir == "asc") {
                        dir = "desc";
                        switching = true;
                    }
                }
            }
        })
    });

}