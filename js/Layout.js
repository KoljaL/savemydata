/*
 *
 * Page elements
 *
 */
const deb = console.log.bind(window.console);
const PRL = document.getElementById('PRL');
const expandSubLists = document.getElementById('expandSubLists');
const navLinks = document.querySelectorAll('nav li');
var screenSize, toggleSubLists;

/*
 *
 * Adding an event listener to the navLinks.
 * Adding classes to the list elements.
 *
 */
navLinks.forEach(function(nav_links) {
    nav_links.addEventListener('click', (el) => {
        let linkElement = el.target.parentElement;
        // deb(link.parentElement)
        // deb(el.target.parentElement)
        // handle with <span data-lang="">
        var link = linkElement.dataset.link || linkElement.parentElement.dataset.link
            // run only if there is a data-link inside the tag
        if (link) {
            window.location.hash = link;
            // demoContent(link.dataset.link);

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
            linkElement.classList.add('active', 'current');
            // mark children as active
            if (linkElement.nextElementSibling && linkElement.nextElementSibling.tagName === 'UL') {
                // deb(link.nextElementSibling.children)
                for (let child_link of linkElement.nextElementSibling.children) {
                    child_link.classList.add('active');
                }
            }
            // mark parent als parent sibling as active
            // deb(link.parentElement.classList.contains('subList'))
            if (linkElement.parentElement.classList.contains('subList')) {
                for (let child_link of linkElement.parentElement.children) {
                    child_link.classList.add('active');
                    // deb(child_link.parentElement.previousElementSibling)
                    child_link.parentElement.parentElement.classList.add('active');
                }
            }
        }
    });
});



/**
 * 
 * It iterates over all nav links and checks if the current url matches the link's url. 
 * If so, it adds the active class to the link and all its children
 * 
 */
window.addEventListener('DOMContentLoaded', initSidebar);
window.addEventListener('hashchange', initSidebar);

function initSidebar(event) {
    let url = location.hash.slice(1).toLowerCase() || '/';
    url = url.split('/');
    let slug = url[0];
    if (url[1]) slug = slug + '/' + url[1];
    // deb(slug)

    navLinks.forEach(function(nav_links) {
        // deb(nav_links.dataset.link)
        if (slug == nav_links.dataset.link) {
            // remove active marks
            navLinks.forEach(function(old_links) {
                // do not close, if all opend by toggleSubLists
                if (!toggleSubLists) {
                    old_links.classList.remove('active');
                }
                old_links.classList.remove('current');
            });
            nav_links.classList.add('active', 'current');
            // mark children as active
            if (nav_links.nextElementSibling && nav_links.nextElementSibling.tagName === 'UL') {
                // deb(link.nextElementSibling.children)
                for (let child_link of nav_links.nextElementSibling.children) {
                    child_link.classList.add('active');
                }
            }
            // mark parent als parent sibling as active
            // deb(link.parentElement.classList.contains('subList'))
            if (nav_links.parentElement.classList.contains('subList')) {
                for (let child_link of nav_links.parentElement.children) {
                    child_link.classList.add('active');
                    // deb(child_link.parentElement.previousElementSibling)
                    child_link.parentElement.parentElement.classList.add('active');
                }
            }
        }
    });
}

/**
 *
 * It toggles the class of the navLinks to expand all SubLists.
 *
 */
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
/*
 *
 * Adding a class to the body of the page to show the sidebar.
 *
 */
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
    }
});

/**
 *
 *  The above code is adding a class to the body of the page depending on the width of the browser.
 *
 */
toggleView();
window.addEventListener('resize', toggleView);

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


/**
 * 
 * get all data-theme modes ([data-theme='blue']) from the CSS file
 * 
 */
function getModes() {
    var modes = [];
    var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
    for (var x = 0; x < classes.length; x++) {
        if (classes[x].cssText.includes('data-theme') && !classes[x].cssText.includes('*')) {
            let str = classes[x].cssText;
            // deb(str)
            str = str.split(']');
            str = str[0].split('"');
            modes.push(str[1]);
        }
    }
    return modes;
}

/**
 *
 * The function `toggleTheme` takes the current theme and adds one to it. 
 *
 */

// const modes = ['dark', 'dark-boxes', 'blue', 'blue-boxes', 'light', 'light-boxes'];
const modes = getModes();

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