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
        #SharingsWrapper h2{
            margin-top:2em;
        } 
        #SharingsWrapper #TableHeader .FF-item {
            margin-top: 1.8em;
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
    </div>`;
    await Functions.setInnerHTML('main', innerHTML);
}


/**
 * It gets all the data from the API and then renders it in the table
 */
let Data = async() => {
    let data;
    data = await Functions.getAPIdata('all_sharings')
    data = data.data;

    if (data.customers) {
        Functions.setInnerHTML('sharedCustomer', `${await CreateTable.render(data.customers,'customer')}`);
    }
    if (data.projects) {
        Functions.setInnerHTML('sharedProject', `${await CreateTable.render(data.projects,'project')}`);
    }
    if (data.appointments) {
        Functions.setInnerHTML('sharedAppointment', `${await CreateTable.render(data.appointments,'appointment')}`);
    }


};