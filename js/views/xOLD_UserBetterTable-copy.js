import Functions from '../Functions.js';
import CreateTable from '../components/CreateTable.js';


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

    #UserTableHeader{
        display:flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    #UserTableHeader .FF-item{
        margin-top:0;
    }
    #UserTable{
        border-collapse: collapse;
    }
    #UserTable .headerRow {
        position: sticky;
        top: -1em;
        background: var(--bg_1);
        padding: .5em;
    }
    #UserTable th {
        padding: .5em 1em .5em .5em;
        text-align: left;
        cursor: pointer;
    }
    #UserTable td {
        white-space: nowrap;
        padding: .5em;
        max-width: 20em;
        overflow: hidden;
    }      
   
    #UserTable td.id {
        opacity:.5;
    }

    tr.hideRow{
        visibility: collapse;
        opacity:0;
        transition: visibility .3s ease-out,opacity .8s ease-out;
    }
 
    tr.hideRow>td{
        line-height:0;
        padding-top:0!important;
        padding-bottom:0!important;
        -webkit-transition: padding .3s ease-out, line-height 1.3s ease-out;
        -moz-transition: padding .3s ease-out, line-height 1.3s ease-out;
        -o-transition: padding .3s ease-out, line-height 1.3s ease-out;
        transition: padding .3s ease-out, line-height 1.3s ease-out;
    }
    tr.showRow>td{
        -webkit-transition: padding .3s ease-out, line-height 1.3s ease-out;
        -moz-transition: padding .3s ease-out, line-height 1.3s ease-out;
        -o-transition: padding .3s ease-out, line-height 1.3s ease-out;
        transition: padding .3s ease-out, line-height 1.3s ease-out;
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
                <div class=FF-item>
                    <input type="text" id="TableSearch"  placeholder="Search for everything.." required="">
                    <label>Search</label>
                </div>
            </div>
            <div id="UserTable"></div>
        </div>`;
    await Functions.setInnerHTML('main', innerHTML);
};

let Data = async() => {
    let data = await Functions.getAPIdata('get_data_from/customer');
    data = data.data;
    // deb(data)
    await createTable(data, 'UserTable');
    searchTable('UserTable');
    sortTable('UserTable');
};

async function createTable(data, el) {
    // https://www.valentinog.com/blog/html-table/
    // deb(data)
    el = document.getElementById(el);

    let table = document.createElement('table');
    el.appendChild(table);

    // let table = document.querySelector("#UserTable");
    let head = Object.keys(data[0]);

    let thead = table.createTHead();
    let row = thead.insertRow();
    row.classList.add('headerRow');
    for (let key of head) {
        let th = document.createElement("th");
        th.classList.add(key);
        th.innerHTML = key;
        row.appendChild(th);
    }

    for (let element of data) {
        let row = table.insertRow();
        var ID;
        for (let key in element) {
            let cell = row.insertCell();
            // add the obj key as classname 
            cell.classList.add(key);
            if (key === 'id') {
                ID = element[key];
            }
            if (key === 'username') {
                element[key] = /*MTML*/ `<a href="#user/profile/${ID}">${element[key]}</a>`;
            }
            cell.innerHTML = element[key];
        }
    }


}

function searchTable(el) {
    //https://www.w3schools.com/howto/howto_js_filter_table.asp
    var input, filter, table, tr, td, i, txtValue;
    table = document.getElementById(el);
    input = document.getElementById("TableSearch");

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
                    // problem with numbers? // deb(txtValue.toLowerCase())// deb(filter)// deb(txtValue.toLowerCase().indexOf(filter))
                    if (txtValue.toLowerCase().indexOf(filter) === 0) {
                        cRow.setAttribute('class', 'showRow');
                        // cRow.setAttribute('style', 'line-height: 1em; height:1em; position: relative;top: 0em;');
                        // cRow.style.display = "";
                        break;
                    } else {
                        cRow.setAttribute('class', 'hideRow');
                        // cRow.setAttribute('style', 'line-height: 0em; height:0; position: relative;top: -1em;');
                        // cRow.style.display = "none";
                    }
                }
            } // for cField
        } // for tr
    })
}

function sortTable(table) {
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