import Functions from '../../Functions.js';

import Form from '../../Form.js';

let Form2 = {
    render: async() => {
        Functions.pageTitle(`Form2`)
        await Style();
        await Content();
        // createFields();
    }
};

export default Form2;



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
        #Form2Wrapper {}
         
    `;
    Functions.createStyle('Form2_style', styleTags);
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
    <div id=Form2Wrapper class="FF-form">
        <h2>Floating Form</h2>
        <form>
            <div id=insideform class="FF-row">
  
            ${Form.inputText({
                name: "Name",
                type: "text",
                widths:"100/150/300", 
                label: "Name",
                placeholder: "Placeholder",
                value: "",
            })}


            ${Form.inputText({
                name: "Lastname",
                type: "text",
                widths:"100/150/300",  
                label: "Lastname",
                placeholder: "Placeholder",
                value: "",
            })}


            ${Form.inputText({
                name: "tel",
                type: "tel",
                widths:"100/150/300",  
                label: "Phone",
                placeholder: '000-000',
                value: ''
            })}


            ${Form.inputText({
                name: "email",
                type: "email",
                widths:"100/150/300", 
                label: "Email",
                placeholder: "user@domain.org",
                value: "",
            })}


            ${Form.inputText({
                name: "password",
                type: "password",
                widths:"100/150/300", 
                label: "Password",
                placeholder: "top secret",
                value: "",
            })}


            ${Form.inputText({
                name: "date",
                type: "date",
                widths:"180/180/180", 
                label: "Date",
            })}


            ${Form.inputText({
                name: "time",
                type: "time",
                widths:"110/110/110", 
                label: "Time",
            })}
            

            ${Form.inputText({
                name: "datetime-local",
                type: "datetime-local",
                widths:"260/260/260", 
                label: "Datetime-local",
                value: '2022-03-17T14:00'
            })}
            
            
            ${Form.inputText({
                name: "number",
                type: "number",
                widths:"40/60/90",
                label: "Number",
                value: '202'
            })}
            

            ${Form.inputText({
                name: "search",
                type: "search",
                widths:"100/150/300",  
                label: "Search",
                placeholder: 'looking for...'
            })}


            </div>
        </form>
    </div>`;
    await Functions.setInnerHTML('main', innerHTML);

    // // data output
    const form = document.querySelector("form");
    let formData = new FormData(form);
    Functions.debFormData(formData)
}

// let createFields = async() => {
//     const form = document.querySelector("form");
//     const button = document.querySelector("button");
//     const insideform = document.querySelector("#insideform");



//     /**
//      * 
//      * Create an input element with the following attributes:
//      * - id - name- type- placeholder - value- required
//      * @param d - The data object that is passed to the function.
//      * 
//      */
//     function inputText(d) {
//         // console.log(d)

//         // set size for mobile view
//         if (576 > window.innerWidth) {
//             deb(window.innerWidth)
//             d.widht = '200px'
//             d.min = '200px'
//             d.max = '200px'
//         }


//         // get current date
//         if ('date' === d.type && !d.value) {
//             let date = new Date();
//             d.value = date.toISOString().substring(0, 10);
//             d.placeholder = '';
//         }
//         // get current date
//         if ('time' === d.type && !d.value) {
//             let date = new Date();
//             date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
//             d.value = date.toISOString().substring(11, 16);
//             d.placeholder = '';
//         }
//         // get current date
//         if ('datetime-local' === d.type && !d.value) {

//             let date = new Date();
//             date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
//             d.placeholder = '';
//             d.value = date.toISOString().slice(0, 16);
//         }

//         // catch undefined value
//         if (!d.value) d.value = '';

//         // create input element 
//         let input = document.createElement("div");
//         input.classList.add("FF-item");
//         input.style.flexBasis = d.width || 'inherit';
//         input.style.minWidth = d.min || 'inherit';
//         input.style.maxWidth = d.max || 'inherit';
//         input.innerHTML = /*HTML*/ `
//             <input id=${d.name} name=${d.name} type="${d.type}" placeholder="${d.placeholder}" value="${d.value}" required>
//             <label for=${d.name}>${d.label}</label>

//             `;
//         insideform.append(input);
//     }



// // data output
// // let formData = new FormData(form);
// // Functions.debFormData(formData)

// }