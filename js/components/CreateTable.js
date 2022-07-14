import Functions from '../Functions.js';


export default {
    render: async(data, action) => {
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
            window.formTableName = '';
        }
        if (action === 'appointment') {
            window.slugName = 'Appointment';
            window.tableName = 'appointment';
            window.formTableName = '';
        }
        return await Content(data);
    },
};

/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ ` 

    #TableHeader{
        display:flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    #TableHeader .FF-item{
        margin-top:0;
    }
    #TableContent{
        border-collapse: collapse;
        fontsize: .9em;
    }
    #TableContent .headerRow {
        position: sticky;
        top: -1em;
        background: var(--bg_1);
        white-space: nowrap;
    }
    #TableContent th {
        padding: .5em 1em .5em .5em;
        text-align: left;
        cursor: pointer;
    }
    #TableContent td {
        white-space: nowrap;
        padding: .5em;
        max-width: 20em;
        overflow: hidden;
    }      
   
    #TableContent td.id {
        opacity:.5;
    }
    #TableContent tr.hideRow{
        visibility: collapse;
        opacity:0;
        transition: visibility .3s ease-out,opacity .8s ease-out;
    }
    #TableContent tr.hideRow>td{
        line-height:0;
        padding-top:0!important;
        padding-bottom:0!important;
        -webkit-transition: padding .3s ease-out, line-height 1.3s ease-out;
        -moz-transition: padding .3s ease-out, line-height 1.3s ease-out;
        -o-transition: padding .3s ease-out, line-height 1.3s ease-out;
        transition: padding .3s ease-out, line-height 1.3s ease-out;
    }
    #TableContent tr.showRow>td{
        -webkit-transition: padding .3s ease-out, line-height 1.3s ease-out;
        -moz-transition: padding .3s ease-out, line-height 1.3s ease-out;
        -o-transition: padding .3s ease-out, line-height 1.3s ease-out;
        transition: padding .3s ease-out, line-height 1.3s ease-out;
    }

    `;
    Functions.createStyle('CreateTable_oajd_style', styleTags);
};

/**
 * This function is used to render the content of the page
 */
let Content = async(data) => {
    await Style();

    // CREATE HTML

    // outer DIV
    let TableWrapper = document.createElement('DIV');
    TableWrapper.id = 'TableWrapper';

    // header
    let TableHeader = document.createElement('DIV');
    TableHeader.id = 'TableHeader';

    //headline
    let Headline = document.createElement('H2');
    Headline.dataset.lang = tableName + '_table';
    Headline.innerHTML = slugName + ' Table'
    TableHeader.appendChild(Headline);

    // searchwrapper
    let TableSearchWrapper = document.createElement('DIV');
    TableSearchWrapper.classList.add('FF-item');

    // searchfield
    let TableSearch = document.createElement('input');
    TableSearch.id = 'TableSearch';
    TableSearch.type = 'text';
    TableSearch.required = 'required';

    //searchlabel
    let TableSearchLabel = document.createElement('label');
    TableSearchLabel.innerHTML = 'Search';
    TableSearchLabel.dataset.lang = 'search';

    TableSearchWrapper.appendChild(TableSearch);
    TableSearchWrapper.appendChild(TableSearchLabel);
    TableHeader.appendChild(TableSearchWrapper);
    // CONTENT
    let TableContent = document.createElement('table');
    TableContent.id = 'TableContent';
    TableContent.classList.add(tableName);
    //add to wrapper
    TableWrapper.appendChild(TableHeader);
    TableWrapper.appendChild(TableContent);
    // create table
    createTable(data, TableContent);
    searchTable(TableContent, TableSearch);
    sortTable(TableContent);
    // return to DOM
    return TableWrapper.outerHTML;
};



async function createTable(data, TableContent) {
    // deb(data) 

    // error handling if there is no data in data
    if (!data[0]) {
        return
    }
    // https://www.valentinog.com/blog/html-table/
    let head = Object.keys(data[0]);
    // deb(head)
    let thead = TableContent.createTHead();
    let row = thead.insertRow();
    row.classList.add('headerRow');
    for (let key of head) {
        let th = document.createElement("th");
        th.classList.add(key);
        th.dataset.lang = 'F_' + key;
        th.innerHTML = key;
        row.appendChild(th);
    }

    for (let element of data) {
        let row = TableContent.insertRow();
        var user_id, project_id, staff_id, project_id, customer_id, appointment_id;
        for (let key in element) {
            let cell = row.insertCell();
            // add the obj key as classname 
            cell.classList.add(key);

            // make the profile links
            if (tableName === 'staff' || tableName === 'customer') {
                if (key === 'id') {
                    user_id = element[key];
                }
                if (key === 'username') {
                    element[key] = /*HTML*/ `<a href="#${tableName}/profile/${user_id}">${element[key]}</a>`;
                }
                cell.innerHTML = element[key];
            }
            // make project title link
            if (tableName === 'project') {
                if (key === 'customer_id') {
                    project_id = element[key];
                }
                if (key === 'username') {
                    element[key] = /*HTML*/ `<a href="#customer/profile/${project_id}">${element[key]}</a>`;
                }

                if (key === 'id') {
                    project_id = element[key];
                }
                if (key === 'title') {
                    element[key] = /*HTML*/ `<a href="#${tableName}/id/${project_id}">${element[key]}</a>`;
                }
                cell.innerHTML = element[key];
            }

            if (tableName === 'appointment') {
                if (key === 'customer_id') {
                    customer_id = element[key];
                }
                if (key === 'username') {
                    element[key] = /*HTML*/ `<a href="#customer/profile/${customer_id}">${element[key]}</a>`;
                }

                if (key === 'id') {
                    appointment_id = element[key];
                }
                if (key === 'title') {
                    element[key] = /*HTML*/ `<a href="#${tableName}/id/${appointment_id}">${element[key]}</a>`;
                }


                if (key === 'staff_id') {
                    staff_id = element[key];
                }
                if (key === 'staffname') {
                    element[key] = /*HTML*/ `<a href="#staff/profile/${staff_id}">${element[key]}</a>`;
                }


                if (key === 'project_id') {
                    project_id = element[key];
                    // deb(project_id)
                }
                if (key === 'projectname') {
                    element[key] = /*HTML*/ `<a href="#project/id/${project_id}">${element[key]}</a>`;
                    // deb(element[key])
                }

                cell.innerHTML = element[key];
            }

        }
    }


}

function searchTable(TableContent, input) {
    //https://www.w3schools.com/howto/howto_js_filter_table.asp
    document.body.addEventListener('keyup', (el) => {
        if (el.target && el.target.id == "TableSearch") {
            var input, filter, table, tr, td, i, txtValue;
            table = document.getElementById('TableContent');
            tr = table.getElementsByTagName("tr");
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
                            break;
                        } else {
                            cRow.setAttribute('class', 'hideRow');
                        }
                    }
                } // for cField
            } // for tr
        }
    })
}

function sortTable(table) {
    // https://www.w3schools.com/howto/howto_js_sort_table.asp
    // deb(table)// why has this table node selector in devTools
    document.body.addEventListener('click', (el) => {
        if (el.target && el.target.nodeName == "TH") {
            let table = el.target.parentNode.parentNode.parentNode;
            var n = el.target.cellIndex;
            var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
            // deb(table) // why has this table NO node selector in devTools
            switching = true;
            dir = "asc";
            // TODO loadingSpinner
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


        }

    })

}