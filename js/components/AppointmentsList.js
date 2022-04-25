import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: (Appointments) => {
        Style();
        return showAppointments(Appointments);
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
let showAppointments = (Appointments) => {
    // deb(Appointments)
    // make an array of all appointments 
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
                <a href="#appointment/new/${Appointments[0].customer_id}" class="button boxShadow">new Appointment</a>
                    <div class=boxShadow>
                        <table class="dataTable">`;
        dates.forEach((date) => {
            let datetime = date.start_date + ' ' + date.start_time;
            HTML += /*HTML*/ `<tr><td class=numeric ><a href="#appointment/id/${date.id}">${Functions.formatDate(datetime)}</a></td></tr>`;
        });
        HTML += /*HTML*/ `</table></div></div>`;
        return HTML;
    } else {
        let HTML = /*HTML*/ `<div id=Appointments><h3 data-lang="H_appointments">Appointments</h3><div class=boxShadow><table class="dataTable">`;
        HTML += /*HTML*/ `<tr><td class=numeric ><span>not yet</span></td></tr></table></div></div>`;
        return HTML;
    }

}