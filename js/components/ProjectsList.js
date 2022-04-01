import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: (Projects) => {
        Style();
        return showProjects(Projects);
    },
};
/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ `
    .dataTable{
        padding:.5em;
    }

 
    `;
    Functions.createStyle('Projects_deko_style', styleTags);
};
let showProjects = (Projects) => {
    // deb(Projects)
    // make an array of all appointments 
    var dates = [];
    if (Projects) {
        // sort by date

        deb(Projects)
            // create table
        let HTML = /*HTML*/ `<div id=Projects><h3 data-lang="H_appointments">Projects</h3><table class="dataTable boxShadow">`;
        Projects.forEach((Project) => {
            HTML += /*HTML*/ `<tr><td><a href="#project/id/${Project.id}">${Project.title}</a></td></tr>`;
        });
        HTML += /*HTML*/ `</table></div>`;
        return HTML;
    } else {
        return 'no Projects';
    }

}