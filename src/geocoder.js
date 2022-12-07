// module author drklrd. 2022-12-01

import autocomplete from 'autocompleter';
import EventEmitter from 'events';

export class Geocoder extends EventEmitter {
    /**
     * @param {Object} options
     * @param {string|HTMLInputElement|null} [options.input]
     */
    constructor(options) {
        super();
        let options_ = options || {};
        if (options_.input) {
            let input_ = options_.input;
            input_ = typeof (input_) == 'string' ? document.getElementById(input_) : input_;
            if (input_) {
                this.setAutocompleteInput_(input_, options.baatoAccessToken);
            }
        }

    }

    /**
     * @private
     * @param {HTMLInputElement} input
     */
    setAutocompleteInput_(input, baatoAccessToken) {
        this.input_ = input;

        this.input_.classList.add('baato-geocoder');
        this.input_.maxLength = 60;

        this.autocomplete_ = autocomplete({
            input: this.input_,
            emptyMsg: 'No matching search results',
            minLength: 2,
            debounceWaitMs: 500,
            className: 'baato-geocoder-results',
            fetch: (text, update) => {
                this.geocode(text, baatoAccessToken)
                    .then(json => {
                        update(json.data);
                    })
                    .catch(e => {
                        console.error('Geocoding error:', e);
                    });
            },
            onSelect: (result) => {
                this.input_.value = '';
                this.emit('select', result);
            },
            render: (result) => {
                let iconElement = document.createElement('span');
                iconElement.className = 'pushpin';

                let nameElement = document.createElement('span');
                nameElement.className = 'result-name';
                nameElement.textContent = result.name;

                let addressElement = document.createElement('span');
                addressElement.className = 'result-address';
                addressElement.textContent = result.address;

                const resultElement = document.createElement('div');
                resultElement.append(iconElement, nameElement, addressElement);

                resultElement.addEventListener('mouseover', (e) => {
                    this.emit('hover', result);
                });
                return resultElement;
            }
        })
    }

    /**
     * @param {string} query
     * @returns {Promise.<GeocodingResult>}
     */
    geocode(query, baatoAccessToken) {
        let url = `https://api.baato.io/api/v1/search?q=${query}&key=${baatoAccessToken}`;
        return fetch(url)
            .then(response => response.json())
    }
}

export class SearchBar {
    /**
     * @param {Object} options
     * @param {string} [options.baatoAccessToken]
     */
    constructor(options) {
        let options_ = options || {};
        this.baatoAccessToken = options_.baatoAccessToken;
        if (!this.baatoAccessToken) {
            throw Error('No Baato access token provided!');
        }
    }
    /**
     * @param {MapLibreGl} Map
     * @returns {HTMLElement}
     */
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl';
        const _input = document.createElement('input');
        _input.placeholder = "Search here for places...";
        this._container.appendChild(_input);

        this.geocoder = new Geocoder({
            input: _input,
            baatoAccessToken: this.baatoAccessToken
        });

        return this._container;
    }
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
        return this;
    }

}
