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

        // catch undefined value
        if (!d.value) d.value = '';

        // get the three widths from one value
        let flexWidth;
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

        // return input element  
        return /*HTML*/ `
        <div class="FF-item" style="${flexWidth}">
            <input id=${d.name} name=${d.name} type="${d.type}" placeholder="${d.placeholder}" value="${d.value}" required>
            <label for=${d.name}>${d.label}</label>
        </div>`;

    },

};

export default Forms;