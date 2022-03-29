import Functions from '../Functions.js';

let Project = {
    render: async(id) => {
        Functions.pageTitle(`Project`)
        await Style();
        await Content();
        await ProjectContent(id);
    }
};

export default Project;



/*
 ######  ######## ##    ## ##       ########
##    ##    ##     ##  ##  ##       ##
##          ##      ####   ##       ##
 ######     ##       ##    ##       ######
      ##    ##       ##    ##       ##
##    ##    ##       ##    ##       ##
 ######     ##       ##    ######## ########
*/
let Style = async() => {
    let styleTags = /*CSS*/ `
        #ProjectWrapper {
            padding:1em;
        }   

        #ProjectHeader {
            display: flex;
            justify-content: flex-start;
            align-items: baseline;
          }
        #ProjectHeader h2{margin-bottom:.0em;}
        #ProjectContent h3{margin-top:.0em;}
       
    `;
    Functions.createStyle('Project_hfdi_style', styleTags);
};





/*
 ######   #######  ##    ## ######## ######## ##    ## ########
##    ## ##     ## ###   ##    ##    ##       ###   ##    ##
##       ##     ## ####  ##    ##    ##       ####  ##    ##
##       ##     ## ## ## ##    ##    ######   ## ## ##    ##
##       ##     ## ##  ####    ##    ##       ##  ####    ##
##    ## ##     ## ##   ###    ##    ##       ##   ###    ##
 ######   #######  ##    ##    ##    ######## ##    ##    ##
*/
/**
 * This function is used to render the content of the page
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
    <div id=ProjectWrapper>
       <div id=ProjectContent></div>
       <div id=ProjectAppointments></div>
       <textarea rows="50" id=debug></textarea>
    </div>`;
    await Functions.setInnerHTML('main', innerHTML);
}


/*
##        #######   ######   #### ##    ##
##       ##     ## ##    ##   ##  ###   ##
##       ##     ## ##         ##  ####  ##
##       ##     ## ##   ####  ##  ## ## ##
##       ##     ## ##    ##   ##  ##  ####
##       ##     ## ##    ##   ##  ##   ###
########  #######   ######   #### ##    ##
*/
let ProjectContent = async(id) => {
    Functions.getAPIdata('get_project/' + id)
        .then((res) => {
            if (res.code === 200) {
                let data = res.data
                    // deb(data);
                document.getElementById('debug').innerHTML = JSON.stringify(data, undefined, 4);

                let innerHTML = /*HTML*/ `
                    <div id=ProjectHeader>
                        <h2 data-lang="H_project">Project: </h2>
                        <h2>&nbsp; ${data.title}</h2>
                    </div>
                        <h3><a href="#customer/profile/${data.customer_id}"> ${data.customername}</a></h3>
                    <div id=ProjectBody>
                        <div id=ProjectText>
                            <div class="FF-row">
                                <div class="FF-item" style="min-width:400px; flex-basis:550px; max-width:600px;">
                                    <textarea id="comment" class="hideEdit" name="comment" type="textarea" placeholder="" data-db="comment/customer/id/5" required="">${data.comment_staff}</textarea>
                                    <label data-lang="F_comment" for="comment">Comment</label>
                                </div>
                            </div>
                        </div>
                        <div id=ProjectAppointments>
                            ${showAppointments(data.appointments)}
                        </div>
                    </div>
                `;
                Functions.setInnerHTML('ProjectContent', innerHTML);

            } else {
                document.getElementById('ProjectFormError').innerHTML = res.message;
            }
        })
        .then(() => {});

}
let showAppointments = (Appointments) => {
    deb(Appointments)
        // make an array of all appointments 
        // <a href="#Appointment-id:${date.appointment_post_id}">${moment(date.date).format('DD.MM.YYYY HH:mm')}</a>
    var dates = [];
    if (Appointments) {


        // sort by date
        dates = Appointments.sort(function(a, b) {
            return new Date(b.start_time) - new Date(a.start_time);
        });
        deb(dates)

        // create table
        let HTML = /*HTML*/ `
            <table class=dataTable>
                <div id=Appointments>
                    <h3>Appointments</h3>`;
        dates.forEach((date) => {
            HTML += /*HTML*/ `<tr>
                            <td class=numeric >
                                <a href="#Appointment-id:${date.id}">${date.start_time}</a>
                            </td>
                        </tr>`;
        });
        HTML += /*HTML*/ `</div></table>`;

        return HTML;
    } else {
        return '';
    }

}