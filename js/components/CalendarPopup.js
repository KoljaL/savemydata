import Functions from '../Functions.js';
// import CustomerListSelect from '../components/CustomerListSelect.js';
// import StaffListSelect from '../components/StaffListSelect.js';
import UserList from '../components/UserList.js';

let Style = async() => {
    let styleTags = /*CSS*/ `
        #CreateAppointmentPopup {
            width: max-content;
            position: relative;
            top: -15px;
        }
        #CreateAppointmentPopup textarea {
            width: 400px;
        }
        #CreateAppointmentPopup button{
            height: 29.6px;
            width:100px;
        } 
        #customerProjects {
            width: 400px;
        }
    `;
    Functions.createStyle('CreateAppointmentPopup', styleTags);
};

let CreateAppointmentPopup = {

    render: async(schedule = null) => {
        await Style();

        return /*HTML*/ `
            <div id="CreateAppointmentPopup" class="template">
                <fieldset>
                    <legend id=ApPoLegend>Create new Appointment</legend>
                    <form id="CreateAppointmentPopupForm" action="" method="post" autocomplete="off">
                        <input name=id type=hidden id=ApPoID value=''>
                        <div class="InputElement">
                            <label class="isTop">Staff</label>
                            ${await UserList.render('dropdown', 'staff')}
                        </div>
                        <div class="InputElement">
                            <label class="isTop">Title</label>
                            <input id=ApPoTitle type="text" name="title" value="" />
                        </div> 
                        <div class="InputElement">
                            <label class="isTop">Customer</label>
                            ${await UserList.render('dropdown', 'customer')}
                        </div>
                        
                        <div class="InputElement">
                            <label class="isTop">Project</label>
                            <select id="customerProjects" name="project_id"></select>
                        </div>
                        <div class=inputGroup>
                            <div class="InputElement">
                                <label class="isTop">Date</label>
                                <input id=ApPoDate type="date" name="start_date" value="" />
                            </div> 
                            <div class="InputElement">
                                <label class="isTop">Time</label>
                                <input id=ApPoTime type="time" name="start_time"  value=""/>
                            </div>
                            <div class="InputElement">
                                <label class="isTop">Duration</label>
                                <select id=ApPoDuration name="duration" />
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
                        <div class="TextareaElement">
                            <label class=isTop>Comment</label>
                            <textarea id=ApPoText type="textarea" name="comment" placeholder="No newsletter please..."></textarea>
                        </div>

                        <button id="CreateAppointmentPopupSubmit" class="button">Create</button>
                    </form>
                </fieldset>
            </div>
        `;
    }
};

export default CreateAppointmentPopup;