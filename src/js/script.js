document.addEventListener('DOMContentLoaded', function () {
  ////////////////////////////////////////////////////////////////////////
  // Variables
  var suggestions = [],
      currentSuggestion,
      suggestion = document.getElementById('suggestion'),
      nextBtn = document.getElementById('next_btn'),
      suggestionInput = document.getElementById('suggestion_input'),
      addBtn = document.getElementById('add_btn'),
      listUL = document.getElementById('list');
  
  
  ////////////////////////////////////////////////////////////////////////
  // Functions
  function addSuggestion(suggestion) {
    if (suggestion) {
      suggestions.push(suggestion);
    }
  }
  
  function deleteSuggestion(suggestion) {
    var i = suggestions.indexOf(suggestion);
    suggestions.splice(i, 1);
  }
  
  // clear the suggestions array
  function clearSuggestions() {
    suggestions.splice(0, suggestions.length);
  }
  
  // get a random suggestion from the list
  function nextSuggestion() {
    var i;
    // get random number between 0 and suggestions.length
    if(suggestions.length > 1) {
      do {
        i = Math.floor(Math.random() * suggestions.length);
      // do not use same suggestion 2 times in a row
      } while (suggestions[i] === currentSuggestion);
      
      currentSuggestion = suggestions[i];
      return suggestions[i];
    } else if (suggestions.length === 1) {
      return suggestions[0];
    } else {
      return 'No Suggestions';
    }
  }
  
  function displaySuggestion(item) {
    console.log(item);
    suggestion.innerHTML = item;
  }
  
  function displaySuggestionsUL() {
    var output = '';
    for(var i = 0; i < suggestions.length; i++) {
      output += '<li>';
      output += suggestions[i];
//      output += '<button>Edit</button>';
      output += '<button data-index="' + i + '">X</button>';
      output += '</li>';
    }
    listUL.innerHTML = output;
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Event Listeners
  
  nextBtn.addEventListener('click', function nextFn() {
    displaySuggestion(nextSuggestion());
  });
  
  addBtn.addEventListener('click', function addFn() {
    var item = suggestionInput.value;
    if (item !== '') {
      if (!suggestions.includes(item)) {
        suggestions.push(item);
        displaySuggestionsUL();
      } 
      suggestionInput.value = '';
      suggestionInput.style.border = '1px solid #bbb';
    } else {
      suggestionInput.style.borderColor = '#faa';
    }
    suggestionInput.focus();
  });
  
  listUL.addEventListener('click', function ulClickFn(evt) {
    console.log(evt);
    var i = evt.srcElement.dataset.index;
    console.log(i);
    suggestions.splice(i,1);
    displaySuggestionsUL();
  }, false);
  
  
  
  ////////////////////////////////////////////////////////////////////////
  // App
  
  addSuggestion('Gulp');
  addSuggestion('Git');
  addSuggestion('Angular');
  
  suggestion.innerHTML = nextSuggestion();
  displaySuggestionsUL();
  
  
});