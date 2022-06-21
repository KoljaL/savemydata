import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: (Appointments, customer_id, project_id = '') => {
        Style();
        return showAppointments(Appointments, customer_id, project_id);
    },
};
/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ `
  
    #Appointments .dataTable{
        padding:.5em;
        margin-top:1em;
    }
    #Appointments > div{
        background-color: var(--bg_1);

    }
    
    #Appointments .numeric a{
        white-space: nowrap;
    }
 
    `;
    Functions.createStyle('Appointments_deko_style', styleTags);
};
let showAppointments = (Appointments, customer_id, project_id) => {
    // deb(Appointments)
    // make an array of all appointments 
    let IDs = customer_id;
    if (project_id !== '') IDs = customer_id + ',' + project_id;
    var dates = [];
    if (Appointments.length > 0) {
        // sort by date
        dates = Appointments.sort(function(a, b) { return new Date(b.start_time) - new Date(a.start_time); });
        dates = Appointments.sort(function(a, b) { return new Date(b.start_date) - new Date(a.start_date); });
        // deb(dates)
        // create table
        let HTML = /*HTML*/ `
            <div id=Appointments>
                <h3 data-lang="H_appointments">Appointments</h3>
                <a href="#appointment/new/${IDs}" class="button boxShadow">new Appointment</a>
                    <div class=boxShadow>
                        <table class="dataTable">`;

        // Appointment rows
        dates.forEach((date) => {
            let datetime = date.start_date + ' ' + date.start_time;
            HTML += /*HTML*/ `<tr><td class=numeric ><a href="#appointment/id/${date.id}">${Functions.formatDate(datetime)}</a></td></tr>`;
        });

        HTML += /*HTML*/ `</table></div></div>`;
        return HTML;
    } else {
        return /*HTML*/ `
            <div id=Appointments>
                <h3 data-lang="H_appointments">Appointments</h3>
                <a href="#appointment/new/${IDs}" class="button boxShadow">new Appointment</a>
            </div>`;
    }

}