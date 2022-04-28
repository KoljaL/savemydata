import Functions from '../Functions.js';
import CreateTable from '../components/CreateTable.js';

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
        <div id=sharedCustomer></div>
        <div id=sharedProject></div>
        <div id=sharedAppointment></div>
        <textarea rows=100 cols=50 id=SharingsText></textarea>
    </div>`;
    await Functions.setInnerHTML('main', innerHTML);
}


/**
 * This function is used to render the content of the page
 */
let Data = async() => {
    let data;
    data = await Functions.getAPIdata('all_sharings')
    data = data.data;


    Functions.setInnerHTML('sharedCustomer', `${await CreateTable.render(data.customers,'customer')}`);
    Functions.setInnerHTML('sharedProject', `${await CreateTable.render(data.projects,'project')}`);
    Functions.setInnerHTML('sharedAppointment', `${await CreateTable.render(data.appointments,'appointment')}`);


};