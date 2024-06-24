const detailedInfo = ['flag', 'name', 'nativeName', 'population', 'region', 'subregion', 'capital', 'topLevelDomain', 'currencies', 'languages', 'borders', 'alpha3Code'];
const detailedCountryCard = document.querySelector('.detailed-country-card');
const backBtn = document.querySelector('.back-btn');

const fetchDetailedData = (dataKeys) => {
    return fetch('/static/data/data.json')
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
            let errorMessageContainer = detailedCountryCard.querySelector('.error-message');

            if (!errorMessageContainer) {
                errorMessageContainer = document.createElement('div');
                errorMessageContainer.classList.add('error-message');

                errorMessageContainer.innerHTML = `
                    <p>Something went wrong, please try again later...</p>
                `;

                detailedCountryCard.appendChild(errorMessageContainer);
            }
        });
}

const convertAbbrToCountryName = (abbr, data) => {
    const convertedCountryNames = [];

    abbr[0] === 'None' ? convertedCountryNames.push(abbr[0]) :
        abbr.forEach((abbr) => {
            const foundCountry = data.find(country => country["alpha3Code"] === abbr);

            convertedCountryNames.push(foundCountry.name);
        });

    return convertedCountryNames;
}

const displayCard = (flag, name, nativeName, population, region, subregion, capital, topLevelDomain, currencies, languages, borders) => {
    const card =
        `<img class="detailed-flag" src="${flag}">
    <div class="details-container">
        <h2 class="detail-page-name">${name}</h2>

        <ul class="details">
            <li class="details-li"><strong>Native Name: </strong>${nativeName}</li>
            <li class="details-li"><strong>Population: </strong>${population.toLocaleString('en-US')}</li>
            <li class="details-li"><strong>Region: </strong>${region}</li>
            <li class="details-li"><strong>Sub Region: </strong>${subregion}</li>
            <li class="details-li"><strong>Capital: </strong>${capital}</li>
        </ul>

        <ul class="details">
            <li class="details-li"><strong>Top Level Domain: </strong>${topLevelDomain}</li>
            <li class="details-li"><strong>Currencies: </strong>${currencies.join(', ')}</li>
            <li class="details-li"><strong>Languages: </strong>${languages.join(', ')}</li>
        </ul>

        <div class="border-countries-container">
            <h3 class="border-countries-title"><strong>Border Countries:</strong></h3>
            <div class="border-countries"></div>
        </div>
    </div>`;

    return card
}

const displaySelectedCountry = () => {
    const selectedCountry = localStorage.getItem('selected-country');

    displayLoader(true)

    fetchDetailedData(detailedInfo)
        .then((data) => {
            const countryToDisplay = data.find((country) => country.name === selectedCountry);
            const currencies = [];
            const languages = [];
            let borderCountriesAbbr = [];

            countryToDisplay.capital === undefined ? countryToDisplay.capital = 'None' : null;

            countryToDisplay.currencies === undefined ?
                currencies.push('None') :
                countryToDisplay.currencies.forEach((currency) => { currencies.push(currency.name) });

            countryToDisplay.languages.forEach((language) => { languages.push(language.name) });

            countryToDisplay.borders === undefined ?
                borderCountriesAbbr = ['None'] :
                countryToDisplay.borders.forEach((country) => { borderCountriesAbbr.push(country) });

            const borderCountries = convertAbbrToCountryName(borderCountriesAbbr, data);

            detailedCountryCard.innerHTML = displayCard(
                countryToDisplay.flag,
                countryToDisplay.name,
                countryToDisplay.nativeName,
                countryToDisplay.population,
                countryToDisplay.region,
                countryToDisplay.subregion,
                countryToDisplay.capital,
                countryToDisplay.topLevelDomain,
                currencies,
                languages,
                borderCountries);

            const borderCountriesDiv = document.querySelector('.border-countries');

            borderCountries.forEach((country) => {
                const span = document.createElement('span');
                span.classList.add('border-country');
                span.textContent = country;

                borderCountriesDiv.appendChild(span);
            });

            displayLoader(false)
        });
}

const handleBackBtnClick = () => {
    console.log('clicked back btn')
}

displaySelectedCountry();

backBtn.addEventListener('click', handleBackBtnClick)




