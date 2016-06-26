document.addEventListener('DOMContentLoaded', function () {
  ////////////////////////////////////////////////////////////////////////
  // Variables
  var suggestions = [],
      currentSuggestion,
      suggestion;
  
  
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
  
  function clearSuggestions() {
    suggestions.splice(0, suggestions.length);
  }
  
  function nextSuggestion() {
    var i;
    // get random number between 0 and suggestions.length
    // do not use same suggestion 2 times in a row
    if(suggestions.length > 1) {
      do {
        i = Math.floor(Math.random() * suggestions.length);
      } while (suggestions[i] === currentSuggestion);
      
      currentSuggestion = suggestions[i];
      return suggestions[i];
    } else if (suggestions.length === 1) {
      return suggestions[0];
    } else {
      return "No Suggestions";
    }
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  // Event Listeners
  
  
  
  
  
  ////////////////////////////////////////////////////////////////////////
  // App
  
  addSuggestion('Gulp');
  addSuggestion('Git');
  addSuggestion('Angular');
  
  suggestion.innerHTML = nextSuggestion();
  
  
});