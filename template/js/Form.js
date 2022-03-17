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

        // create input element 
        let width = d.width || 'inherit';
        let min = d.min || 'inherit';
        let max = d.max || 'inherit';
        let input = /*HTML*/ `
        <div class="FF-item" style="flex-basis:${width};max-width:${max};min-width:${min};">
            <input id=${d.name} name=${d.name} type="${d.type}" placeholder="${d.placeholder}" value="${d.value}" required>
            <label for=${d.name}>${d.label}</label>
        </div>`;

        return input;
    },

};

export default Forms;