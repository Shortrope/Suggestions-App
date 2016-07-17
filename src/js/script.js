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
    menuToggle = document.getElementById('menu_toggle'),
    editMenuItem = document.getElementById('edit_menu_item'),
    doneMenuItem = document.getElementById('done_menu_item'),
    appPage = document.getElementById('app'),
    managePage = document.getElementById('manage');

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
    if (suggestions.length > 1) {
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
      return '';
    }
  }

  function displaySuggestion(item) {
    suggestion.innerHTML = item;
  }

  function displaySuggestionsUL() {
    var output = '';
    for (var i = 0; i < suggestions.length; i++) {
      output += '<li>';
      output += '<div><button class="btn" data-index="' + i + '">X</button></div>';
      output += '<div>' + suggestions[i] + '</div>';
      output += '</li>';
    }
    listUL.innerHTML = output;
  }

  function isDuplicate(item) {
    var result = suggestions.every(function (curr) {
      return curr.toLowerCase() !== item.toLowerCase();
    });
    
    return !result;
  }


  ////////////////////////////////////////////////////////////////////////
  // Event Listeners

  editMenuItem.addEventListener('click', function displayEditList(evt) {
    appPage.classList.add('hidden');
    managePage.classList.remove('hidden');
    editMenuItem.classList.add('hidden');
    doneMenuItem.classList.remove('hidden');
  });
  doneMenuItem.addEventListener('click', function displayDoneList(evt) {
    appPage.classList.remove('hidden');
    managePage.classList.add('hidden');
    doneMenuItem.classList.add('hidden');
    editMenuItem.classList.remove('hidden');
  });
  //  });

  nextBtn.addEventListener('click', function nextFn() {
    displaySuggestion(nextSuggestion());
    if (suggestions.length === 0) {
      displaySuggestion('You don\'t have any Suggestions in your list yet...');
      nextBtn.innerHTML = 'Edit Your List >';
    }
  });

  addBtn.addEventListener('click', function addFn() {
    var item = suggestionInput.value.trim();
    if (item === '') {
      suggestionInput.placeholder = 'enter new suggestion';
      suggestionInput.style.borderColor = '#f99';
    } else if (isDuplicate(item)) {
      suggestionInput.value = '';
      suggestionInput.placeholder = '\'' + item.toLowerCase() + '\' already in list';
      suggestionInput.style.borderColor = '#f99';
    } else {
      suggestions.unshift(item);
      localStorage.setItem('suggestions', suggestions.toString());
      displaySuggestionsUL();
      suggestionInput.value = '';
      suggestionInput.placeholder = 'enter new suggestion';
      suggestionInput.style.border = '1px solid #bbb';
    }
    suggestionInput.value = '';
    suggestionInput.focus();
  });

  listUL.addEventListener('click', function ulClickFn(evt) {
    console.log(evt);
    if (evt.target.nodeName === 'BUTTON') {
      var i = evt.srcElement.dataset.index;
      console.log(i);
      suggestions.splice(i, 1);
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
  suggestionInput.placeholder = 'enter new suggestion';

});
