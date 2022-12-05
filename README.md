# Baato JS Geocoder

![Build](https://github.com/baato/baato-js-geocoder/actions/workflows/baato-js-geocoder.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A JS Plugin to Geocode search query with autocompetion feature. Also provides searchbox UI.

# Usage

## In Maplibregl

- Include link to Geocoder JS script `<script src="https://packagelink/baato-js-geocoder.js"></script>`
- Include link to Geocoder CSS style ` <link rel="stylesheet" href="https://packagelink/baato-js-geocoder.css">`
- Add SearchBar as a custom map control.

  ```
  // initialize a map search bar with Baato JS Geocoder.
  const searchBar = new baatojsgeocoder.SearchBar({
  baatoAccessToken
  });
  // add map search bar to map control
  map.addControl(searchBar, 'top-left');
  ```

- Attach an event handler for the SearchBar.

```
// attach event handler for the search bar. This is fired when we select one of the search results.
searchBar.geocoder.on('select', function (result) {
    searchByPlaceId(result.placeId);
});
```
