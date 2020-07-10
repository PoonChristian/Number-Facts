(function() {
  // Select DOM elements
  let option = document.querySelector('#metric-select');
  let fact = document.querySelector('#fact');
  let factText = document.querySelector('#factText');

  let numberInput = document.querySelector('#numberInput');
  let dayInput = document.querySelector('#dayInput');

  // Initialize Numbers API URL and optionString
  let url = 'http://numbersapi.com/'
  let optionString = '';

  // 1. Hide display
  // 2. Change the placeholder for the first input if the option is "date"
  // 3. Reset all input values
  let resetDisplay = function() {
    fact.style.display = 'none';
    optionString === 'date' ? numberInput.setAttribute('placeholder', "Enter a month...") : numberInput.setAttribute('placeholder', 'Enter any number...');
    numberInput.value = '';
    dayInput.value = '';
  }

  // 1. Set the optionString every time the user changes the option
  // 2. If the option is "date", then display the second text input
  // 3. Reset the display
  let configureOption = function(event) {
    let selectedOption = event.target.value;
    if (selectedOption === 'trivia') {
      optionString = '';
    } else {
      if (selectedOption === 'date') {
        dayInput.style.display = 'block';
      } else {
        dayInput.style.display = 'none';
      }
      optionString = selectedOption;
    }
    resetDisplay();
  }

  // Generate a url and a flag to determine if the url is valid
  let generateValidUrl = function() {
    let number = numberInput.value; // This number will be the month if the option is date
    let newUrl = url;
    let valid = true;

    if (optionString === 'date') {
      let day = dayInput.value;
      if (number.length > 0 && day.length > 0) {
        newUrl += `${number}/${day}/${optionString}`;
      } else {
        valid = false;
        factText.style.display = 'block';
        factText.innerText = "Please input a value for both inputs";
      }
    } else {
      if (number === '') {
        valid = false;
      } else {
        if (optionString !== '') {
          newUrl += `${number}/${optionString}`;
        } else {
          newUrl += number;
        }
      }
    }

    return [newUrl, valid];
  }

  // Option 1: use Ajax to asynchronously retrieve data from the url
  let getFactAjax = function() {
    let [newUrl, valid] = generateValidUrl();
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', newUrl);

    xhr.onload = function() {
      if (this.status === 200 && valid) {
        fact.style.display = 'block';
        factText.innerText = this.responseText;
      }
    }

    xhr.send();
  }

  // Option 2: use Fetch API to asynchronously retrieve data from the url
  let getFactFetch = function() {
    let [newUrl, valid] = generateValidUrl();

    if (valid) {
      fetch(newUrl)
      .then(res => res.text())
      .then(data => {
        fact.style.display = 'block';
        factText.innerText = data;
      })
      .catch(err => console.log(err));
    }
  }

  option.addEventListener('input', configureOption);

  // Request option #1:
  // numberInput.addEventListener('input', getFactAjax);
  // dayInput.addEventListener('input', getFactAjax);

  // Request option #2:
  numberInput.addEventListener('input', getFactFetch);
  dayInput.addEventListener('input', getFactFetch);
})();