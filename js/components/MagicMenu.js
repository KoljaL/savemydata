import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: async(type, table) => {
        Style();
        await Content();
        Events();
        LanguageSwitch.render();
    }

};

let Content = async() => {
        let innerHTML = /*html*/ ` 
          <div class="MagicMenu ">
              <div class="boxShadow MMlink" id="MagicMenuButton" data-lang="F_magicMenu">
              magic Menu</div>
              <div id="MagicMenuContent" class="MagicMenu-content boxShadow">
              <span>NEW</span>
                <a href="#customer/new"><span class="icon users_icon"></span>Customer</a>
                <a href="#staff/new" id=newStaff></a>
                <a href="#project/new"><span class="icon project_icon"></span>Project</a>
                <a href="#appointment/new"><span class="icon appointment_icon"></span>Appointment</a>
              <span>EXTRA</span>
                <a href="#sharings"><span class="icon share_icon"></span>Sharings</a>
              </div>
          </div>`;
        await Functions.setInnerHTML('MagicMenu', innerHTML);

    }
    /**
     * STYLE
     */
let Style = async() => {
    let styleTags = /*CSS*/ `
    #MagicMenu{
      margin-left:auto;
      margin-right:3em;
    }
    .small #MagicMenu{
      margin-right:7em;
    }

    #MagicMenuButton {
      background: var(--bg_3);
      padding: .5em;
      white-space: nowrap; 
      cursor:pointer;
    }
    #MagicMenuButton:hover{
      color:var(--fontBlue);
    }
     
    .MagicMenu {
      float: right;
      position: relative;
      display: inline-block;
    }
    
    .MagicMenu-content { 
      outline: black solid 0px!important;
      position: absolute;
      min-width: 160px;
      overflow: hiddens;
      right: 0px;
      z-index: 1;
      background: var(--bg_3);
    }
    .showMenu.MagicMenu-content {
      overflow: auto;
      outline: black solid 1px!important;
      padding-bottom: .5em;
    }
    .MagicMenu-content > * {
      color: var(--font_0);
      text-decoration: none;
      display: block;
      height: 0;
      overflow: hidden;
    }

    .showMenu.MagicMenu-content >* {
      padding: .5em;
      height: 35px;
    }

    .showMenu.MagicMenu-content >span {
      padding-top: 1em;
      font-family: 'Zilla Slab', sans-serif;
      font-weight:bold;
    }
 
    .MagicMenu a:hover {
      color: var(--fontBlue);
    }

    .MagicMenu a .icon {
      margin-right: 10px;
      position: relative;
      top: 4px;
    }
    .MagicMenu a:hover .icon {
    background: var(--fontBlue);
    }

    #newStaff:empty{
      display:none;
    }
    `;
    Functions.createStyle('Upload_Images_hdze_style', styleTags);
};
let Events = async() => {
    // admin can create new staffs 
    if (Functions.getLocal('role') === 'admin') {
        let innerHTML = /*HTML*/ `<span class="icon user_icon"></span>Staff `;
        await Functions.setInnerHTML('newStaff', innerHTML);
    }
    // add eventListener only once!
    if (body.getAttribute('magicMenuEvent') !== 'true') {
        body.setAttribute('magicMenuEvent', true)
        body.addEventListener('click', magicMenu)
    }

    function magicMenu(el) {
        if (el.target.id === 'MagicMenuButton') {
            // deb(document.getElementById('MagicMenuContent').classList)
            document.getElementById('MagicMenuContent').classList.toggle("showMenu");
        } else {
            document.getElementById('MagicMenuContent').classList.remove("showMenu");
        }
    }
};