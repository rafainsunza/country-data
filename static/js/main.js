const countryCardContainer = document.querySelector('.country-card-container');
const darkModeBtn = document.querySelector('.contrast-button');

let maxPagesReached = false;
let loadingData = false;

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
        loader.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    } else {
        const loader = document.querySelector('.loader');

        if (loader && loader.parentNode === countryCardContainer) {
            countryCardContainer.removeChild(loader);
        }
    }
}

const toggleDarkMode = () => {
    document.querySelector('body').classList.toggle('dark-mode')
}

darkModeBtn.addEventListener('click', toggleDarkMode);






