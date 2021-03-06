// Micheal Willard
// CS 290 Winter 2015
// Assignment 3 Part 2

// Requirements: This web app should allow a user to seach Gists through the
// gitHub Gist api.  Results will be filtered by language and displayed in
// Results section.  User can add/remove items from favorite section.  New
// searches should filter for items already in favorites.

window.favoriteArray = [];

//***** SEARCH AND RESULTS SECTION *****
// Search Gist -> initates Gist request ->
// Requested results filtered against selected languages ->
// Requested results filtered against favorited Gists ->

// Setup the Gist Object
//  Similar to Sport function() from lecture
function Gist() {
  // URL is guaranteed to be the unique field
  this.url = '';
  this.description = '';
  this.language = '';
  // Setters
  this.setUrl = function(url) {
    this.url = url;
  };
  this.setDesc = function(description) {
    this.description = description;
  };
  this.setLang = function(language) {
    this.language = language;
  };
  // Getters
  this.getUrl = function(url) {
    return this.url;
  };
  this.getDesc = function(description) {
    return this.description;
  };
  this.getLang = function(language) {
    return this.language;
  };
}

// This function is triggered by the Search button on the HTML page.
// This function takes the page-input parameter.
// It generates a number of requests based on that parameter.
function displaySearchResults() {
  var pageRequests = document.getElementById('page-input').value;
// For loop, to make 1 request per 'page' requested.
  for (var p = 0; p < pageRequests; p++) {
    // Setup stock AJAX code
    var req;
    if (window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
      req = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (!req) {
      throw 'Unable to create HttpRequest.';
    }
    // URL request from https://developer.github.com/v3/gists/
    var url = 'https://api.github.com/gists/public?page=' + p;
    req.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          var response = JSON.parse(this.responseText);
          createListObjects(document.getElementById('results-gist'), response);
        }
      }
    };
    //Make GET request
    req.open('GET', url);
    req.send();
  }
}

// This function is called by displaySearchResults.
// It creates the Gist Object for each parsed response
// It calls a helper function to build a list object
function createListObjects(ol, response) {
  for (var prop in response) {
    var tempItem = new Gist();
    tempItem.setUrl(response[prop].html_url);
    tempItem.setDesc(response[prop].description);
    for (var files in response[prop]) {
      for (var key in response[prop][files]) {
        //Temp language to isolate language recognition problem in liObject
        tempLang = response[prop][files][key].language;
        if (typeof tempLang !== 'undefined') {
          tempItem.setLang(response[prop][files][key].language);
        }
        else if (typeof tempLang === 'object') {
          tempItem.setLang('null');
        }
        // console.log(tempItem.getLang());
      }
    }
    liObject(ol, tempItem);
  }
}

// Function to filter results by language
//  Calls helper function to create objects for filtered results
function liObject(ol, tempItem) {
  // Setup variables to clean up if statements
  var jsChecked = document.getElementsByName('filter-javascript')[0].checked;
  var jsonChecked = document.getElementsByName('filter-json')[0].checked;
  var sqlChecked = document.getElementsByName('filter-sql')[0].checked;
  var pyChecked = document.getElementsByName('filter-python')[0].checked;

  // Added to check for existing - Works!
  var storedFavorites = JSON.parse(localStorage.getItem('storedFavs'));
  // Build the Stored Favorite List from parsed
  for (var item in storedFavorites) {
    // Get property
    if (storedFavorites[item].url === tempItem.getUrl()) {
      return;
    }
  }
  if (tempItem.getLang() === 'JavaScript' && jsChecked) {
    _liGist(ol, tempItem);
    return;
  }
  if (tempItem.getLang() === 'JSON' && jsonChecked) {
    _liGist(ol, tempItem);
    return;
  }
  if (tempItem.getLang() === 'sql' && sqlChecked) {
    _liGist(ol, tempItem);
    return;
  }
  if (tempItem.getLang() === 'Python' && pyChecked) {
    _liGist(ol, tempItem);
    return;
  }
  // Selecting no languages returns all Gist results
  else if (!jsChecked && !jsonChecked && !sqlChecked && !pyChecked) {
     _liGist(ol, tempItem);
     return;
   }
   else {
     return;
   }
}

// Helper Function to create HTML for result objects
function _liGist(ol, tempItem) {
  var li = document.createElement('li');
  // Assign li.id, otherwise the new item isn't recognized as node by remove()
  li.id = tempItem.getUrl();
  var aLink = document.createElement('a');
  var aDesc = document.createTextNode(tempItem.getDesc());
  // Handle for no description
  if (tempItem.getDesc() == '') {
    aDesc = document.createTextNode('No Description.');
  }
  aLink.setAttribute('href', tempItem.getUrl());
  aLink.appendChild(aDesc);
  var button = document.createElement('input');
  button.type = 'button';
  button.value = 'Save to Favorites';
  button.onclick = function() {
    addToFavorites(tempItem);
  };
  // Append All to List
  li.appendChild(aLink);
  li.appendChild(button);
  ol.appendChild(li);
}

// Function to remove item from list of search results
function removeFromList(inputItem) {
  var ol = document.getElementById('results-gist');
  var li = document.getElementById(inputItem.getUrl());
  ol.removeChild(li);
}

//***** FAVORITES SECTION *****
// Add to Favorites
// -Add to Favorites will remove from search results
// Save added favorite
// Remove from Favorites

function addToFavorites(inputItem) {
  favoriteArray.push(inputItem);
  var temp = JSON.stringify(favoriteArray);
  localStorage.setItem('storedFavs', temp);
  // Remove from Search Results
  removeFromList(inputItem);
  _saveFav(inputItem);
}

function _saveFav(inputItem) {
  var ol = document.getElementById('favorites-gist');
  var li = document.createElement('li');
  // Assign li.id, otherwise the new item isn't recognized as node by remove()
  li.id = inputItem.getUrl();
  var aLink = document.createElement('a');
  var aDesc = document.createTextNode(inputItem.getDesc());
  // Handle for no description
  if (inputItem.getDesc() == '') {
    aDesc = document.createTextNode('No Description.');
  }
  aLink.setAttribute('href', inputItem.getUrl());
  aLink.appendChild(aDesc);
  var button = document.createElement('input');
  button.type = 'button';
  button.value = 'Remove from Favorites';
  button.onclick = function() {
    removeFromFavorites(inputItem);
  };
  // Append All to List
  ol.appendChild(li);
  li.appendChild(aLink);
  li.appendChild(button);
}

function removeFromFavorites(inputItem) {
  var ol = document.getElementById('favorites-gist');
  var li = document.getElementById(inputItem.getUrl());
  // Remove the item
  ol.removeChild(li);
  localStorage.removeItem('storedFavs');
  // Iterate through the stored array, until url match is found, then splice
  for (var i = 0; i < favoriteArray.length; i++) {
    if (inputItem.getUrl() === favoriteArray[i].getUrl()) {
      favoriteArray.splice(i, 1);
    }
  }
  // With item remove, reassign
  var temp = JSON.stringify(favoriteArray);
  localStorage.setItem('storedFavs', temp);
}

//***** WINDOW LOAD SECTION *****


window.onload = function() {
  var settingsStr = localStorage.getItem('storedFavs');
  // Parse localStorage
  if (settingsStr === null) {
    storedFavorites = {'favorites': []};
    localStorage.setItem('storedFavs', JSON.stringify(storedFavorites));
  }
  else {
    var storedFavorites = JSON.parse(localStorage.getItem('storedFavs'));
  }
  // Build the Stored Favorite List from parsed
  for (var item in storedFavorites) {
    // Create new Gist Object
    var itemFav = new Gist();
    // Set properties
    itemFav.setDesc(storedFavorites[item].description);
    itemFav.setUrl(storedFavorites[item].url);
    itemFav.setLang(storedFavorites[item].language);
    _saveFav(itemFav);
    favoriteArray.push(itemFav);
  }
};
