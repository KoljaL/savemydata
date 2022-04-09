import Functions from '../Functions.js';
import UserList from '../components/UserList.js';
import AppointmentPopup from '../components/CalendarPopup.js';

// GLOBAL VARS
var CalendarList = [];
var schedules = [];

// import CustomerListSelect from '../components/CustomerListSelect.js';

// import CustomerListSearch from '../components/CustomerListSearch.js';
// import StaffListSelect from '../components/StaffListSelect.js';

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

        #toggleView a{
            cursor:pointer;
        }
        #menu .button{
            width: max-content;
            
        }
        #menu {
            // display:flex;
            // justify-content: space-around;
            display: grid;
            grid-template-areas: 'navi range view';
            grid-template-rows: 1fr;
            grid-template-columns: 1fr 2fr 1fr;
            align-items: end;
            justify-items: center;
            padding-left:0em;
        }

        #menu #menuNavi{
            grid-area: navi; 
            white-space: nowrap;
        }
        #menu #renderRange{
            grid-area: range; 
            font-size: 1.5em;
            position: relative;
            top: 5px;
            left:.5em;
            width:250px;
            white-space: nowrap;
        }
        #menu #toggleView{
            grid-area: view;
            white-space: nowrap;
        }

        @media only screen and (max-width: 700px) {
            #menu {
                grid-template-areas: 'range range' 'navi view';
                grid-template-rows:  1fr 1fr  ;
                grid-template-columns: 1fr 1fr;
            }
            #menu #menuNavi{
                justify-self: start;
                // top: .5em;
                position: relative;
            }
            #menu #renderRange{
                justify-self: center;
                top: -.5em;
                position: relative;
            }
            #menu #toggleView{
                justify-self: end;
                // top: .5em;
                position: relative;
            }
        }


   


        #calendar {
            position: relative;
            right: 0;
            bottom: 5px;
            top: 20px;
        }
        #lnb-calendars{
            padding-top:1em;
            padding-left:1em;
            width: 80% !important;
            margin-left: -.5em;
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

        .tui-full-calendar-timegrid-timezone{
            width:0px!important;
        }
        .tui-full-calendar-dayname-leftmargin,
        .tui-full-calendar-timegrid-right{
            margin-left: 32px!important;
        }

        #PopupWrapper {
            position: fixed;
            height: 100%;
            width: 100%;
            // background: #00000080;
            z-index: 50;
            top: 0;
            left: 0;
        }

        #customSchedulePopup{
            position:fixed;
            background: var(--bg_3);
            opacity: 1;
            transition: opacity 1000ms;
            position: absolute;  
            top: 50%;
            left: 50%;
            z-index: 100;  
            transform: translate(-50%, -50%);  
        }
        .small #customSchedulePopup{
            top:60px;
            transform: translate(-50%, 0);
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
            height: 3em;
            position: relative;
            top: 1em;
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
            position: relative;
            bottom: 5px;
        }
        #menuNavi > span,
        #toggleView > span,
        #popupDataLinks > span,
        #popupOptions > span{
            margin-left:.5em;
        }

        #menuNavi > span:hover,
        #toggleView > span:hover,
        #popupDataLinks > span:hover,
        #popupOptions > span:hover{
            color: var(--fontBlue);
        }

        .tui-full-calendar-weekday-grid-date{
            cursor: pointer;

        }
        .tui-full-calendar-weekday-grid-date:hover{
            font-weight: bold
        }

        .large #calendarSidebar,
        .medium #calendarSidebar {
            position: relative;
            left: 50px;
          }
        .large.sidebar #calendarSidebar,
        .medium.sidebar #calendarSidebar {
            position: relative;
            left: 0px;
        }

        .FF-item .boxShadow{
            width:100%;
        }

    `;
    Functions.createStyle('Appointments', styleTags);
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
let Sidebar = async() => {
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
    Functions.setInnerHTML('calendarSidebar', innerHTML);
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
let Content = async() => {
    let innerHTML = /*HTML*/ `
            <div id="menu">
                <div id="menuNavi">
                    <span type="button" class="button boxShadow" data-action="move-prev"><</span>
                    <span type="button" class="button boxShadow" data-action="move-today">Today</span>
                    <span type="button" class="button boxShadow" data-action="move-next">></span>
                </div>
                <div id="renderRange" class="render-range"></div>
                <div id="toggleView"> 
                    <span class="button boxShadow" role="menuitem" data-action="toggle-daily">Daily</span>
                    <span class="button boxShadow" role="menuitem" data-action="toggle-weekly">Weekly</span>
                    <span class="button boxShadow" role="menuitem" data-action="toggle-monthly">Month</span>
                </div>
            
            </div>
            <div id="calendar"></div>
    `;
    await Functions.setInnerHTML('main', innerHTML);
};

/*
 ######   ######## ########     ######  ##          ###    ######## ##    ## ########     ###    ########
##    ##  ##          ##       ##    ## ##         ## ##   ##       ###   ## ##     ##   ## ##   ##     ##
##        ##          ##       ##       ##        ##   ##  ##       ####  ## ##     ##  ##   ##  ##     ##
##   #### ######      ##       ##       ##       ##     ## ######   ## ## ## ##     ## ##     ## ########
##    ##  ##          ##       ##       ##       ######### ##       ##  #### ##     ## ######### ##   ##
##    ##  ##          ##       ##    ## ##       ##     ## ##       ##   ### ##     ## ##     ## ##    ##
 ######   ########    ##        ######  ######## ##     ## ######## ##    ## ########  ##     ## ##     ##
*/
let getCalendars = async() => {
    await Functions.getAPIdata('get_list_from/staff/id,username,color')
        .then((res) => {
            // deb(res);
            if (200 === res.code) {
                let data = res.data
                var data_length = Object.keys(data).length;
                // deb(data)
                // if (staffCalendar) staffCalendar = undefined;
                var staffCalendar = [];
                for (var i = 0; i < data_length; i++) {
                    staffCalendar[i] = {
                        id: data[i].id,
                        name: data[i].username,
                        color: '#FFFFFF',
                        bgColor: data[i].color,
                        dragBgColor: data[i].color,
                        borderColor: data[i].color,
                    }
                }
                // deb('getCalendars Function', staffCalendar);
                // return Promise.resolve(staffCalendar);
                CalendarList.length = 0;
                staffCalendar.forEach(function(cal) {
                    CalendarList.push(cal);
                });

                return CalendarList;
            }
            // no else, so we have a chance of no extra class ;-)
            if (400 === res.code) {
                deb('no staff found')
            }
        });
}



/*
 ######   ######## ########     ######   ######  ##     ## ######## ########  ##     ## ##       ########  ######
##    ##  ##          ##       ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##       ##    ##
##        ##          ##       ##       ##       ##     ## ##       ##     ## ##     ## ##       ##       ##
##   #### ######      ##        ######  ##       ######### ######   ##     ## ##     ## ##       ######    ######
##    ##  ##          ##             ## ##       ##     ## ##       ##     ## ##     ## ##       ##             ##
##    ##  ##          ##       ##    ## ##    ## ##     ## ##       ##     ## ##     ## ##       ##       ##    ##
 ######   ########    ##        ######   ######  ##     ## ######## ########   #######  ######## ########  ######
*/
let getSchedules = async(DateRange) => {
    // deb(DateRange)

    let formData = new FormData();
    formData.append('startDate', DateRange.startDate);
    formData.append('endDate', DateRange.endDate);
    await Functions.getAPIdata('get_appointments_as_table', formData)
        .then((res) => {
            // deb(res);
            if (200 === res.code) {
                let data = res.data
                var data_length = Object.keys(data).length;
                // deb(data);
                // var schedules = [];
                schedules.length = 0;
                for (let i = 0; i < data_length; i++) {

                    // deb(data[i])

                    let startDatetime = new Date(data[i].start_date + ' ' + data[i].start_time);
                    let endDatetime = new Date(startDatetime.getTime() + data[i].duration * 60000);

                    schedules[i] = {
                        id: data[i].id,
                        calendarId: data[i].staff_id,
                        title: data[i].username + '\n' + data[i].title,
                        body: data[i].comment,
                        category: 'time',
                        isReadOnly: true,
                        dueDateClass: '',
                        start: startDatetime,
                        end: endDatetime,
                        raw: {
                            title: data[i].title,
                            staff_id: data[i].staff_id,
                            customer_id: data[i].customer_id,
                            project_id: data[i].project_id,
                            appointment_id: data[i].id,
                        },
                    };
                }
                // deb(schedules);
                return schedules;

            }
        });
};


/*
   ###    ########  ########   #######  #### ##    ## ######## ##     ## ######## ##    ## ########  ######
  ## ##   ##     ## ##     ## ##     ##  ##  ###   ##    ##    ###   ### ##       ###   ##    ##    ##    ##
 ##   ##  ##     ## ##     ## ##     ##  ##  ####  ##    ##    #### #### ##       ####  ##    ##    ##
##     ## ########  ########  ##     ##  ##  ## ## ##    ##    ## ### ## ######   ## ## ##    ##     ######
######### ##        ##        ##     ##  ##  ##  ####    ##    ##     ## ##       ##  ####    ##          ##
##     ## ##        ##        ##     ##  ##  ##   ###    ##    ##     ## ##       ##   ###    ##    ##    ##
##     ## ##        ##         #######  #### ##    ##    ##    ##     ## ######## ##    ##    ##     ######
*/
let Appointments = {
    render: async() => {
        Functions.pageTitle('Calendar')
        await Style();
        await Sidebar();
        await Content();
        await getCalendars();

        /*

        #### ##    ## #### ########     ######     ###    ##       ######## ##    ## ########     ###    ########
         ##  ###   ##  ##     ##       ##    ##   ## ##   ##       ##       ###   ## ##     ##   ## ##   ##     ##
         ##  ####  ##  ##     ##       ##        ##   ##  ##       ##       ####  ## ##     ##  ##   ##  ##     ##
         ##  ## ## ##  ##     ##       ##       ##     ## ##       ######   ## ## ## ##     ## ##     ## ########
         ##  ##  ####  ##     ##       ##       ######### ##       ##       ##  #### ##     ## ######### ##   ##
         ##  ##   ###  ##     ##       ##    ## ##     ## ##       ##       ##   ### ##     ## ##     ## ##    ##
        #### ##    ## ####    ##        ######  ##     ## ######## ######## ##    ## ########  ##     ## ##     ##

        */


        // load TUI calendar
        var Calendar = tui.Calendar;
        let cal = new Calendar('#calendar', {
            defaultView: 'week',
            taskView: false,
            scheduleView: ['time'],
            startDayOfWeek: 1,
            useCreationPopup: false,
            useDetailPopup: false,
            week: {
                daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                startDayOfWeek: 1,
                narrowWeekend: true,
                hourStart: 8,
                hourEnd: 20,
            },
            month: {
                daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                startDayOfWeek: 1,
                narrowWeekend: true,
            },
            calendars: CalendarList,
            theme: {
                'common.dayname.color': 'var(--InputText)',
                'common.today.color': 'red',
                'common.saturday.color': 'var(--InputText)',
                'common.backgroundColor': 'transparent',
                'common.border': '1px solid var(--InputText)',
                'week.dayname.height': '42px',
                'week.dayname.borderTop': 'none',
                'week.dayname.borderBottom': 'none',
                'week.dayname.borderLeft': 'none',
                'week.dayname.backgroundColor': 'inherit',
                'week.dayname.textAlign': 'center',
                'week.today.color': 'var(--InputText)',
                'week.futureTime.color': 'var(--InputText)',
                'week.pastDay.color': 'var(--LabelBorderActive)',
                'week.today.backgroundColor': 'rgba(81, 92, 230, 0.05)',
                'week.weekend.backgroundColor': 'inherit',
                'week.dayname.borderTop': 'none',
                'week.dayname.borderBottom': '1px solid var(--InputText)',
                'week.timegridLeft.backgroundColor': 'transparent',
                'week.timegridLeft.borderRight': '1px solid var(--InputText)',
                'month.dayname.borderLeft': 'none',
                'month.dayname.textAlign': 'center',
                'month.dayname.fontSize': '14px',
                'month.futureTime.color': 'var(--InputText)',
                'month.holidayExceptThisMonth.color': 'var(--InputText)',
                'month.dayExceptThisMonth.color': 'var(--InputText)',
                'month.moreView.border': '1px solid var(--FieldsetBorder);',
                'month.moreView.boxShadow': '4px 4px 0 var(--FieldsetShadow);',
                'month.moreView.backgroundColor': 'var(--FieldsetBackground)',
            },
            template: {
                timegridDisplayPrimayTime: function(time) {
                    return time.hour + '<span class=nullen>00</span>';
                },
                // timegridDisplayTime: function(time) {
                //     var meridiem = time.hour < 12 ? 'am' : 'pm';
                //     return time.hour + ' ' + meridiem;
                // },
            },
        });

        //
        // init functions
        //
        await getNewSchedules();
        setRenderRangeText();
        setEventListener();
        setCalendarList();

        /* making the calendar to be able to respond to events. */
        cal.on({
            clickSchedule: function(e) {
                // deb('clickSchedule', e);
                SchedulePopup(e, 'view');
            },
            beforeCreateSchedule: function(e) {
                // deb('beforeCreateSchedule', e);
                if (cal.getViewName() === 'week') {
                    SchedulePopup(e, 'create');
                }
                if (cal.getViewName() === 'month') {
                    cal.setDate(new Date(e.start));
                    cal.changeView('day', true);
                    setRenderRangeText();
                }
            },
        });

        /**
         * It sets up the event listeners for the menu and calendar.
         */
        function setEventListener() {
            // document.querySelector('#lnb-calendars').addEventListener('change', onChangeCalendars);
            // window.addEventListener('resize', resizeThrottled);
        }





        /*
        ########   #######  ########  ##     ## ########
        ##     ## ##     ## ##     ## ##     ## ##     ##
        ##     ## ##     ## ##     ## ##     ## ##     ##
        ########  ##     ## ########  ##     ## ########
        ##        ##     ## ##        ##     ## ##
        ##        ##     ## ##        ##     ## ##
        ##         #######  ##         #######  ##
        */
        /**
         * Create a popup window with the AppointmentPopup form
         * @param e - The event object.
         * @param mode - 'view' or 'create'
         */
        async function SchedulePopup(e, mode) {
            let schedule;

            // create popup div & load AppointmentPopup Form  into it
            var Popup = document.createElement('div');
            Popup.id = 'PopupWrapper';
            Popup.style.opacity = 0;
            Popup.innerHTML = /*HTML*/ `
                <div id=customSchedulePopup  class="boxShadow">

                    <div class=popupHeader>    
                        <span id=popupOptions>
                            <span class="button boxShadow" id=customSchedulePopupDrag>Drag</span>
                            <span class="button boxShadow" id=customSchedulePopupEdit></span>
                            <span class="button boxShadow" id=customSchedulePopupClose>Close</span>
                        </span>
                    </div>

                    <!-- Popup Form -->
                    ${await AppointmentPopup.render(schedule)}

                    <div class=popupFooter>
                        <span id=popupDataLinks>
                          <span class="button boxShadow" id=ApPoCustomerLink></span> 
                          <span class="button boxShadow" id=ApPoProjectLink></span> 
                          <span class="button boxShadow" id=ApPoAppointmentLink></span> 
                        </span>
                    </div>

                </div>`;
            document.getElementById('calendar').appendChild(Popup);

            // create drag element for Popup
            Functions.dragElement('customSchedulePopup', 'customSchedulePopupDrag');




            /**
             * 
             * When the user clicks on the close button or outside of the popup, the popup will disappear
             * 
             */
            document.getElementById('customSchedulePopupClose').addEventListener('click', closeSchedulePopup);
            document.getElementById('PopupWrapper').addEventListener('click', closeSchedulePopup);

            function closeSchedulePopup(el) {
                if (el.target.id === 'customSchedulePopupClose' || el.target.id === 'PopupWrapper') {
                    Popup.style.opacity = 0;
                    setTimeout(() => {
                        Popup.remove();
                    }, 200);
                    // remove blue-framed box from calendar
                    if (document.querySelector('.tui-full-calendar-time-guide-creation')) {
                        document.querySelector('.tui-full-calendar-time-guide-creation').remove();
                    }
                }
            };


            /**
             * 
             * fill popup with values for case view
             * 
             */
            if (e.schedule) {
                let data = e.schedule;
                // deb(data);
                let startDate = moment(data.start._date).format('YYYY-MM-DD');
                let startTime = moment(data.start._date).format('HH:mm');
                let duration = moment(data.end._date).diff(moment(data.start._date), 'minutes');

                // fill form in popup with data 
                document.getElementById('ApPoID').value = data.id;
                document.getElementById('ApPoLegend').innerHTML = data.title;
                document.getElementById('CreateAppointmentPopupSubmit').innerHTML = 'Save';
                document.getElementById('customSchedulePopupEdit').innerHTML = 'Edit';
                document.getElementById('ApPoDate').value = startDate;
                document.getElementById('ApPoTime').value = startTime;
                document.getElementById('ApPoTitle').value = data.raw.title;
                document.getElementById('ApPoDuration').value = duration;
                document.getElementById('ApPoText').innerHTML = data.body;
                // create dropdown menues and fill with options
                await CreateSchedule(data.raw.customer_id);
                // select current option in dropdown menues
                document.getElementById('staffListSelect').value = data.raw.staff_id;
                document.getElementById('customerListSelect').value = data.raw.customer_id;
                // make links to data sites
                document.getElementById('ApPoCustomerLink').innerHTML = /*HTML*/ `<a class=button href="/#customer/profile/${data.raw.customer_id}">Profile</a>`;
                document.getElementById('ApPoProjectLink').innerHTML = /*HTML*/ `<a class=button href="#project/id/${data.raw.project_id}">Project</a>`;
                document.getElementById('ApPoAppointmentLink').innerHTML = /*HTML*/ `<a class=button href="#appointment/id/${data.id}">Appointment</a>`;

                // get all formfieleds  and make them non editable
                var allInputs = document.querySelectorAll('input, select, textarea, button');
                allInputs.forEach(function(el) {
                    el.classList.toggle('hiddenInput');
                });
                // and make them editable after clicking the 'edit' button
                document.getElementById('customSchedulePopupEdit').addEventListener('click', function() {
                    allInputs.forEach(function(el) {
                        el.classList.toggle('hiddenInput');
                    });
                });
            }
            /**
             * 
             * empty popup form for case create
             * 
             */
            else {
                // create dropdown menues and fill with options
                await CreateSchedule();
                // get datetime from click
                let startDate = moment(e.start._date).format('YYYY-MM-DD');
                let startTime = moment(e.start._date).format('HH:mm');
                let duration = moment(e.end._date).diff(moment(e.start._date), 'minutes');
                // select current option in dropdown menues
                document.getElementById('ApPoDate').value = startDate;
                document.getElementById('ApPoTime').value = startTime;
                document.getElementById('ApPoDuration').value = duration;
                document.getElementById('staffListSelect').value = Functions.getLocal('id');

            }

            //
            // make popup visible
            //
            setTimeout(() => {
                Popup.style.opacity = 1;
            }, 10);

        } // SchedulePopup()



        /**
         * It creates a schedule for a customer.
         * @param customer_id - The ID of the customer you want to create a schedule for.
         */
        async function CreateSchedule(customer_id = null) {

            /**
             * if case is 'view' get projects from current customer
             * and set eventlistener for 'create' or chaange in 'view'
             */
            // get customerprojects by customer_id - case 'view'
            if (customer_id) {
                getcustomerprojects(customer_id);
            }
            // get customerprojects by list select - case 'create'
            document.getElementById('customerListSelect').addEventListener('change', function(element) {
                let customer_id = this.value;
                getcustomerprojects(customer_id);
            });


            /**
             * This function is used to get the projects of a customer and fill the select field
             * @param customer_id - The ID of the customer you want to get projects for.
             */
            function getcustomerprojects(customer_id) {
                Functions.getAPIdata('get_list_from/project/id,title,customer_id')
                    .then((res) => {
                        if (200 === res.code) {
                            // deb(res.data);
                            // deb(customer_id)

                            const customer_projects = res.data.filter(id => id.customer_id === customer_id);

                            // deb(customer_projects)

                            document.getElementById('customerProjects').innerHTML = Object.keys(customer_projects)
                                .map((key) => `<option value="${customer_projects[key].id}">${customer_projects[key].title}</option>`).join('');
                        }
                    })
            } //getcustomerprojects()



            //
            // check if form is valid (completely filles)
            //
            const appointmentForm = document.getElementById('CreateAppointmentPopupForm');
            const appointmentFormSubmit = document.getElementById('CreateAppointmentPopupSubmit');

            // eventlistner for all input fields
            for (let i = 0; i < appointmentForm.length; i++) {
                const el = appointmentForm[i];
                el.addEventListener('input', () => {
                    // ceck if all fields has a value
                    if (Functions.validForm(appointmentForm)) {
                        appointmentFormSubmit.style.display = 'block';
                    } else {
                        appointmentFormSubmit.style.display = 'none';
                    }
                })
            }


            //
            // first run on popup open, wait for values
            //
            setTimeout(() => {
                if (Functions.validForm(appointmentForm)) {
                    appointmentFormSubmit.style.display = 'block';
                } else {
                    appointmentFormSubmit.style.display = 'none';
                }
            }, 200);


            //
            // SEND APPOINTMENT FORM DATA TO API
            //
            appointmentFormSubmit.addEventListener('click', function(event) {
                event.preventDefault();
                const formData = new FormData(CreateAppointmentPopupForm);
                Functions.getAPIdata('new_entry_in/appointment', formData)
                    .then(function(res) {
                        deb(res);
                        if (res.message === 'new') {
                            Message.success(`New Appointment created `);
                        }
                        if (res.message === 'updated') {
                            Message.info(`Appointment updated`);
                        }
                        getNewSchedules();
                        document.getElementById('PopupWrapper').remove();

                    });


            });
        } // CreateSchedule()

        /*
        ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######
        ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ##
        ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##
        ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######
        ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ##
        ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ##
        ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######
        */



        /**
         * 
         * Toggle View between month, week and day
         * 
         */
        document.querySelectorAll('span[role="menuitem"]').forEach(view => {
            // deb(view)
            view.addEventListener('click', (el) => {
                // deb(el.target.dataset.action)
                let action = el.target.dataset.action;
                var options = cal.getOptions();
                var viewName = '';

                switch (action) {
                    case 'toggle-daily':
                        viewName = 'day';
                        break;
                    case 'toggle-weekly':
                        viewName = 'week';
                        break;
                    case 'toggle-monthly':
                        options.month.visibleWeeksCount = 0;
                        viewName = 'month';
                        break;
                    default:
                        break;
                }
                cal.setOptions(options, true);
                cal.changeView(viewName, true);
                setRenderRangeText();
                getNewSchedules();
            })
        });



        /**
         * When the user clicks on the navigation buttons,
         * the calendar moves to the next or previous month or to the current month
         * @param e - The event object.
         * @returns Nothing.
         */
        document.querySelector('#menuNavi').addEventListener('click', (e) => {
            var action = getDataAction(e.target);

            switch (action) {
                case 'move-prev':
                    cal.prev();
                    getNewSchedules();
                    break;
                case 'move-next':
                    cal.next();
                    getNewSchedules();
                    break;
                case 'move-today':
                    cal.today();
                    getNewSchedules();
                    break;
                default:
                    return;
            }
            setRenderRangeText();
        });



        /**
         * It gets the schedules from the database and renders them on the calendar.
         */

        async function getNewSchedules() {
            let DateRange = {
                startDate: moment(cal.getDateRangeStart().getTime()).format('YYYY-MM-DD'),
                endDate: moment(cal.getDateRangeEnd().getTime()).format('YYYY-MM-DD'),
            };
            await getSchedules(DateRange);
            cal.clear();
            cal.createSchedules(schedules);
            cal.render();
        }

        /**
         * Find the calendar with the given id
         * @param id - The id of the calendar to be retrieved.
         * @returns The first calendar in the list.
         */
        function findCalendar(id) {
            var found;
            CalendarList.forEach(function(calendar) {
                if (calendar.id === id) {
                    found = calendar;
                }
            });
            return found || CalendarList[0];
        }

        /**
         * 
         * When the user changes the checkbox for a calendar, the function changes the checkbox for that calendar and all the other calendars
         * 
         */
        document.querySelector('#lnb-calendars').addEventListener('change', (onChangeCalendars));

        function onChangeCalendars(e) {
            // deb('onChangeCalendars')
            // deb(e)
            var calendarId = e.target.value;
            var checked = e.target.checked;
            var viewAll = document.querySelector('.lnb-calendars-item input');
            var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
            var allCheckedCalendars = true;
            if (calendarId === 'all') {
                allCheckedCalendars = checked;
                calendarElements.forEach(function(input) {
                    var span = input.parentNode;
                    input.checked = checked;
                    span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
                });

                CalendarList.forEach(function(calendar) {
                    calendar.checked = checked;
                });
            } else {
                findCalendar(calendarId).checked = checked;
                allCheckedCalendars = calendarElements.every(function(input) {
                    return input.checked;
                });

                if (allCheckedCalendars) {
                    viewAll.checked = true;
                } else {
                    viewAll.checked = false;
                }
            }

            refreshScheduleVisibility();
        }

        /**
         * For each calendar in the list, if the checkbox is checked, then the schedules for that calendar are
         * hidden. If the checkbox is unchecked, then the schedules for that calendar are shown
         */
        function refreshScheduleVisibility() {
            // deb('refreshScheduleVisibility');
            var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
            CalendarList.forEach(function(calendar) {
                if (typeof calendar.checked === 'undefined') {
                    calendar.checked = true;
                }
                cal.toggleSchedules(calendar.id, !calendar.checked, false);
            });
            cal.render(true);
            calendarElements.forEach(function(input) {
                var span = input.nextElementSibling;
                span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
            });
        }

        /**
         * The function is called when the calendar is rendere
         * and is used to set the text of the element with id "renderRange"
         *
         */
        function setRenderRangeText() {
            var renderRange = document.getElementById('renderRange');
            var options = cal.getOptions();
            var viewName = cal.getViewName();

            var html = [];
            if (viewName === 'day') {
                html.push(moment(cal.getDate().getTime()).format('DD. MM. YYYY'));
            } else if (viewName === 'month' && (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
                html.push(moment(cal.getDate().getTime()).format('MMM YYYY'));
            } else {
                html.push(moment(cal.getDateRangeStart().getTime()).format('DD. MM.'));
                html.push(' ~ ');
                html.push(moment(cal.getDateRangeEnd().getTime()).format('  DD. MM. YYYY'));
            }
            renderRange.innerHTML = html.join('');
            Functions.pageTitle(`Calendar - ${html.join('')}`)

        }

        /**
         * It calls the render function of the calendar object.
         * he code is throttling the resize function so that it is not called more than once every 50 milliseconds.
         */
        function resizeThrottled() {
            tui.util.throttle(function() {
                cal.render();
            }, 50);
        }

        /**
         * Get the action attribute from the target element
         * @param target - The element that was clicked.
         * @returns The action that is being performed on the target.
         */
        function getDataAction(target) {
            return target.dataset ? target.dataset.action : target.getAttribute('data-action');
        }

        /**
         * It creates a list of checkboxes for each calendar
         */
        function setCalendarList() {
            var calendarList = document.getElementById('calendarList');
            if (html) html = undefined;

            var html = [];
            html.length = 0
                // deb(html)
                // deb('CalendarList', CalendarList);

            CalendarList.forEach(function(calendar) {
                // deb('setCalendarList Function', calendar);
                // deb(calendar.name)
                html.push( /*HTML*/ `
                    <div class="lnb-calendars-item">
                        <label>
                            <input type="checkbox" class="tui-full-calendar-checkbox-round" value="${calendar.id}" checked>
                            <span style="border-color:${calendar.borderColor}; background-color:${calendar.borderColor};"></span>
                            <span>${calendar.name}</span>
                        </label>
                    </div>
                    `);
            });
            calendarList.innerHTML = html.join('\n');
        }
    }, //aftrer_render
};

export default Appointments;