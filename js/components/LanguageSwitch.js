import Functions from '../Functions.js';
import LanguageFile from './LanguageFile.js';

export default {
    render: async() => {
        await Style();
        await Content();
        Switch();
        Init();



    },
};



/**
 * STYLE
 */
let Style = async() => {
    let styleTags = /*CSS*/ `
    #selectLanguageDIV{
        position: absolute;
        top:10px;
        left:50%;
        z-index: 6;
        width: 50px;
    }
 
    `;
    Functions.createStyle('UserProfile_style', styleTags);
};



/**
 * CONTENT
 */
let Content = async() => {
    let innerHTML = /*HTML*/ `
        <select id="selectLanguage" autocomplete="off">
            <option value="en">🇬🇧</option>
            <option value="de">🇩🇪</option> 
        </select> `;
    await Functions.setInnerHTML('selectLanguageDIV', innerHTML);
};


/**
 * SWITCH
 */
let Switch = async() => {
    document.body.addEventListener('change', (el) => {
        if (el.target && el.target.id === 'selectLanguage') {
            // deb(el.target.value)
            changeLanguage(el.target.value);
        }
    });
};



/**
 * INIT
 */
let Init = async() => {
    let lanForm = Functions.getLocal("UserLanguage");
    document.getElementById('selectLanguage').value = lanForm;
    changeLanguage(lanForm)
};



/**
 * It changes the language of the page.
 * @param lanForm - The language code that the user has chosen.
 */
function changeLanguage(lanForm) {
    // deb('changeLanguage');
    let langObj = LanguageFile;

    let UserLanguage = 'en'
    if (lanForm) {
        UserLanguage = lanForm
    } else if (typeof Functions.getLocal("UserLanguage") !== 'undefined') {
        UserLanguage = Functions.getLocal("UserLanguage")
    } else {
        var userLang = navigator.language || navigator.userLanguage;
        UserLanguage = userLang.substr(0, 2).toLowerCase()
    }
    if (UserLanguage in langObj) {
        Functions.setLocal("UserLanguage", UserLanguage);
    }

    // check if language exists
    if (typeof langObj[UserLanguage] !== 'undefined') {
        let langFields = document.querySelectorAll('[data-lang]');
        for (let i = 0; i < langFields.length; i++) {
            const el = langFields[i];
            if (typeof langObj[UserLanguage][el.dataset.lang] !== 'undefined') {
                el.innerHTML = langObj[UserLanguage][el.dataset.lang];
            } else {
                el.innerHTML = langObj['en'][el.dataset.lang];
            }
        }
        // change page title
        if (typeof langObj[UserLanguage]['title'] !== 'undefined') {
            document.title = langObj[UserLanguage]['title'];
        }
        // change page description
        if (typeof langObj[UserLanguage]['description'] !== 'undefined') {
            document.querySelector('meta[name="description"]').setAttribute("content", langObj[UserLanguage]['description']);
        }
    }
} //function