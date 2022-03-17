import Functions from '../Functions.js';

let Form2 = {
    render: async() => {
        Functions.pageTitle(`Form2`)
        await Style();
        await Content();
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
        #Form2Wrapper {
       
        } 
        .container {
            display: flex;
            flex-wrap: wrap;
            /* Standardwert = nowrap */
        }
        
        .item {
            flex-basis: 200px;
            flex-grow: 1;
            flex-shrink: 1;
            /* width: 200px; */
            min-width: 100px;
            max-width: 300px;
            height: 50px;
            margin: 1em;
        }
        
        .small .item {
            max-width: max-content;
        }
        
        label {
            font-size: 1.5em;
            font-family: 'Zilla Slab Medium', sans-serif;
            font-weight: 400;
        }
        
        input[type="text"] {
            width: 100%;
            color: var(--font_0);
            background: var(--bg_2);
            border: 1px solid var(--border_0);
            font-size: 1.3em;
            line-height: 1.2em;
        }
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
    <div id=Form2Wrapper>
            
        <div class="container">

        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>
        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>
        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>
        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>
        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>
        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>
        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>
        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>
        <div class="item">
            <label for="city">City</label>
            <input id="city" type="text" name="city" />
        </div>

        </div>
    </div>`;
    await Functions.setInnerHTML('main', innerHTML);
}