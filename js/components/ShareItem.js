import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: (data) => {
        // deb(data)
        // let list = getUserList(table);

        // for customer, project & appointment
        // send email to API & validate
        // if valide insert to db
        addEvents(data);
        Style();
        return /*HTML*/ `
        <div id=ShareItem>
            <details open>
            <summary><span data-lang="H_sharing">Sharing</span></summary>
                    <div class="boxShadow FF-row content">
                        <div style="width:200px; height:100px;">
                            <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:200px; margin-bottom:0;">
                                <input id="shareWith" class=boxShadow name="shareWith" type="text" placeholder="Email" required="">
                                <label for="shareWith">Share With</label>
                            </div>
                            <div class="FF-item" style="min-width:100px; flex-basis:150px; max-width:100px; margin-top:-.5em;">
                                <input type="checkbox" id="can_edit" name="can_edit" value="can_edit">
                                <label for="can_edit">Can Edit</label>
                            </div>
                        </div>
                        <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 50px;">
                            <input id="shareWithSubmit" class=boxShadow  type="submit" value="Send">
                        </div>

                        <div class="FF-item"style="min-width:100px; flex-basis:150px; max-width:200px; margin-bottom:0;">
                            <label class="isTop">Sharings</label>
                            <select id=Sharings class="boxShadow"  name="Sharings" />
                                <option value=30>Peter Pan</option> 
                                <option value=30>Peter Pan</option> 
                                <option value=30>Peter Pan</option> 
                                <option value=30>Peter Pan</option> 
                                <option value=30>Peter Pan</option> 
                            </select>
                        </div>
                        <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 50px;">
                            <input id="removeShareSubmit" class=boxShadow  type="submit" value="Remove">
                        </div>
                    </div>
            </details>
        </div>`;
    },
};


let Style = () => {
    let styleTags = /*CSS*/ `
    #ShareItem{
        padding-bottom:1em;
        min-width: 350px;
        width: 350px;
        max-width: 350px;
    }
    #ShareItem div.FF-item{
        margin: 1em .5em;
    }
    #ShareItem div.FF-item input[type="checkbox"]:valid + label{
        top:.35em;
    }
    #ShareItem .FF-row{
        padding:0;
        margin:0 0 0 0;
        display: flex;
        flex-wrap: wrap;
        border: none;
        outline: black solid 1px;
        box-shadow: none;
        border-radius: 5px;
      }

    [data-theme*="boxes"] #ShareItem .FF-row{
        border: none;
        outline: black solid 1px;
        box-shadow: 4px 4px 0 black;
        border-radius: 0;
      }
    }


    `;
    Functions.createStyle('ShareItems_jstz_style', styleTags);
};


let addEvents = (data) => {

    // add eventListener only once!
    if (body.getAttribute('shareWith') !== 'true') {
        body.setAttribute('shareWith', true)
        body.addEventListener('click', shareWith)
    }

    function shareWith(el) {
        if (el.target.id === 'shareWithSubmit') {
            if (document.getElementById('shareWith').value) {

                let sharingEmail = document.getElementById('shareWith').value;
                if (Functions.ValidateEmail(sharingEmail)) {
                    deb(data)

                } else {
                    Message.warn('not a valid Email: ' + sharingEmail);
                }
            }

        }

        if (el.target.id === 'removeShareSubmit') {

        }
    }

    // try {
    //     let staff_id = '';
    //     deb(slugName)
    //     if (tableName === 'customer') {
    //         staff_id = ',staff_id';
    //     }
    //     // staff_id = ',staff_id';

    //     const response = Functions.getAPIdata('get_list_from/' + table + '/id,username' + staff_id);
    //     return response;
    // } catch (err) {
    //     console.log('Error getting documents', err);
    // }
};