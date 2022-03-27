import Functions from '../Functions.js';


export default {
    render: async(data, action) => {
        if (action === 'user') {
            window.slugName = 'User';
            window.tableName = 'user';
            window.formTableName = 'user_profile_form';
        }
        if (action === 'customer') {
            window.slugName = 'Customer';
            window.tableName = 'customer';
            window.formTableName = 'customer_profile_form';
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
        padding: .5em;
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
    Functions.createStyle('CreateTable_style', styleTags);
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
    Headline.dataset.lang = formTableName;
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
    // https://www.valentinog.com/blog/html-table/

    let head = Object.keys(data[0]);

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