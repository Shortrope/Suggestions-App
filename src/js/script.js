document.addEventListener('DOMContentLoaded', function () {
  ////////////////////////////////////////////////////////////////////////
  // Variables
  var suggestions = [],
      currentSuggestion,
      suggestion = document.getElementById('suggestion'),
      nextBtn = document.getElementById('next_btn'),
      suggestionInput = document.getElementById('suggestion_input'),
      addBtn = document.getElementById('add_btn'),
      listUL = document.getElementById('list'),
      menu = document.getElementById('menu'),
      menuToggle = document.getElementById('menu_toggle'),
      body = document.getElementsByTagName('body')[0],
      editMenuItem = document.getElementById('edit_menu_item'),
      doneMenuItem = document.getElementById('done_menu_item'),
      appPage = document.getElementById('app'),
      managePage = document.getElementById('manage');
  
  
  ////////////////////////////////////////////////////////////////////////
  // Polyfill: Array.includes 

  if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/ ) {
      'use strict';
      var O = Object(this);
      var len = parseInt(O.length, 10) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1], 10) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
          (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
          return true;
        }
        k++;
      }
      return false;
    };
  }

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
      localStorage.currentSuggestion = currentSuggestion;
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
//      output += '<button>Edit</button>';
      output += '<div><button class="btn" data-index="' + i + '">X</button></div>';
      output += '<div>' + suggestions[i] + '</div>';
      output += '</li>';
    }
    listUL.innerHTML = output;
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Event Listeners
  
  menu.addEventListener('click', function toggleIn(evt) {
    evt.stopPropagation();
    menuToggle.classList.toggle('slide-in'); 
    
    body.addEventListener('click', function toggleOut(outEvt) {
      menuToggle.classList.toggle('slide-in'); 
      body.removeEventListener('click', toggleOut);
    });
    
    editMenuItem.addEventListener('click', function displayEditList(displayEvt) {
      appPage.classList.add('hidden');
      managePage.classList.remove('hidden');
      editMenuItem.classList.add('hidden');
      doneMenuItem.classList.remove('hidden');
    });
    doneMenuItem.addEventListener('click', function displayDoneList(displayEvt) {
      appPage.classList.remove('hidden');
      managePage.classList.add('hidden');
      doneMenuItem.classList.add('hidden');
      editMenuItem.classList.remove('hidden');
    });
  });
  
  nextBtn.addEventListener('click', function nextFn() {
    displaySuggestion(nextSuggestion());
  });
  
  addBtn.addEventListener('click', function addFn() {
    var item = suggestionInput.value.toLowerCase();
    if (item !== '') {
      if (!suggestions.includes(item)) {
        suggestions.unshift(item);
        localStorage.setItem('suggestions', suggestions.toString());
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
    if (evt.target.nodeName === 'BUTTON') {
      var i = evt.srcElement.dataset.index;
      console.log(i);
      suggestions.splice(i,1);
      localStorage.setItem('suggestions', suggestions.toString());
      displaySuggestionsUL();
    }
  }, false);
  
  
  
  ////////////////////////////////////////////////////////////////////////
  // App
  
  if (localStorage.getItem('suggestions')) {
    suggestions = localStorage.getItem('suggestions').split(',');
  }
  if (localStorage.getItem('currentSuggestion')) {
    currentSuggestion = localStorage.getItem('currentSuggestion');
    suggestion.innerHTML = currentSuggestion;
  } else {
    suggestion.innerHTML = nextSuggestion();
  }
  displaySuggestionsUL();
  
  
});