// Micheal Willard
// CS 290 Winter 2015
// Assignment 3 Part 2


// Begin Search and Results Section
// Search Gist -> initates Gist request ->
// Requested results filtered against selected languages ->
// Requested results filtered against favorited Gists ->

// This functionis triggered by the Search button on the HTML page.
// This function takes the page-input parameter.
// It generates a number of requests based on that parameter.
function displaySearchResults() {
  var pageRequests = document.getElementById('page-input').value;
  for(var p = 0; p < pageRequests; p++) {
    _searchGist(p);
  }
}

// This function is called by displaySearchResults.
// It takes the numPage parameter which correlates to what page the calling
// function is at.
// This function generates the AJAX request, parses the response and filters.
// It then calls the helper function append filtered results to the list that
// gets displayed.
function _searchGist(numPage) {
  var req;
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    req = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if(!req) {
    throw 'Unable to create HttpRequest.';
  }

  // Make a request correllating to 'page-input' number
  var url = 'https://api.github.com/gists?page=' + numPage;
  req.onreadystatechange = function() {
    if(this.readyState === 4) {
      if(this.status === 200) {
        var response = JSON.parse(req.responseText);
        // Iterate through Responses/each Gist Object
        for(var i = 0; i < response.length; i++) {
          var gistObject = response[i].files;
          // Using for..in loop
          for(var langProp in gistObject) {
            if(gistObject[langProp].language === 'Javascript' &&
             document.getElementById('filter-javascript').checked) {
              _liGist(response[i], 'results');
            }
            if(gistObject[langProp].language === 'JSON' &&
             document.getElementById('filter-json').checked) {
              _liGist(response[i], 'results');
            }
            if(gistObject[langProp].language === 'sql' &&
             document.getElementById('filter-sql').checked) {
              _liGist(response[i], 'results');
            }
            if(gistObject[langProp].language === 'Python' &&
             document.getElementById('filter-python').checked) {
              _liGist(response[i], 'results');
            }
            // Selecting no languages returns all Gist results
            else if (!(document.getElementById('filter-javascript').checked) &&
             !(document.getElementById('filter-json').checked) &&
             !(document.getElementById('filter-sql').checked) &&
             !(document.getElementById('filter-python').checked)) {
               _liGist(response[i], 'results');
             }
          }
        }
      }
    }
  };
  //Make GET request
  req.open('GET', url);
  req.send();
}

function _liGist(filteredResult, objType) {
  // Create the li element
  var li = document.createElement('li');
  var ol = document.getElementById('results-gist');
  var aLink = document.createElement('a');
  var aDesc = document.createTextNode(filteredResult.description);
  // Handle for no description
  if(filteredResult.description == '') {
    aDesc = document.createTextNode('No Description.');
  }
  aLink.setAttribute('href', filteredResult.html_url);
  aLink.appendChild(aDesc);
  // Create the Add/Remove Button Element
  var button = document.createElement('input');
  button.type = 'button';
  if(objType === 'results') {
    button.value = 'Add to Favorites';
    button.setAttribute('onclick', 'addToFavorites()');
  }
  else if(objType = 'favorites') {
    button.value = 'Remove from Favorites';
    button.setAttribute('onclick', 'removeFromFavorites()');
  }

  // Append search result items to list
  li.appendChild(aLink);
  li.appendChild(button);
  ol.appendChild(li);
  return li;
}

// Begin Favorites Section
// Add to Favorites
// -Add to Favorites will remove from search results
// Remove from Favorites
// Clear Favorites

function addToFavorites() {
  var tempDesc = this.parentNode.firstElementChild.innerText;
  var tempUrl = this.parentNode.firstElementChild.getAttribute('href');
  var tempFav = new favObject(tempDesc, tempUrl);
  saveFavorite(tempFav);
  var _ol = document.getElementById('favorites-gist');
  _ol.appendChild(_liGist(tempFav, 'favorites'));
  this.parentNode.parentNode.removeChild(this.parentNode);
}

function favObject(fDesc, fUrl) {
  this.description = fDesc;
  this.html_url = fUrl;
}

function saveFavorite(gistObj) {
  if(localStorage.getItem('storedFavs') === null) {
    var newFavArray = new Array();
    newFavArray.push(gistObj);
    localStorage.setItem('storedFavs', JSON.stringify(newFavArray));
  }
  else {
    var existingList = JSON.parse(localStorage.getItem('storedFavs'));
    existingList.push(gistObj);
    localStorage.setItem('storedFavs', JSON.stringify(existingList));
  }
}

function getFavoritesString() {
  var savedFav = localStorage.getItem('stringFav');
  var parsedFav = new Array();
  if(savedFav != null) {
    parsedFav = JSON.parse(savedFav);
  }
  return parsedFav;
}

function removeFromFavorites() {

}

function displayFavorites() {

}

function clearFavorites() {
  localStorage.clear();
}

window.onload = function() {

}
