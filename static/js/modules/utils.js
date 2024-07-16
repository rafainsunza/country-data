const body = document.querySelector('body');
const countryCardContainer = document.querySelector('.country-card-container');
const selectDropDown = document.querySelector('.select-dropdown');
const selectBtn = document.querySelector('.select-button');
const darkModeBtn = document.querySelector('.contrast-button');

const search = { active: false };
const filter = { active: false, name: '' };
const pages = { maxPagesReached: false, pageCount: 1 };
let loadingData = false;


const displayLoader = (display) => {
    loadingData = display;

    if (display) {
        const loader = document.createElement('div');
        loader.classList.add('loader');
        loader.innerHTML = `
        <i class="fa-solid fa-spinner"></i>
        `;

        body.appendChild(loader);
    } else {
        const loader = document.querySelector('.loader');

        if (loader && loader.parentNode === body) {
            body.removeChild(loader);
        }
    }
}

const setCookie = (cookieName, cookieValue, expirationDays) => {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000)); // Convert expiration days to miliseconds

    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`
}

const getCookies = () => {
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookiesArray = decodedCookies.split(';').map(cookie => cookie.trim());
    const cookieObjects = []

    cookiesArray.forEach((cookie) => {
        cookieObjects.push({
            name: cookie.substring(0, cookie.indexOf('=')),
            value: cookie.substring(cookie.indexOf('=') + 1, cookie[-1])
        })
    })

    return cookieObjects
}

const setInitialCookies = () => {
    const cookies = getCookies();
    const darkModeCookie = cookies.find((cookie) => cookie.name === 'dark-mode');

    // If dark-mode cookie does not exist yet, create it and set it to disabled
    // If it does, use its value to decide if dark-mode class must be applied or not
    darkModeCookie === undefined ?
        setCookie('dark-mode', 'disabled', 365) :
        body.classList.toggle('dark-mode', darkModeCookie.value === 'enabled');
}

// variables
export {
    body,
    countryCardContainer,
    darkModeBtn,
    selectDropDown,
    selectBtn,
    loadingData,
    pages,
    filter,
    search
}

// functions
export {
    displayLoader,
    setCookie,
    getCookies,
    setInitialCookies,
}
