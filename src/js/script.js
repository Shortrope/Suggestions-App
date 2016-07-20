document.addEventListener('DOMContentLoaded', function () {
  ////////////////////////////////////////////////////////////////////////
  // Variables

  var suggestions = [],
    currentSuggestion,
    suggestion = document.getElementById('suggestion'),
    nextBtn = document.getElementById('next_btn'),
    suggestionInput = document.getElementById('suggestion_input'),
    addBtn = document.getElementById('add_btn'),
    doneBtn = document.getElementById('done_btn'),
    listUL = document.getElementById('list'),
    menuToggle = document.getElementById('menu_toggle'),
    editMenuItem = document.getElementById('edit_menu_item'),
    doneMenuItem = document.getElementById('done_menu_item'),
    appPage = document.getElementById('app'),
    managePage = document.getElementById('manage'),
    emptyListMessage = 'You Don\'t have any Suggestions in your list yet...';

  ////////////////////////////////////////////////////////////////////////
  // Functions

  function isStorageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function getRandomIndex(arr) {
    return Math.floor(Math.random() * arr.length);
  }
  
  function nextRandomSuggestion() {
    var i;
    if (suggestions.length > 1) {
      do {
        i = getRandomIndex(suggestions);
        // do not use same suggestion 2 times in a row
      } while (suggestions[i] === currentSuggestion);
      return suggestions[i];
    } else if (suggestions.length === 1) {
      return suggestions[0];
    } else {
      return '';
    }
  }

  function setCurrentSuggestion(item) {
    currentSuggestion = item;
    localStorage.currentSuggestion = item;
  }

  function displaySuggestion(item) {
    suggestion.innerHTML = item;
  }

  function setNextBtnText() {
    if (suggestions.length === 0) {
      nextBtn.innerHTML = 'Get Started';
    } else {
      nextBtn.innerHTML = 'Next Suggestion';
    }
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

  function initSuggestionPage() {
    if (suggestions.length === 0) {
      displaySuggestion(emptyListMessage);
    } else {
      if (currentSuggestion) {
        displaySuggestion(currentSuggestion);
      } else {
        setCurrentSuggestion(nextRandomSuggestion());
        displaySuggestion(currentSuggestion);
      }
    }
    setNextBtnText();
  }

  function initEditPage() {
    displaySuggestionsUL();
    suggestionInput.placeholder = 'enter new suggestion';
    suggestionInput.style.border = '1px solid #bbb';
    if (suggestions.length === 0) {
      doneBtn.classList.add('hidden');
    } else {
      doneBtn.classList.remove('hidden');
    }
  }
  
  function isDuplicate(item) {
    var result = suggestions.every(function (curr) {
      return curr.toLowerCase() !== item.toLowerCase();
    });
    return !result;
  }

  function isCurrentSuggestion(item) {
    return item === currentSuggestion;
  }
  
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


  ////////////////////////////////////////////////////////////////////////
  // Event Listeners

  editMenuItem.addEventListener('click', function displayEditList(evt) {
    appPage.classList.add('hidden');
    managePage.classList.remove('hidden');
    editMenuItem.classList.add('hidden');
    doneMenuItem.classList.remove('hidden');
    initEditPage();
  });
  doneMenuItem.addEventListener('click', function displayDoneList(evt) {
    appPage.classList.remove('hidden');
    managePage.classList.add('hidden');
    doneMenuItem.classList.add('hidden');
    editMenuItem.classList.remove('hidden');
    initSuggestionPage();
  });
  //  });

  nextBtn.addEventListener('click', function nextFn() {
    if (suggestions.length === 0) {
      editMenuItem.click();
    } else {
      setCurrentSuggestion(nextRandomSuggestion());
      displaySuggestion(currentSuggestion);
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
    if (suggestions.length > 0) {
      doneBtn.classList.remove('hidden');
    } else {
      doneBtn.classList.add('hidden');
    }
  });

  doneBtn.addEventListener('click', function doneFn() {
    doneMenuItem.click();
  });

  // delete buttons on the suggestions list
  listUL.addEventListener('click', function ulClickFn(evt) {
    if (evt.target.nodeName === 'BUTTON') {
      var i = evt.srcElement.dataset.index;
      if (suggestions.length > 1) {
        if (isCurrentSuggestion(suggestions[i])) {
          setCurrentSuggestion(nextRandomSuggestion());
        }
      } else {
        setCurrentSuggestion('');
      }
      suggestions.splice(i, 1);
      localStorage.setItem('suggestions', suggestions.toString());
      displaySuggestionsUL();
      if (suggestions.length > 0) {
        doneBtn.classList.remove('hidden');
      } else {
        doneBtn.classList.add('hidden');
      }
    }
  }, false);

  
  ////////////////////////////////////////////////////////////////////////
  // Initialize App
  if (isStorageAvailable('localStorage')) {
    if (localStorage.getItem('suggestions')) {
      suggestions = localStorage.getItem('suggestions').split(',');
      if (localStorage.getItem('currentSuggestion')) {
        currentSuggestion = localStorage.getItem('currentSuggestion');
      } else {
        setCurrentSuggestion(nextRandomSuggestion());
      }
    } else {
      setCurrentSuggestion('');
    }
    initSuggestionPage();
    initEditPage();
  } else {
    displaySuggestion('This app requires \'localStorage\'');
  }

});
