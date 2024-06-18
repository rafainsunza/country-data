const detailedInfo = ['flag', 'name', 'nativeName', 'population', 'region', 'subregion', 'capital', 'topLevelDomain', 'currencies', 'languages', 'borders', 'alpha3Code'];

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
            let errorMessageContainer = countryCardContainer.querySelector('.error-message');

            if (!errorMessageContainer) {
                errorMessageContainer = document.createElement('div');
                errorMessageContainer.classList.add('error-message');

                errorMessageContainer.innerHTML = `
                    <p>Something went wrong, please try again later...</p>
                `;

                countryCardContainer.appendChild(errorMessageContainer);
            }
        });
}

const displaySelectedCountry = () => {
    const selectedCountry = localStorage.getItem('selected-country');
    countryCardContainer.classList.add('detailed-page');

    fetchDetailedData(detailedInfo)
        .then((data) => {
            const countryToDisplay = data.find((country) => country.name === selectedCountry);
            const currencies = [];
            const languages = [];
            const borderCountries = [];

            countryToDisplay.capital === undefined ? countryToDisplay.capital = 'None' : null;

            countryToDisplay.currencies === undefined ?
                currencies.push('None') :
                countryToDisplay.currencies.forEach((currency) => { currencies.push(currency.name) });

            countryToDisplay.languages.forEach((language) => { languages.push(language.name) });

            countryToDisplay.borders === undefined ?
                borderCountries.push('None') :
                countryToDisplay.borders.forEach((country) => { borderCountries.push(country) });

            countryCardContainer.innerHTML = `
                <img class="detailed-flag" src="${countryToDisplay.flag}">
                <div class="details-container">
                    <h2 class="detail-page-name">${countryToDisplay.name}</h2>

                    <ul class="details-1">
                        <li class="details-1-li"><strong>Native Name: </strong>${countryToDisplay.nativeName}</li>
                        <li class="details-1-li"><strong>Population: </strong>${countryToDisplay.population.toLocaleString('en-US')}</li>
                        <li class="details-1-li"><strong>Region: </strong>${countryToDisplay.region}</li>
                        <li class="details-1-li"><strong>Sub Region: </strong>${countryToDisplay.subregion}</li>
                        <li class="details-1-li"><strong>Capital: </strong>${countryToDisplay.capital}</li>
                    </ul>

                    <ul class="details-2">
                        <li class="details-2-li"><strong>Top Level Domain: </strong>${countryToDisplay.topLevelDomain}</li>
                        <li class="details-2-li"><strong>Currencies: </strong>${currencies.join(', ')}</li>
                        <li class="details-2-li"><strong>Languages: </strong>${languages.join(', ')}</li>
                    </ul>

                    <div class="border-countries-container">
                    </div>
                </div>
            `;

            const borderCountriesContainer = document.querySelector('.border-countries-container');

            borderCountries[0] === 'None' ?
                borderCountriesContainer.innerHTML = `
                <h3>Border Countries:</h3>
                <span>${borderCountries}</span>` :
                null
        });
}

displaySelectedCountry();


