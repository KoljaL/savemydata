import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: (Projects) => {
        deb(Projects)
        Style();
        return showProjects(Projects);
    },
};
/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ `
    #Projects .dataTable{
        padding:.5em;
        margin-top:1em;
    }
    #Projects > div{
        background-color: var(--bg_1);
    }
    `;
    Functions.createStyle('Projects_dhuo_style', styleTags);
};
let showProjects = (Projects) => {
    // deb(Projects)
    // make an array of all appointments 
    var dates = [];
    if (Projects) {
        // TODO - sort projects by creation date
        // deb(Projects[0])
        let Projects1 = Projects.sort(function(a, b) { return new Date(b.date) + new Date(a.date); });
        // deb(Projects1[0])

        let HTML = /*HTML*/ `
            <div id=Projects>
                <h3 data-lang="H_projects">Projects</h3>
                <a href="#project/new/${Projects[0].customer_id}" class="button boxShadow">new Project</a>
                <div class=boxShadow>
                    <table class="dataTable">`;
        Projects.forEach((Project) => {
            HTML += /*HTML*/ `<tr><td><a href="#project/id/${Project.id}">${Project.title}</a></td></tr>`;
        });
        HTML += /*HTML*/ `</table></div></div>`;
        return HTML;
    }

}