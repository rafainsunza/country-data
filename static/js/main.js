const countryCardContainer = document.querySelector('.country-card-container');
const darkModeBtn = document.querySelector('.contrast-button');
const body = document.querySelector('body');

let maxPagesReached = false;
let loadingData = false;
let selectedCountry;

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

darkModeBtn.addEventListener('click', toggleDarkMode);
