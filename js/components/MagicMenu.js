import Functions from '../Functions.js';
import LanguageSwitch from './LanguageSwitch.js';

export default {
    render: async(type, table) => {
        Style();
        Events();
        Content();
        LanguageSwitch.render();
    }

};

let Content = async() => {
        let innerHTML = /*html*/ ` 
          <div class="dropdown ">
              <div class="boxShadow MMlink" id="MagicMenuButton" data-lang="F_magicMenu">
              magic Menu</div>
              <div id="myDropdown" class="dropdown-content boxShadow">
              <span>NEW</span>
                <a href="#Customer"><span class="icon users_icon"></span>Customer</a>
                <a href="#Project"><span class="icon project_icon"></span>Project</a>
                <a href="#Appointment"><span class="icon appointment_icon"></span>Appointment</a>
              <span>EXTRA</span>
                <a href="#Sharings"><span class="icon share_icon"></span>Sharings</a>
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
      // font-family: 'Zilla Slab', sans-serif;
      // font-weight:bold;
      // font-size: 1.1em;
      cursor:pointer;
    }
    #MagicMenuButton:hover{
      color:var(--fontBlue);
    }
    .dropbtn {
      background-color: #04AA6D;
      color: white;
      padding: 16px;
      font-size: 16px;
      border: none;
      cursor: pointer;
    }
     
    .dropdown {
      float: right;
      position: relative;
      display: inline-block;
    }
    
    .dropdown-content { 
      outline: black solid 0px!important;
      position: absolute;
      min-width: 160px;
      overflow: hiddens;
      right: 0px;
      z-index: 1;
      background: var(--bg_3);
    }
    .showMenu.dropdown-content {
      overflow: auto;
      outline: black solid 1px!important;
      padding-bottom: .5em;
    }
    .dropdown-content > * {
      color: var(--font_0);
      text-decoration: none;
      display: block;
      height: 0;
      overflow: hidden;
    }

    .showMenu.dropdown-content >* {
      padding: .5em;
      height: 35px;
    }

    .showMenu.dropdown-content >span {
      padding-top: 1em;
      font-family: 'Zilla Slab', sans-serif;
      font-weight:bold;
    }
 
    
    .dropdown a:hover {
      color: var(--fontBlue);
    }

    .dropdown a .icon {
      margin-right: 10px;
      position: relative;
      top: 4px;
    }
    .dropdown a:hover .icon {
    background: var(--fontBlue);
    }
    `;
    Functions.createStyle('Upload_Images_hdze_style', styleTags);
};
let Events = async(table) => {
    // add eventListener only once!
    if (body.getAttribute('magicMenuEvent') !== 'true') {
        body.setAttribute('magicMenuEvent', true)
        body.addEventListener('click', magicMenu)
    }

    function magicMenu(el) {
        if (el.target.id === 'MagicMenuButton') {
            deb(document.getElementById('myDropdown').classList)
            document.getElementById('myDropdown').classList.toggle("showMenu");
        } else {
            document.getElementById('myDropdown').classList.remove("showMenu");
        }
    }
};