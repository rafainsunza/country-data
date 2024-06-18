const countryCardContainer = document.querySelector('.country-card-container');
const darkModeBtn = document.querySelector('.contrast-button');
const body = document.querySelector('body');

let maxPagesReached = false;
let loadingData = false;
let selectedCountry;

localStorage.getItem('dark-mode') === null ?
    localStorage.setItem('dark-mode', 'disabled') :
    localStorage.getItem('dark-mode') === 'enabled' ?
        body.classList.add('dark-mode') :
        body.classList.remove('dark-mode');


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
        <p>Loading more countries...</p>
        `;

        countryCardContainer.appendChild(loader);
    } else {
        const loader = document.querySelector('.loader');

        if (loader && loader.parentNode === countryCardContainer) {
            countryCardContainer.removeChild(loader);
        }
    }
}

const toggleDarkMode = () => {
    if (localStorage.getItem('dark-mode') === 'disabled') {
        body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', 'enabled')
    } else {
        body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
    }


}

const openSelectedCountryPage = (event) => {
    event.preventDefault();

    event.target.closest('a') ?
        selectedCountry = event.target.closest('a').id :
        null

    localStorage.setItem('selected-country', `${selectedCountry}`)

    selectedCountry !== undefined ?
        window.location.href = '/pages/country.html' :
        null

}

darkModeBtn.addEventListener('click', toggleDarkMode);
countryCardContainer.addEventListener('click', openSelectedCountryPage);






