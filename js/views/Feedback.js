import Functions from '../Functions.js';

let Feedback = {
    render: async() => {

        Functions.pageTitle(`Feedback`)
        await Style();
        await Content();
        await Events();
    }
};

export default Feedback;



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
        #FeedbackWrapper {
            padding:1em;
        } 
        #FeedbackWrapper li{
            padding:.5em;
            margin-left:1em;
        } 
       
    `;
    Functions.createStyle('Feedback_sowj_style', styleTags);
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
    <div id=FeedbackWrapper>
    <h2 data-lang="F_feedback">Feedback</h2>
        <div class="FF-item" style="min-width:250px; flex-basis:550px; max-width:100%;">
            <textarea id="feedback" rows="10" style="height: max-content;" class="boxShadow" name="feedback" type="textarea"   required=""> </textarea>
        </div>
        

    <div class="FF-item" style="flex-basis: 150px; min-width: 100px; max-width: 50px; margin-top: .5em;">
        <input id="sendFeedbackSubmit" class=boxShadow  type="submit" value="Send">
    </div>
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
let Events = async() => {
    document.getElementById('sendFeedbackSubmit').addEventListener('click', async function(event) {
        event.preventDefault();
        let mailData = {};
        mailData.mailBody = document.getElementById('feedback').value;
        mailData.userId = Functions.getLocal('id');
        Functions.getAPIdata('send_feedback', mailData)
            .then((res) => {
                // deb(res);
                if (res.code === 200) {
                    deb(res);
                    Message.success('Thank you <b>' + res.data.username + '</b> for your message!');

                } else {
                    // document.getElementById('FeedbackFormError').innerHTML = res.message;
                }
            })
    });
}