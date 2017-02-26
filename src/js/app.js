// Creating main object

const App    = App || {};

// Declaring all the functions within the app

App.selectors         = selectors;
App.utils             = utils;
App.getPlayers        = getPlayers;
App.createList        = createList;
App.addEventListeners = addEventListeners;
App.createCard        = createCard;

//  Declaring all the DOM selectors used within the app

function selectors() {
  this.player              = {};
  this.player.name         = document.querySelector('.name');
  this.player.image        = document.querySelector('.player-image');
  this.player.role         = document.querySelector('.role');
  this.player.team         = document.querySelector('.team span');
  this.player.age          = document.querySelector('.age span');
  this.player.shirtNumber  = document.querySelector('.shirt-number span');
  this.player.nationalTeam = document.querySelector('.national-team span');
  this.player.random       = document.querySelector('.random span');

  this.menu                = document.querySelector('.list p');
  this.fade                = document.querySelectorAll('.fade');
  this.list                = document.querySelector('.list ul');
  this.teamLogo            = document.querySelector('.image .team-logo.fade');
}

// Declaring two utils objects

function utils() {
  // Hardcoded positions of team logos in the badges.png to set as backgrouond without cropping
  this.teams = {
    'Tottenham Hotspur': '-500px -1000px',
    'Manchester City': '-800px -700px',
    'Manchester United': '-600px -800px',
    'Arsenal': '-100px -100px',
    'Leicester City': '0px 0px'
  };

  // Specific images for each player
  this.images = {
    'Toby Alderweireld': './images/alderweireld.png',
    'Yaya Touré': './images/toure.png',
    'Wayne Rooney': './images/rooney.png',
    'Per Mertesacker': './images/mertesacker.png',
    'Riyad Mahrez': './images/mahrez.png'
  };
}

function getPlayers(){
  // Create new http request
  const request = new XMLHttpRequest();
  // Set behaviour of request on success and fail
  request.onreadystatechange = function() {
    // On request finished, check status
    if (request.readyState === request.DONE ) {
      // If return a status of 200, set the response to an attribute players and create dropdown menu dynamically
      if(request.status === 200){
        this.players = JSON.parse(request.responseText).players;
        this.createList.call(this);
        this.addEventListeners.call(this);
        // Create automatically a card from the first player in the list
        this.createCard.call(this, this.players[0].player);
      } else {
        // If returns a status different than 200, throw an error
        console.error('Something wrong happened on the server');
      }
    }
  }.bind(this);
  // Open and send the request
  request.open('GET', '/players');
  request.send();
}

// Loop through the JSON returned by the GET request and create the dropdown menu
function createList() {
  for(var i= 0; i < this.players.length; i++){
    const player = document.createElement('li');
    player.innerHTML = `${this.players[i].player.name.first} ${this.players[i].player.name.last}`;
    this.list.appendChild(player);
  }
}

// Add the event listeners to each element in the menu and the menu itself to open/close it
function addEventListeners() {
  const players = document.querySelectorAll('.list ul li');
  players.forEach((player) => {
    player.addEventListener('click', (e) => {
      const clicked = e.target;
      // Check each object in JSON to see if has the same name as the element clicked and pass it through the creatCard function
      App.players.forEach((football) => {
        const fullName = `${football.player.name.first} ${football.player.name.last}`;
        fullName === clicked.innerText ? App.createCard(football.player) : null;
      });
      App.menu.classList.remove('open');
      App.list.classList.remove('open');
    });
  });
  this.menu.addEventListener('click', function() {
    App.list.classList.toggle('open');
    this.classList.toggle('open');
  });
}

// Create card for specific player passed as an argument in the function
function createCard(player) {
  // Set opacity to all elements with the fade class to create a fade-in/fade-out effect when creating a new card
  this.fade.forEach((element) => {
    element.style.opacity = 0;
    setTimeout(() => {
      element.style.opacity = 1;
    }, 500);
  });

  // Create the actual card with a slight delay to match the opacity animation
  setTimeout(() => {
    this.menu.innerText = `${player.name.first} ${player.name.last}`;
    this.player.image.src = this.images[`${player.name.first} ${player.name.last}`];

    this.teamLogo.style.background = `#fff url("../images/badges.png") no-repeat ${this.teams[player.currentTeam.name]} scroll`;

    this.player.name.innerText = `${player.name.first} ${player.name.last}`;
    this.player.role.innerText = player.info.positionInfo;
    this.player.team.innerText = player.currentTeam.name;
    this.player.age.innerText = parseInt(player.age);
    this.player.shirtNumber.innerText = player.info.shirtNum;
    this.player.nationalTeam.innerText = player.nationalTeam.country;
    // A random number, because reasons.
    this.player.random.innerText = Math.floor(Math.random() * 100);
  }, 500);
}

// Starting the app
window.onload = function() {
  this.selectors.call(this);
  this.utils.call(this);
  this.getPlayers.call(this);
}.bind(App);
