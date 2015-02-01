// Micheal Willard
// CS 290 Winter 2015
// Assignment 3 Part 2


// Begin Search and Results Section
// Search Gist -> initates Gist request ->
// Requested results filtered against selected languages ->
// Requested results filtered against favorited Gists ->
function displaySearchResults() {
  var pageRequests = document.getElementById('page-input').value;
  for(var p = 0; p < pageRequests; p++) {
    searchGist(p);
  }

}

function searchGist(numPage) {
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

  var url = 'https://api.github.com/gists/public?page=' + numPage;
  //Make GET request
  // req.open('GET', url);
  // req.send();
  req.onreadystatechange = function() {
    if(this.readyState === 4) {
      if(this.status === 200) {
        var response = JSON.parse(req.responseText); //req or this.
        // Iterate through Responses/each Gist Object
        for(var i = 0; i < response.length; i++) {
          var gistObject = response[i].files;
          // Using for..in loop
          for(var langProp in gistObject) {
            if(gistObject[langProp].language === 'Javascript' &&
             document.getElementById('filter-javascript').checked) {
              liGist(response[i]);
            }
            if(gistObject[langProp].language === 'JSON' &&
             document.getElementById('filter-json').checked) {
              liGist(response[i]);
            }
            if(gistObject[langProp].language === 'SQL' &&
             document.getElementById('filter-sql').checked) {
              liGist(response[i]);
            }
            if(gistObject[langProp].language === 'Python' &&
             document.getElementById('filter-python').checked) {
              liGist(response[i]);
            }
            // Selecting no languages returns all Gist results
            else if (!(document.getElementById('filter-javascript').checked) &&
             !(document.getElementById('filter-json').checked) &&
             !(document.getElementById('filter-sql').checked) &&
             !(document.getElementById('filter-python').checked)) {
               liGist(response[i]);
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

function liGist(filteredResult) {
  // Create the li element
  var li = document.createElement('li');
  var ol = document.getElementById('results-gist');
  //var resOwner = document.createElement('li');
  //resOwner.textContent = filteredResult.owner;

  var aLink = document.createElement('a');
  var aDesc = document.createTextNode(filteredResult.description);
  // Handle for no description
  if(filteredResult.description == '') {
    aDesc = document.createTextNode('No Description.');
  }
  aLink.setAttribute('href', filteredResult.html_url);
  aLink.appendChild(aDesc);
  // Append search result items to list
  //li.appendChild(resName);
  li.appendChild(aLink);
  //li.appendChild(button);
  ol.appendChild(li);
  return li;
}

// function createGistList(ol, gistList) {
//   gistList.forEach(function(s) {
//     ol.appendChild(liGist(s));
//   });
// }




// Begin Favorites Section
// Add to Favorites
// -Add to Favorites will remove from search results
// Remove from Favorites
// Clear Favorites
