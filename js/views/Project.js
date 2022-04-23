import Functions from '../Functions.js';
import Images from '../components/Images.js';
import AppointmentsList from '../components/AppointmentsList.js';
import ShareItem from '../components/ShareItem.js';

let Project = {
    render: async(id) => {
        window.isAllowed = true;
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
        #ProjectContent h3,
        #ProjectContent summary{
            margin-top:.0em;
        }
        #ProjectText .FF-row{
            margin:0 0 1em 0;
            padding:0;
        }
        #ProjectText .FF-item{
            margin: 0;
        }
   


        #deleteProjectButton:empty,
        #editProjectButton:empty{
            border: none;
            outline: none;
            background: transparent;
        }
        #deleteProjectButton,
        #editProjectButton{ 
            font-size: 14px;
            cursor:pointer;
            color: var(--font_0);
            // background: var(--bg_3);
            line-height: 1.2em;
            padding: 0.3em .3em .2em .4em;
            // outline: var(--border_0) solid 1px;
            transition: all 0.5s ease-in-out;
            // border-radius: 0.2em;
            font-size: 1em;
            margin-left: 1em;
        }
        #deleteProjectButton:hover{
            color: var(--fontRed);
        }
         
        #editProjectButton:hover{
            color: var(--fontBlue);
        }

        .ProjectSharings{
            margin-left: auto;
        }
        .small .ProjectSharings,
        .medium .ProjectSharings{
            margin-left: 0;
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
    <div id=ProjectWrapper>
       <div id=ProjectContent></div>
       <div id=ProjectAppointments></div>
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
                    let data = res.data;
                    // deb(data);
                    Functions.pageTitle(`Project ${data.title}`)
                    let shared_staff = '';
                    if (data.shared) {
                        shared_staff = `shared from ${data.shared.user_name}`;
                    }
                    // deb(data.comment_staff)
                    let rows = data.comment_staff.split('\n').length;
                    // deb(rows)
                    let innerHTML = /*HTML*/ `
                    <div id=ProjectHeader>
                        <div class=Headline>
                            <h2 data-lang="H_project">Project:</h2>
                            <h2>&nbsp; ${data.title}</h2><br>
                            <h4>&nbsp; ${shared_staff}</h4><br>
                        </div>
                        <div class="ActionButtons">
                            <span class=boxShadow id="editProjectButton"></span>
                            <span class=boxShadow id="deleteProjectButton"></span>
                        </div>        
                    </div>
                    <h3>Customer: <a href="#customer/profile/${data.customer_id}"> ${data.customername}</a></h3>
                    <div id=ProjectBody>
                        <div id=ProjectText>
                        <h3 data-lang="F_comment">Comment</h3>
                            <div class="FF-row">
                                <div class="FF-item boxShadow" style="min-width:250px; flex-basis:550px; max-width:100%;">
                                    <textarea id="comment" rows="${rows}" style="height: max-content;" class="hideEdit" name="comment" type="textarea" placeholder="" data-db="comment_staff/project/id/${id}" required="">${data.comment_staff}</textarea>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex;gap: 2em;flex-wrap: wrap;flex-wrap: wrap;">
                            <div id=ProjectAppointments></div>
                            <div id=ProjectImages>
                                <h3 data-lang="F_images">Images</h3>
                                <div id=thumbnails></div>
                                <div id=fileUpload></div>
                                ${Images.render({origin: 'project',origin_id:data.id})}
                            </div>
                            <div class="ProjectSharings">
                                ${ShareItem.render({type:'Project',shared_id: data.id})}
                            </div>  
                        </div>
                    </div>
                `;
                    Functions.setInnerHTML('ProjectContent', innerHTML);

                    return data;
                } else if (res.code === 403) {
                    isAllowed = false;
                    document.getElementById('ProjectContent').innerHTML = res.message;
                }
            })
            // show Appointments
            .then((data) => {
                let app = AppointmentsList.render(data.appointments)
                Functions.setInnerHTML('ProjectAppointments', app);
                return data;
            })
            // # tets
            // edit and delete button
            //
            .then((data) => {
                // if (Functions.getLocal('role') === 'admin' || Functions.getLocal('id') === data.staff_id) {
                if (isAllowed && Functions.getLocal('role') !== 'xxx') {
                    Functions.setInnerHTML('editProjectButton', 'Edit')
                        .then(() => {
                            document.getElementById('editProjectButton').dataset.lang = 'edit'

                            document.getElementById('editProjectButton').addEventListener('click', function() {
                                document.querySelectorAll('#ProjectText input,#ProjectText textarea, #ProjectImages .thumbnailWrapper').forEach((input) => {
                                    // make fields editable
                                    input.classList.toggle('hideEdit');
                                    // updata db on focusout
                                    input.removeEventListener('focusout', singeEditEvent)
                                    input.addEventListener('focusout', singeEditEvent)


                                });
                            });
                        });

                    // set text, make the button visible
                    Functions.setInnerHTML('deleteProjectButton', 'Delete');
                    document.getElementById('deleteProjectButton').dataset.lang = 'delete'

                    document.getElementById('deleteProjectButton').addEventListener('click', function() {
                        Functions.getAPIdata(`delete_entry_in/project/${id}`)
                            .then((res) => {
                                // deb(res);
                                if (res.code === 200) {
                                    Message.warn('Project removed');
                                    window.location.hash = '#project/table/';
                                }
                            });
                    });
                }
            });

    } //ProjectContent

var singeEditEvent = function singleEdit(el) {
    // update a single value in db
    Functions.singleEdit(el.target);
};