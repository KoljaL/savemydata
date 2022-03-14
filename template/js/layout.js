const deb = console.log.bind(window.console);
const PRL = document.getElementById('PRL');
const expandSubLists = document.getElementById('expandSubLists');
const navLinks = document.querySelectorAll('nav li');

var screenSize, toggleSubLists;

//
// handle SIDEBAR clicks
navLinks.forEach(function(nav_links) {
    nav_links.addEventListener('click', (el) => {
        let link = el.target.parentElement;
        // deb(el.target)
        // deb(el.target.parentElement)
        // run only if there is a data-link inside the tag
        if (link.dataset.link) {
            window.location.hash = link.dataset.link;
            demoContent(link.dataset.link);

            // document.querySelector('main h3').innerHTML = link.dataset.link;
            if ('small' === screenSize) {
                PRL.classList.toggle('sidebar');
            }
            // remove active marks
            navLinks.forEach(function(old_links) {
                // do not close, if all opend by toggleSubLists
                if (!toggleSubLists) {
                    old_links.classList.remove('active');
                }
                old_links.classList.remove('current');
            });
            // mark this li as active & current
            link.classList.add('active', 'current');
            // mark children as active
            if (link.nextElementSibling && link.nextElementSibling.tagName === 'UL') {
                // deb(link.nextElementSibling.children)
                for (let child_link of link.nextElementSibling.children) {
                    child_link.classList.add('active');
                }
            }
            // mark parent als parent sibling as active
            // deb(link.parentElement.classList.contains('subList'))
            if (link.parentElement.classList.contains('subList')) {
                for (let child_link of link.parentElement.children) {
                    child_link.classList.add('active');
                    // deb(child_link.parentElement.previousElementSibling)
                    child_link.parentElement.parentElement.classList.add('active');
                }
            }
        }
    });
});



expandSubLists.addEventListener('click', expandAllSublists);

function expandAllSublists() {
    if (toggleSubLists) {
        navLinks.forEach(function(nav_links) {
            nav_links.classList.remove('active');
        });
        toggleSubLists = 0;
    } else {
        navLinks.forEach(function(nav_links) {
            nav_links.classList.add('active');
        });
        toggleSubLists = 1;
    }
}
//
// TOGGLE SIDEBAR
document.getElementById('toggleSidebar').addEventListener('click', (e) => {
    PRL.classList.toggle('sidebar');

    // close sidebar in 'small' even if click is outside
    if ('small' === screenSize) {
        toggleSubLists = 0;
        expandAllSublists();
        document.addEventListener('click', closeOnEveryClick);

        function closeOnEveryClick(e) {
            if (e.target.id !== 'toggleSidebar' && e.target.id !== 'expandSubLists') {
                PRL.classList.remove('sidebar');
                document.removeEventListener('click', closeOnEveryClick);
            }
        }
    } else {}
});

/**
 *  The above code is adding a class to the body of the page depending on the width of the browser.
 */

function toggleView() {
    const breakpoints = [{
            width: '36em',
            class: 'small',
        },
        {
            width: '60em',
            class: 'medium',
        },
        {
            width: '120em',
            class: 'large',
        },
    ];

    breakpoints.every((view) => {
        if (window.matchMedia(`(max-width: ${view.width})`).matches) {
            // document.body.removeAttribute('class');
            PRL.classList.remove('small', 'medium', 'large');
            PRL.classList.add(view.class);
            // add sidebar in fullscreen view
            screenSize = view.class;
            if (screenSize === 'large') {
                PRL.classList.add('sidebar');
            } else {
                PRL.classList.remove('sidebar');
            }
            return false;
        }
        return true;
    });
}

toggleView();
window.addEventListener('resize', toggleView);

//
// COLOR SWITCH
//
// const modes = ['sleek', 'github', 'dark', 'light', 'color'];
const modes = ['dark', 'light'];
// check localStorage for colorStyle
if (localStorage.getItem('colorStyle')) {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('colorStyle'));
}
// set default mode (if no :root{})
else {
    document.documentElement.setAttribute('data-theme', modes[0]);
}

// toggle theme function
function toggleTheme() {
    let mode = document.documentElement.getAttribute('data-theme');
    let modeIndex = modes.indexOf(mode) + 1;
    if (modeIndex === modes.length) modeIndex = 0;
    localStorage.setItem('colorStyle', modes[modeIndex]);
    document.documentElement.setAttribute('data-theme', modes[modeIndex]);
}
// create toggle button after DOM is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    let ThemeToggle = document.createElement('span');
    // ThemeToggle.setAttribute('style', 'position: absolute; top: 15px; right: 50px; fill: var(--font_0); cursor: pointer');
    ThemeToggle.setAttribute('id', 'darkmodecheckbox');
    ThemeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 12 2 C 17.514 2 22 6.486 22 12 S 17.514 22 12 22 V 2 Z M 12 0 C 5.373 0 0 5.373 0 12 S 5.373 24 12 24 S 24 18.627 24 12 S 18.627 0 12 0 Z"/></svg>';
    // ThemeToggle.innerHTML = '&#127912;';
    ThemeToggle.addEventListener('click', toggleTheme, false);
    document.getElementById('PRL').appendChild(ThemeToggle);
});