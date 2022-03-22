let Forms = {


    /**
     * 
     * Create an input element with the following attributes:
     * - id - name- type- placeholder - value- required
     * @param d - The data object that is passed to the function.
     * 
     */
    inputText: (d) => {
        // console.log(d)
        let flexWidth, hideEdit, dataDB;


        // set size for mobile view
        if (576 > window.innerWidth) {
            deb(window.innerWidth)
            d.widht = '200px'
            d.min = '200px'
            d.max = '200px'
        }

        // get current date
        if ('date' === d.type && !d.value) {
            let date = new Date();
            d.value = date.toISOString().substring(0, 10);
            d.placeholder = '';
        }
        // get current date
        if ('time' === d.type && !d.value) {
            let date = new Date();
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            d.value = date.toISOString().substring(11, 16);
            d.placeholder = '';
        }
        // get current date
        if ('datetime-local' === d.type && !d.value) {

            let date = new Date();
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            d.placeholder = '';
            d.value = date.toISOString().slice(0, 16);
        }

        // catch undefined value & placeholder
        if (!d.value) d.value = '';
        if (!d.placeholder) d.placeholder = '';

        if (d.db) {
            dataDB = ` data-db="${d.db}" `;
        }

        // get the three widths from one value
        if (d.widths) {
            const widths = d.widths.split('/');
            widths.map(function(el, i) {
                // check if a width has a size, if not add pixel
                if (!isNaN(widths[i].slice(-2))) {
                    widths[i] = widths[i] + 'px';
                }
            })
            flexWidth = /*HTML*/ `min-width:${widths[0]}; flex-basis:${widths[1]}; max-width:${widths[2]};`
                // deb(flexWidth)
        }

        if (d.edit === 'hide') {
            hideEdit = 'hideEdit'
        }
        if (d.edit === 'forbidden') {
            hideEdit = 'forbiddenEdit'
        }

        // return input element  
        if (d.type === 'text' || d.type === 'password' || d.type === 'time' || d.type === 'date' || d.type === 'datetime-local' || d.type === 'number' || d.type === 'search') {
            return /*HTML*/ `
            <div class="FF-item" style="${flexWidth}">
            <input 
            id=${d.name} 
            class="${hideEdit}"  
            name=${d.name} 
            type="${d.type}" 
            placeholder="${d.placeholder}" 
            value="${d.value}" 
            ${dataDB}
            required>
            <label for=${d.name}>${d.label}</label>
            </div>`;
        }

        // return textarea element  
        if (d.type === 'textarea') {
            return /*HTML*/ `
                    <div class="FF-item" style="${flexWidth}">
                    <textarea 
                    id=${d.name} 
                    class="${hideEdit}" 
                    name=${d.name} 
                    type="${d.type}" 
                    placeholder="${d.placeholder}" 
                    ${dataDB}
                    required>${d.value}</textarea>
                    <label for=${d.name}>${d.label}</label>
                    </div>`;
        }



    },

};

export default Forms;