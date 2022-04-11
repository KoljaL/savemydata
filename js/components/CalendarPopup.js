import Functions from '../Functions.js';
// import CustomerListSelect from '../components/CustomerListSelect.js';
// import StaffListSelect from '../components/StaffListSelect.js';
import UserList from '../components/UserList.js';

let Style = async() => {
    let styleTags = /*CSS*/ `

        #CreateAppointmentPopup textarea {
            width: 100%;
        }
        #CreateAppointmentPopup button{
            height: 29.6px;
            width:100px;
        }  
        #CreateAppointmentPopupForm{
            position:relative;
        }
        #CreateAppointmentPopupSubmit{
            display:none;
            position:absolute;
            color:var(--fontOrange);
            left: 1em;
            bottom: -2.95em;
            z-index:200;
        }

        #ApPoLegend{
            margin-bottom: 0;
            position: relative;
            top: 10px;
            left: 1em;
        }
        .small #customSchedulePopup .FF-item {
            max-width: 100%;
          }
    `;
    Functions.createStyle('CreateAppointmentPopup_hgst_style', styleTags);
};

let CreateAppointmentPopup = {

    render: async(schedule = null) => {
        await Style();

        return /*HTML*/ `
            <div id="CreateAppointmentPopup" class="template">
                    <h2 id=ApPoLegend>Create new Appointment</h2>
                    <form id="CreateAppointmentPopupForm" action="" method="post" autocomplete="off">
                        <input name=id type=hidden id=ApPoID value=''>
                        
                        <div class=FF-row>
                            <div class="FF-item">
                                <label class="isTop">Staff</label>
                                ${await UserList.render('dropdown', 'staff')}
                            </div>
                            <div class="FF-item">
                                <label class="isTop">Customer</label>
                                ${await UserList.render('dropdown', 'customer')}
                            </div>
                        </div>
                        
                        <div class=FF-row>
                            <div class="FF-item">
                                <label class="isTop">Title</label>
                                <input for="CreateAppointmentPopupForm" id=ApPoTitle type="text"  class="boxShadow" name="title" value="" />
                            </div> 
                            
                            <div class="FF-item">
                                <label class="isTop">Project</label>
                                <select id="customerProjects" class="boxShadow" name="project_id"></select>
                            </div>
                        </div>


                        <div class=FF-row>
                            <div class="FF-item" style="max-width:140px;">
                                <label class="isTop">Date</label>
                                <input id=ApPoDate type="date"  class="boxShadow" name="start_date" value="" />
                            </div> 
                            <div class="FF-item" style="max-width:95px;">
                                <label class="isTop">Time</label>
                                <input id=ApPoTime type="time"  class="boxShadow" name="start_time"  value=""/>
                            </div>
                            <div class="FF-item" style="max-width:50px;">
                                <label class="isTop">Duration</label>
                                <select id=ApPoDuration class="boxShadow"  name="duration" />
                                    <option value=30>0,5</option>
                                    <option value=60>1</option>
                                    <option value=90>1,5</option>
                                    <option value=120>2</option>
                                    <option value=150>2,5</option>
                                    <option value=180>3</option>
                                    <option value=210>3,5</option>
                                    <option value=240>4</option>
                                    <option value=270>4,5</option>
                                    <option value=300>5</option>
                                    <option value=330>5,5</option>
                                    <option value=360>6</option>
                                </select>
                            </div>
                        </div>

                        <div class=FF-row>
                            <div class="FF-item" style="max-width:100%;">
                                <label class=isTop>Comment</label>
                                <textarea id=ApPoText  type="textarea" class="boxShadow" name="comment" placeholder="No newsletter please..."></textarea>
                            </div>
                        </div>

                        <span id="CreateAppointmentPopupSubmit" class="button boxShadow">Create</span>
                    </form>
            </div>
        `;
    }
};

export default CreateAppointmentPopup;