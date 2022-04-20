import Functions from '../Functions.js';
import Images from '../components/Images.js';
import AppointmentState from '../components/AppointmentState.js';
import AppointmentsList from '../components/AppointmentsList.js';

let Appointment = {
    render: async(id) => {
        Functions.pageTitle(`Appointment`)
        await Style();
        await Content();
        await AppointmentContent(id);
    }
};

export default Appointment;



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
        #AppointmentWrapper {
            padding:1em;
        }   
        #AppointmentHeader {
            display: flex;
            justify-content:space-between;
            align-items: baseline;
            flex-wrap: wrap;
          }
        .Headline {
            display: flex;
            justify-content: flex-start;
            align-items: baseline;
          }
        .Headline h2{margin-bottom:.0em;}
        #AppointmentContent h3{margin-top:.0em;}

       
        #AppointmentText .FF-row{
            margin:0 0 1em 0;
            padding: 2em 1em 1em 1em;
        }
        #AppointmentText .FF-item{
            margin: 0 1em 0 0;
        }


        #deleteAppointmentButton:empty,
        #editAppointmentButton:empty{
            border: none;
            outline: none;
            background: transparent;
        }
  
        #deleteAppointmentButton:hover{
            color: var(--fontRed);
        }
         
        #editAppointmentButton:hover{
            color: var(--fontBlue);
        }

        #AppointmentBody .map_icon{
            position: relative;
            top: 3px;
            width:20px; 
            height:20px;
        } 
        #locationLink,#getLocationLinkButton {
            position: relative;
            top: 4px;
          }
    `;
    Functions.createStyle('Appointment_jdow_style', styleTags);
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
    <div id=AppointmentWrapper>
       <div id=AppointmentContent></div>
       <div id=AppointmentAppointments></div>
    </div>`;
    await Functions.setInnerHTML('main', innerHTML);
}



let AppointmentContent = async(id) => {
        Functions.getAPIdata('get_appointment/' + id)
            .then((res) => {
                if (res.code === 200) {
                    let data = res.data
                        // deb(data);
                    let shared_staff = '';
                    if (data.shared) {
                        shared_staff = `shared from ${data.shared.user_name}`;
                    }
                    let map_link, map_location;
                    if (data.map_link !== '') {
                        map_link = `<a href=${data.map_link} class="icon map_icon"  target="_blanc"></a>`;
                    } else {
                        map_link = '';
                    }
                    if (data.location !== '') {
                        map_location = data.location;
                    } else {
                        map_location = data.location_staff;
                    }
                    // make rows for textarea
                    let rows = data.comment.split('\n').length + 2;
                    let innerHTML = /*HTML*/ `
                    <div id=AppointmentHeader>
                        <div class=Headline>
                            <h2 data-lang="H_appointment">Appointment: </h2>
                            <h2>&nbsp; ${data.title}</h2><br>
                            <h4>&nbsp; ${shared_staff}</h4><br>
                        </div>
                        <div class="ActionButtons">
                            <a href="api/get_appointment_as_ics/fetch/${id}"><span class="button boxShadow" id="iCalButton">iCal</span></a>
                            <span class="boxShadow button" id="editAppointmentButton"></span>
                            <span class="boxShadow button" id="deleteAppointmentButton"></span>
                        </div>        
                    </div>
                    <h3><a href="#customer/profile/${data.customer_id}"> ${data.customername}</a></h3>
                    <h4>Staff: <a href="#staff/profile/${data.staff_id}"> ${data.staffname}</a></h4>

                    <div id=AppointmentBody>
                        <div id=AppointmentText>
                            <br>
                            <div class="FF-row"  style="padding-top:1em;margin-top:-1em;">
                                <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:150px;">
                                    <input id="firstname" class="hideEdit boxShadow" name="firstname" type="date" placeholder="" value="${data.start_date}" data-db="start_date/appointment/id/${id}" required="">
                                    <label data-lang="F_date" for="firstname">Date</label>
                                </div>
                                <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:150px;">
                                    <input id="firstname" class="hideEdit boxShadow" name="firstname" type="time" placeholder="" value="${data.start_time}" data-db="start_time/appointment/id/${id}" required="">
                                    <label data-lang="F_time" for="firstname">Time</label>
                                </div>                                
                                <div class="FF-item" style="min-width:80px; flex-basis:50px; max-width:50px;">
                                    <input id="lastname" class="hideEdit boxShadow" name="lastname" type="text" placeholder="" value="${data.duration}" data-db="duration/appointment/id/${id}" required="">
                                    <label data-lang="F_duration" for="lastname">Duration</label>
                                </div> 

                                <div class="FF-item" style="min-width:150px; flex-basis:150px; max-width:150px;">
                                ${AppointmentState.text(data.state,id)}
                                    <label data-lang="F_state" for="state" class=isTop>State</label>
                                </div> 


                            </div>

                            <h3 data-lang="H_location">Location</h3>
                            <div class="FF-row" style="padding-top:1em;margin-top:-1em;">
                                <div class="FF-item" style="min-width:250px; flex-basis:550px; max-width:300px;">
                                    <input id="location" class="hideEdit boxShadow" name="location" type="text" placeholder="" value="${map_location}" data-db="location/appointment/id/${id}" required="">
                                    <label data-lang="F_location" for="location">Adress</label>    
                                </div>

                                <div class="FF-item" style="min-width:250px; flex-basis:550px; max-width:300px;">
                                    <span class="boxShadow button" id=locationLink>${map_link}</span>
                                    <span class="boxShadow button" id="getLocationLinkButton" data-lang="F_getmap">get Map</span>
                                </div>
                            </div>

                            <h3 data-lang="F_comment">Comment</h3>
                            <div class="FF-row" style="padding-top:0;margin-top:-1em;">
                                <div class="FF-item" style="min-width:250px; flex-basis:550px; max-width:100%;">
                                    <textarea id="comment" rows="${rows}" style="height: max-content;" class="hideEdit boxShadow" name="comment" type="textarea" placeholder="" data-db="comment/appointment/id/${id}" required="">${data.comment}</textarea>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div id=AppointmentImages>
                            <h3 data-lang="F_images">Images</h3>
                            <div id=thumbnails></div>
                            <div id=fileUpload></div>
                            ${Images.render({origin: 'appointment',origin_id:data.id,type:'image',name:'testname'})}
                        </div>
                    </div>`;
                    Functions.setInnerHTML('AppointmentContent', innerHTML);

                    return data;
                } else {
                    deb(res.message);
                }
            })
            //
            // edit and delete button
            //
            .then(() => {
                if (Functions.getLocal('role') !== '999') {
                    Functions.setInnerHTML('editAppointmentButton', 'Edit')
                        .then(() => {
                            document.getElementById('editAppointmentButton').dataset.lang = 'edit'

                            document.getElementById('editAppointmentButton').addEventListener('click', function() {
                                document.querySelectorAll('#AppointmentBody input,#AppointmentBody textarea,#AppointmentBody select, #AppointmentBody .thumbnailWrapper').forEach((input) => {
                                    // make fields editable
                                    input.classList.toggle('hideEdit');
                                    // updata db on focusout
                                    input.removeEventListener('focusout', singeEditEvent)
                                    input.addEventListener('focusout', singeEditEvent)
                                });
                            });
                        });

                    // set text, make the button visible
                    Functions.setInnerHTML('deleteAppointmentButton', 'Delete');
                    document.getElementById('deleteAppointmentButton').dataset.lang = 'delete'
                    document.getElementById('deleteAppointmentButton').addEventListener('click', function() {
                        Functions.getAPIdata(`delete_entry_in/appointment/${id}`)
                            .then((res) => {
                                // deb(res);
                                if (res.code === 200) {
                                    Message.warn('Appointment removed');
                                    window.location.hash = '#appointment/table/';
                                }
                            });
                    });
                    //
                    // SET LOCATION LINK
                    //
                    document.getElementById('getLocationLinkButton').addEventListener('click', () => {
                        let formData = new FormData();
                        formData.append('id', id);
                        formData.append('location', document.getElementById('location').value);
                        Functions.getAPIdata('get_geocode', formData)
                            .then((res) => {
                                if (res.code === 200) {
                                    let data = res.data
                                    deb(res);
                                    document.getElementById('locationLink').innerHTML = /*HTML*/ `<a href=${data.map_link} class="icon map_icon"  target="_blanc"></a>`;
                                }
                                if (res.code === 400) {
                                    document.getElementById('locationLink').innerHTML = /*HTML*/ `<span data-lang="location_not_found">Location not found</span>`;
                                }
                            });
                    })
                }
            });

    } //AppointmentContent

var singeEditEvent = function singleEdit(el) {
    // update a single value in db
    Functions.singleEdit(el.target);
};