import Functions from '../Functions.js';
import Images from '../components/Images.js';
import AppointmentState from '../components/AppointmentState.js';
import AppointmentsList from '../components/AppointmentsList.js';
import ShareItem from '../components/ShareItem.js';
import UserList from '../components/UserList.js';


let NewAppointment = {
    render: async(id) => {
        window.isAllowed = true;
        Functions.pageTitle(`NewAppointment`)
        await Style();
        await Content();
        await NewAppointmentContent(id);
    }
};

export default NewAppointment;



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
       
        #NewAppointmentWrapper {
            padding:1em;
        }    
        #NewAppointmentText .FF-row{
            padding: 1em 1em 1em 0;
            margin: 1em 0;
        }
        #NewAppointmentText .FF-item{
            margin: 0 1em 0 1em;
        }
 

        #NewAppointmentHeader {
            display: flex;
            justify-content:space-between;
            align-items: baseline;
            flex-wrap: wrap;
          }
    `;
    Functions.createStyle('NewAppointment_jdow_style', styleTags);
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
    <div id=NewAppointmentWrapper>
        <div id=NewAppointmentHeader>
            <h2 data-lang="New_Appointment">New Appointment</h2>
            <div style="display:flex">

            </div>     
        </div>     
        <div id=NewAppointmentText>
        <div class="FF-row">

            <div class="FF-item">
                <label class="isTop">Customer</label>
                <div id=UserProfileList></div>  
            </div>        
            <div class="FF-item" style="margin-right:1">
                <label class="isTop">Project</label>
                <select id="customerProjects" class="boxShadow" name="project_id"></select>
            </div>

            <div class="FF-item">
                <input id="title" class="boxShadow" name="title" type="text" required="">
                <label class="isTop" data-lang="F_title" for="title">Titel</label>    
            </div>
            <div class="FF-item"  style="max-width:300px;">
                <input id="location" class="boxShadow" name="location" type="text" required="">
                <label class="isTop" data-lang="F_location" for="location">Adress</label>    
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
                <div class="FF-item" style="max-width:100px;">
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
                        <option value=390>6,5</option>
                        <option value=420>7</option>
                        <option value=450>7,5</option>
                        <option value=480>8</option>
                    </select>
                </div>
            <div class="FF-item" style="min-width:150px; flex-basis:150px; max-width:150px;">
                <select id="state" class="boxShadow" name="state" type="text" placeholder="" value="3" required="">
                    <option value="1">Offered</option>
                    <option value="2">Approved</option>
                    <option value="3">Deposit Paid</option>
                    <option value="4">Full Paid</option>
                </select>
                <label data-lang="F_state" for="state" class="isTop">State</label>
            </div>
            </div>
            <div class="FF-row">
                <div class="FF-item" style="min-width:250px; flex-basis:550px; max-width:100%;">
                    <textarea id="comment" rows="6" style="height: max-content;" class="boxShadow" name="comment" type="textarea" placeholder=""  required=""></textarea>
                    <label class="isTop" data-lang="F_comment">Comment</label>    
                </div>
            </div>
        </div>
        <br>
 
        </div>   
     
    </div>`;
    await Functions.setInnerHTML('main', innerHTML);
}



let NewAppointmentContent = async(id) => {

        // deb(id);
        //get customer dropdown
        let innerHTML = await UserList.render('dropdown', 'customer');
        await Functions.setInnerHTML('UserProfileList', innerHTML);
        // if there are id`s in the url
        id = id.split(',');
        let customer_id = id[0];
        let project_id = id[1];
        // preselect cudtomer
        if (customer_id) {
            document.getElementById('customerListSelect').value = customer_id;
            getcustomerprojects(customer_id)
        }
        // preselect project
        if (project_id) {
            document.getElementById('customerProjects').value = project_id;
        }
        // change projects if customer changes
        document.getElementById('customerListSelect').addEventListener('change', (el) => {
                deb(el.target.value)
                getcustomerprojects(el.target.value)
            })
            // get adress 
        Functions.getAPIdata('get_data_from/staff/' + Functions.getLocal('id'))
            .then((res) => {
                if (res.code === 200) {
                    let data = res.data
                    document.getElementById('location').value = data[0].location
                }
            })


    } //NewAppointmentContent

/**
 * 
 * This function is used to get the projects of a customer and fill the select field
 * 
 */
function getcustomerprojects(customer_id) {
    Functions.getAPIdata('get_list_from/project/id,title,customer_id,staff_id')
        .then((res) => {
            if (200 === res.code) {
                // deb(res.data);
                // deb(customer_id)

                const customer_projects = res.data.filter(id => id.customer_id === customer_id);

                // deb(customer_projects)

                document.getElementById('customerProjects').innerHTML = Object.keys(customer_projects)
                    .map((key) => `<option value="${customer_projects[key].id}">${customer_projects[key].title}</option>`).join('');
            }
        })
} //getcustomerprojects