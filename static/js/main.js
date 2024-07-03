const countryCardContainer = document.querySelector('.country-card-container');
const darkModeBtn = document.querySelector('.contrast-button');
const body = document.querySelector('body');
const tileBtns = document.querySelectorAll('.tile-btn');

let maxPagesReached = false;
let loadingData = false;
let selectedCountry;

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

setInitialCookies = () => {
    const cookies = getCookies();
    const darkModeCookie = cookies.find((cookie) => cookie.name === 'dark-mode');

    // If dark-mode cookie does not exist yet, create it and set it to disabled
    // If it does, use its value to decide if dark-mode class must be applied or not
    darkModeCookie === undefined ?
        setCookie('dark-mode', 'disabled', 365) :
        body.classList.toggle('dark-mode', darkModeCookie.value === 'enabled');
}

const fetchData = (dataKeys) => {
    return fetch('./static/data/data.json')
        .then((response) => response.json())
        .then((data) => {
            const requestedData = data.map((country) => {
                const result = {};
                dataKeys.forEach((dataKey) => {
                    if (country.hasOwnProperty(dataKey)) {
                        result[dataKey] = country[dataKey];
                    }
                });
                return result;
            });

            return requestedData;
        })
        .catch(() => {
            displayLoader(false);
            maxPagesReached = true;
            let errorMessageContainer = countryCardContainer.querySelector('.error-message');

            if (!errorMessageContainer) {
                errorMessageContainer = document.createElement('div');
                errorMessageContainer.classList.add('error-message');

                errorMessageContainer.innerHTML = `
                    <p>Something went wrong, please try again later...</p>
                `;

                countryCardContainer.appendChild(errorMessageContainer);
            }

        })
}

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

const toggleDarkMode = () => {
    const cookies = getCookies();
    const darkModeCookie = cookies.find((cookie) => cookie.name.includes('dark-mode'));

    if (darkModeCookie.value === 'disabled') {
        body.classList.toggle('dark-mode');
        setCookie('dark-mode', 'enabled', 365);
    }

    if (darkModeCookie.value === 'enabled') {
        body.classList.toggle('dark-mode');
        setCookie('dark-mode', 'disabled', 365);
    }
}

const changeGridLayout = (event) => {
    // Make sure target is always the button
    const btn = event.target.closest('button');

    switch (btn.classList[1]) {
        case 'tile-btn-1':
            countryCardContainer.style = `grid-template-columns: repeat(1, 280px);`;
            break;
        case 'tile-btn-2':
            countryCardContainer.style = `grid-template-columns: repeat(2, 280px)`;
            break;
        case 'tile-btn-3':
            countryCardContainer.style = `grid-template-columns: repeat(3, 280px)`;
            break;
        case 'tile-btn-4':
            countryCardContainer.style = `grid-template-columns: repeat(4, 280px)`;
            break;
    }
}

const resetGridLayout = (event) => {
    const window = event.target;

    const smallScreen = window.innerWidth >= 768 && window.innerWidth < 1120
    const mediumScreen = window.innerWidth >= 1120 && window.innerWidth < 1480
    const largeScreen = window.innerWidth >= 1480

    // If amount of tiles exceeds the window width, remove the inline styling placed by the tile-btn.
    // Or if the amount of tiles does not correspond with the amount of tiles that can be chosen from, also remove the inline styling

    if (smallScreen && countryCardContainer.style.gridTemplateColumns === 'repeat(3, 280px)') {
        countryCardContainer.style.gridTemplateColumns = '';
    }

    if (mediumScreen && countryCardContainer.style.gridTemplateColumns === 'repeat(1, 280px)' ||
        mediumScreen && countryCardContainer.style.gridTemplateColumns == 'repeat(4, 280px)'
    ) {
        countryCardContainer.style.gridTemplateColumns = '';
    }

    if (largeScreen && countryCardContainer.style.gridTemplateColumns === 'repeat(2, 280px)') {
        countryCardContainer.style.gridTemplateColumns = '';
    }
}

setInitialCookies();

darkModeBtn.addEventListener('click', toggleDarkMode);
tileBtns.forEach((button) => button.addEventListener('click', changeGridLayout));
window.addEventListener('resize', resetGridLayout);
