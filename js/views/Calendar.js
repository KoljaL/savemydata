import Functions from '../Functions.js';
// import '../components/Moment.js';
// import '../components/TUICalendar.js';
// import Calendar from '../components/TUICalendar.js';
// var Calendar = require('../components/TUICalendar.js');
let Calendar_exp = {
    render: async() => {

        Functions.pageTitle(`Calendar`)
        Style();
        await loadHTML();
        // await loadData();
        await loadCalendar();
    }
};

export default Calendar_exp;



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
        #CalendarWrapper {
            padding:1em;
        } 
        #CalendarWrapper li{
            padding:.5em;
            margin-left:1em;
        } 

        #toggleView a{
            cursor:pointer;
        }
        #menu .button{
            width: max-content
        }
        #menu span{
            padding-left:2em
        }
        #calendar {
            position: relative;
            //left: -20px;
            right: 0;
            bottom: 5px;
            top: 20px;
        }
        #renderRange{
            font-size: 1.5em;
            position: relative;
            top: 5px;
        }
        #lnb-calendars{
            padding-top:1em;
            padding-left:1em;
            width: 80% !important;
            margin: 1em;
            outline: var(--InputBorder) solid 1px;
            box-shadow: 4px 4px 0 var(--InputShadow);
        }
        #lnb-calendars>span{
            fontsize: 1.2em;
            font-weight: bold;
        }
        .lnb-calendars-item{
            padding:.5em;
            cursor:pointer;
        }
        .tui-full-calendar-timegrid-container {
            overflow: hidden;
            overflow-y: hidden;
        }
        .tui-full-calendar-dayname-container {
            overflow-y: hidden;
        }
        .tui-full-calendar-month {
           // min-height: auto;
        }
        .tui-full-calendar-week-container {
            min-height: auto;
        }
        .tui-full-calendar-timegrid-hour span {
            line-height: 20px;
            font-size: 1.5em;
        }
        .tui-full-calendar-timegrid-hour span .nullen{
            font-size: .5em;
            position: relative;
            top: -6px;
            text-decoration: underline; 
        }
        .tui-full-calendar-popup-section select{
            font-size: initial;
        }
        .tui-full-calendar-weekday-schedule-title{
            color: var(--InputText)!important;
        }
        .tui-full-calendar-month-dayname{
            border:none!important;
        }
        .tui-full-calendar-time-schedule-content,
        .tui-full-calendar-time-schedule-content-time{
            color: #000
        }
        .tui-full-calendar-month-more-title-day,
        .tui-full-calendar-month-more-title-day-label {
            color: var(--InputText);
        }
        #PopupWrapper {
            position: fixed;
            height: 100%;
            width: 100%;
            background: #00000080;
            z-index: 50;
            top: 0;
            left: 0;
        }
        #customSchedulePopup{
            position:fixed;
            box-shadow: 4px 4px 0 var(--InputShadowHover);
            background: var(--InputBackground);
            outline: var(--InputBorder) solid 1px;
            opacity: 1;
            transition: opacity 1000ms;
            position: absolute;  
            top: 50%;
            left: 50%;
            z-index: 1000;  
            transform: translate(-50%, -50%);  
        }
       
        #show_image_popup img{
            max-width: 90vw;
            height: auto;
        }
        .popupHeader{
            padding-top: 1em;
            display: flex;
            justify-content: end;
            padding-right:1em;
        }
        .popupFooter{
            padding-bottom: 1em;
            display: flex;
            justify-content: end;
            height: 1em;
            position: relative;
            top: -1em;
            padding-right:1em;
        }
        #popupDataLinks a{
            color: var(--InputText);
            padding-right: 1em;
        }
        #popupDataLinks a:hover{
            color: var(--fontGreen);
        }
        #customSchedulePopupClose{
            cursor: pointer;
            padding-right: 1em;
        }
        #customSchedulePopupEdit{
            cursor:pointer;
            padding-right: 1em;
        }
        #customSchedulePopupDrag{
            cursor:move;
            padding-right: 1em;
        }
        #customSchedulePopupDrag:hover{
            color: var(--fontGreen)
        }
        #customSchedulePopupClose:hover,
        #customSchedulePopupEdit:hover{
            color: var(--fontRed)
        }
        #customSchedulePopup .hiddenInput {
            background: transparent;
            border: none;
            outline: none;
            box-shadow: none;
            pointer-events: none;
        }
        #customSchedulePopup button{
            visibility:visible;
        }
        #customSchedulePopup button.hiddenInput {
            visibility: hidden;
        }
        #popupDataLinks > span{
            padding-left:.5em;
        }
        #popupOptions > span{
            margin-left:.5em;
        }
        
        .tui-full-calendar-weekday-grid-date{
            cursor: pointer;
        }
        .tui-full-calendar-weekday-grid-date:hover{
            font-weight: bold
        }
    `;

    Functions.createStyle('Calendar_style', styleTags);
};



/*
 ######  #### ########  ######## ########     ###    ########
##    ##  ##  ##     ## ##       ##     ##   ## ##   ##     ##
##        ##  ##     ## ##       ##     ##  ##   ##  ##     ##
 ######   ##  ##     ## ######   ########  ##     ## ########
      ##  ##  ##     ## ##       ##     ## ######### ##   ##
##    ##  ##  ##     ## ##       ##     ## ##     ## ##    ##
 ######  #### ########  ######## ########  ##     ## ##     ##
*/
let loadHTML = async() => {
    let innerHTML = /*HTML*/ `
        <div id="lnb-calendars" class="lnb-calendars">
        <span>Stafflist</span>
                <div class="lnb-calendars-item">
                    <label>
                        <input class="tui-full-calendar-checkbox-square" type="checkbox" value="all" checked>
                        <span></span>
                        <strong>View all</strong>
                    </label>
                </div>
            <div id="calendarList" class="lnb-calendars-d1"></div>
        </div> 
    `;
    await Functions.setInnerHTML('calendarSidebar', innerHTML);

    let innerHTML2 = /*HTML*/ `
    <div id="right">
        <div id="menu">
            <span id="toggleView"> 
                <a class="button" role="menuitem" data-action="toggle-daily">Daily</a>
                <a class="button" role="menuitem" data-action="toggle-weekly">Weekly</a>
                <a class="button" role="menuitem" data-action="toggle-monthly">Month</a>
            </span>
            <span id="menu-navi">
                <button type="button" class="button" data-action="move-prev"><</button>
                <button type="button" class="button" data-action="move-today">Today</button>
                <button type="button" class="button" data-action="move-next">></button>
            </span>
            <span id="renderRange" class="render-range"></span>
            <span>
                <a class="button" id="getInfo">getInfo</a>
            </span>
        </div>
        <div id="calendar"></div>
    </div>
`;
    await Functions.setInnerHTML('main', innerHTML2);
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
let getSchedules = async() => {


    Functions.getAPIdata('get_appointments_as_table')
        .then((res) => {
            // deb(res);
            if (res.code === 200) {
                let data = res.data;
                deb(data)

                var schedules = [];
                var data_length = Object.keys(data).length;
                for (let i = 0; i < data_length; i++) {
                    schedules[i] = {
                        id: data[i].id,
                        calendarId: data[i].staff_id,
                        title: data[i].customer_name,
                        body: data[i].meta,
                        category: 'time',
                        dueDateClass: '',
                        start: data[i].date_start,
                        end: data[i].date_end,
                        raw: {
                            customer_id: data[i].customer_id,
                            project_id: data[i].project_id,
                            appointment_id: data[i].id,
                            appointment_post_id: data[i].post_id,
                        },
                    };
                }
                return schedules;
            } else {}
        });

};



let loadCalendar = async() => {

    var Calendar = tui.Calendar;

    var calendar = new Calendar('#calendar', {
        defaultView: 'month',
        taskView: true,

    });

    // document.getElementById('loginSubmit').addEventListener('click', async function(event) {
    //     event.preventCalendar();
    //     // getAPIdata (endpoint, formID)
    //     Functions.getAPIdata('login', loginForm)
    //         .then((res) => {
    //             // deb(res);
    //             if (res.code === 200) {

    //             } else {
    //                 document.getElementById('CalendarFormError').innerHTML = res.message;
    //             }
    //         })
    //         .then(() => {
    //             document.getElementById('userLogout').addEventListener('click', Functions.flushLocal);
    //         });
    // });
}