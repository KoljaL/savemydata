import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    text: (value, id) => {
        let data = [
            { value: '1', lang: 'F_offered', text: 'Offered' },
            { value: '2', lang: 'F_approved', text: 'Approved' },
            { value: '3', lang: 'F_deposit_paid', text: 'Deposit Paid' },
            { value: '4', lang: 'F_full_paid', text: 'Full Paid' },
        ];
        let preset, options = '';

        data.forEach(function(key, i) {
            preset = (i === value - 1) ? 'selected' : '';
            options += `<option value="${key.value}" ${preset}>${key.text}</option>`;
        });

        return /*html*/ ` 
            <select id="state" class="hideEdit boxShadow" name="state" type="text" placeholder="" value="${value}" data-db="state/appointment/id/${id}" required="">
                ${options}
            </select>`;
        LanguageSwitch.render();
    },
};