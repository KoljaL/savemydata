import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: (data) => {
        addEvents(data);
        // deb(data)
        Style();
        return /*HTML*/ `
        <div id=ShareItem data-shared_id="${data.shared_id}" data-type="${data.type}">
            <details open>
            <summary id=loadSharings><span data-lang="H_sharing">Sharing</span></summary>
                    <div class="boxShadow FF-row content">
                        <div style="display:flex;">
                            <div class="FF-item" style="min-width:150px; flex-basis:150px; max-width:300px; margin-bottom:0;">
                                <input id="shareWith" class=boxShadow name="shareWith" type="text" placeholder="Email" value="staff0@staff.org" required="">
                                <label for="shareWith">Share With</label>
                            </div>
                            <div class="FF-item" style="min-width:50px; flex-basis:50px; max-width:80px;">
                                <input type="checkbox" id="can_edit" name="can_edit">
                                <label for="can_edit">Can Edit</label>
                            </div>
                        </div>
                        <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 50px; margin-top: .5em;">
                            <input id="shareWithSubmit" class=boxShadow  type="submit" value="Send">
                        </div>
                        <div style="display:flex;width:100%;">
                            <div class="FF-item"style="min-width:100px; flex-basis:150px; max-width:300px; margin-bottom:0;">
                                <label class="isTop">Sharings</label>
                                <select id=Sharings class="boxShadow"  name="Sharings" /></select>
                            </div>
                        </div>
                        <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 50px; margin-top: .5em;">
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
        min-width: 310px;
        width: 310px;
        max-width: 310px;
    }
    #ShareItem div.FF-item{
        margin: 1em .5em;
    }
    #ShareItem div.FF-item input[type="checkbox"]:valid + label{
        // top:.35em;
        font-size: 16px !important;
        padding-left: 0;
        left: -30px;
    }
    #ShareItem .FF-item [type="checkbox"] + label::before {
        top: 30px;
        left: 30px;
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
    #ShareItem summary>span{
        pointer-events: none;
    }


    `;
    Functions.createStyle('ShareItems_jstz_style', styleTags);
};


let addEvents = () => {

    // add eventListener only once!
    if (body.getAttribute('shareWithEvent') !== 'true') {
        body.setAttribute('shareWithEvent', true)
        body.addEventListener('click', shareWith)
    }

    function shareWith(el) {
        var shareData = {};

        // deb(shareData)

        // load sharings at opening the summary
        if (el.target.id === 'loadSharings') {
            shareData = loadShareData();
            loadSharings(shareData);
        }

        /**
         * 
         * The event handler for the submit button.
         * 
         */
        if (el.target.id === 'shareWithSubmit') {
            shareData = loadShareData();
            if (document.getElementById('shareWith').value) {
                if (Functions.ValidateEmail(shareData.sharingEmail)) {
                    Functions.getAPIdata('share_item/' + shareData.type, shareData)
                        .then((res) => {
                            if (res.code === 200) {
                                loadSharings(shareData);
                                let data = res.data
                                if (data.state === 'new') {
                                    Message.success(shareData.type + ' <b>' + data.itemName + '</b> shared with<b> ' + data.staffName + '</b>');
                                } else if (data.state === 'update') {
                                    Message.success(shareData.type + ' <b>' + data.itemName + '</b> updated');
                                }
                                // deb(res)
                            } else if (res.code === 400) {
                                Message.warn('Email not found: ' + shareData.sharingEmail);
                            }
                        });
                } else {
                    Message.error('not a valid Email: ' + shareData.sharingEmail);
                }
            }

        }
        /**
         * 
         * The event handler for the remove button.
         * 
         */
        if (el.target.id === 'removeShareSubmit') {
            let removeItem = document.getElementById('Sharings').value;
            shareData = loadShareData();
            // deb(removeItem)
            // deb(shareData)
            Functions.getAPIdata('remove_sharing/' + shareData.type.toLowerCase() + '/' + removeItem)
                .then(() => {
                    shareData = loadShareData();
                    loadSharings(shareData);
                })

        }
    }


    /**
     * 
     * It gets the sharings of the current user and displays them in the dropdown
     * 
     */
    function loadSharings(shareData) {
        deb(shareData)
        Functions.getAPIdata('load_sharings/' + shareData.type.toLowerCase() + '/' + Functions.getLocal('id'))
            .then((res) => {
                if (res.code === 200) {
                    let data = res.data
                    deb(data)
                    document.getElementById('Sharings').innerHTML = Object.keys(data)
                        .map((key) => `<option value="${data[key].id}">${data[key].itemName} with ${data[key].staffName}</option>`).join('');
                } else {
                    document.getElementById('Sharings').innerHTML = '';
                }
            });
    }

    /**
     * It loads the data from the form into the shareData object
     */
    function loadShareData() {
        let shareData = {};
        shareData.type = document.getElementById('ShareItem').getAttribute("data-type");
        shareData.shared_id = document.getElementById('ShareItem').getAttribute("data-shared_id");
        shareData.sharingEmail = document.getElementById('shareWith').value;
        shareData.can_edit = document.getElementById('can_edit').checked;
        return shareData;
    }
};