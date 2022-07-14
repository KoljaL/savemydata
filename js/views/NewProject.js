import Functions from '../Functions.js';
import Images from '../components/Images.js';
import AppointmentsList from '../components/AppointmentsList.js';
import ShareItem from '../components/ShareItem.js';
import UserList from '../components/UserList.js';
import LanguageSwitch from '../components/LanguageSwitch.js';

let Project = {
    render: async(id) => {
        window.isAllowed = true;
        Functions.pageTitle(`New Project`)
        await Style();
        await Content();
        await Events(id);
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
        #NewProjectWrapper {
            padding:1em;
        }   
        #NewProjectWrapper #UserProfileList {
            width: max-content;
            float: right;
          }
        #NewProjectHeader {
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
        .Headline h2{
            margin-bottom:.0em;
        } 
        #ProjectForm .FF-row{
            display:block;
            margin:0 0 1em 0;
            padding:1em 0;
        }
      
        #ProjectForm .FF-item{
            margin-top:0;
        }
      
   

 
       
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
        <div id=NewProjectWrapper>
            <div id=NewProjectHeader>
                <h2 data-lang="H_new_project">New Project</h2> 
                <div id=UserProfileList></div>
            </div>       
            <form id=ProjectForm>

                <div class="FF-row">
                    <div class="FF-item" style="min-width:150px; flex-basis:150px; max-width:300px; margin-bottom:0;">
                        <input id="title" class=boxShadow name="title" type="text" required="">
                        <label for="title">Title</label>
                    </div>
                <br>
                    <div class="FF-item" style="min-width:250px; flex-basis:550px; max-width:100%;">
                        <textarea id="comment" rows="5" style="height: max-content;"  name="comment_staff" type="textarea" placeholder=""  required=""></textarea>
                        <label for="comment">Comment</label>
                    </div>
                </div>

                <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 50px; margin-left: 0;">
                    <input id="newProjectButton" class=boxShadow  type="submit" value="Save">
                </div>
            </form> 
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
let Events = async(id) => {

        let innerHTML = await UserList.render('dropdown', 'customer');
        await Functions.setInnerHTML('UserProfileList', innerHTML);
        if (id) document.getElementById('customerListSelect').value = id;

        if (body.getAttribute('addNewProject') !== 'true') {
            body.setAttribute('addNewProject', true)
            document.getElementById('newProjectButton').addEventListener('click', (el) => {
                    addNewProject(el)
                }

            )
        }



        function addNewProject(el) {
            el.preventDefault();
            deb(document.getElementById('customerListSelect').value)
                // send all inputfields to API & get directed to the new users profile
            if (document.getElementById('title').value !== '' && document.getElementById('customerListSelect').value !== '') {
                let ProjectForm = document.getElementById('ProjectForm');
                ProjectForm = new FormData(ProjectForm);
                ProjectForm.append('staff_id', Functions.getLocal('id'));
                ProjectForm.append('customer_id', document.getElementById('customerListSelect').value);

                Functions.getAPIdata('new_entry_in/project', ProjectForm)
                    .then((res) => {
                        deb(res)
                        if (res.code === 200) {
                            Message.success('New Project created')
                            window.location.hash = `#project/id/${res.data.id}`;
                        }
                    });
            } else {
                Message.warn('Please enter a Title and select a Customer');
            }
            LanguageSwitch.render();
        } // eventListener





    } //Events