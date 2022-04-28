import Functions from '../Functions.js';

let Sharings = {
    render: async() => {

        Functions.pageTitle(`Sharings`)
        await Style();
        await Content();
        await Data();
    }
};

export default Sharings;



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
        #SharingsWrapper {
            padding:1em;
        } 
        #SharingsWrapper li{
            padding:.5em;
            margin-left:1em;
        } 
       
    `;
    Functions.createStyle('Sharings_style', styleTags);
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
    <div id=SharingsWrapper>
 Sharings
 <textarea rows=100 cols=50 id=SharingsText></textarea>
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
let Data = async() => {

    // getAPIdata (endpoint, formID)
    Functions.getAPIdata('all_sharings')
        .then((res) => {
            if (res.code === 200) {
                let data = res.data;
                deb(res)
                deb(data)
                document.getElementById('SharingsText').innerHTML = JSON.stringify(data, undefined, 4);;

            } else {
                document.getElementById('SharingsText').innerHTML = res.message;
            }
        })
}