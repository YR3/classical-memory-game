
 // Create a list that holds all of your cards
 const cardsList = document.getElementsByClassName("card");
// console.log(cardsList);

 //  - Display the cards on the page
 const callCards = Array.prototype.slice.call(cardsList);
// console.log(callCards);

//   - shuffle the list of cards
 const shuffledCards = shuffle(callCards);
// console.log(shuffledCards);

//   - loop through each card and create its HTML
let loopThroMe = "";
for (i=0; i<shuffledCards.length; i++) {
	loopThroMe += shuffledCards[i].outerHTML;
}
 //   - add each card's HTML to the page
 function addCards () {
	document.getElementById("deck").innerHTML = loopThroMe;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Empty vars to keep track of cards and count
let openedCards = [];
let matchedCards = [];
let matchedCardsCount = 0;
let moveCount = 0;
let currentCards;
let toBeHiddenCards;

// Welcome the player and ask for name
const welcomePopUp = document.getElementById('welcome-popup');
const closing = document.getElementById("close-x");
const starting = document.getElementById("start");
const person = prompt("Please enter your name:", "Harry Potter");
if (person != null) {
	welcomePopUp.style.display='block';
	document.getElementById("welcome-message").innerHTML =
	"Hello " + person + "! How are you today?";
  }
window.onclick = function(event) {
	if (event.target == welcomePopUp) {
	  welcomePopUp.style.display = "none";
	}
  }
 closing.onclick = function(event) {
	if (event.target == closing) {
		welcomePopUp.style.display = "none";
	}
 }
 starting.onclick = function(event) {
	if (event.target == starting) {
		welcomePopUp.style.display = "none";
	}
 }

// To select all cards in 'restart' function
const allCards = document.getElementsByClassName('card');
// Spawn a close button for sucess modal
const closeButton = document.getElementById("success-modal-close")
// Spawn a modal that congrats the player for matching all cards
const successModal = document.getElementById('success-modal');
// Spawn a 'restart button' on modal
const playAgainButton = document.getElementById('button-restart');
// Always-on restart button above the cards deck
const restartButton = document.getElementsByClassName("restart")[0];
restartButton.addEventListener('click', restartGame);

// Game engine and sensors (listeners)

addCards();

//Click listener for the whole page
	document.body.addEventListener('click', function(e) {
		
		// If it is a hidden card has been clicked
	if (e.target.classList.contains("hidden") && (document.querySelectorAll('.reveal').length < 2)) {	
		if (document.querySelectorAll('.hidden').length == 16 && moveCount === 0) {
			runTimer();
		}
		// console.log("a hidden card was clicked!");
		// Cards matcher 2000!
		let classMatch = e.target.querySelector('i').className;																	

			// No opened cards, first card were opened
			if (openedCards.length < 1) {
				// console.log("Open another card!");
				//Show the card
				revealCard(e);
				//add it to the open card list
				addOpenCard(e);
			
			// Two cards open, start matching
			} else {
				// console.log("Matching..");
					if (openedCards.includes(classMatch)) {
						matchedCards.push(classMatch);
						//Show the card
						revealCard(e);
						// Matches the cards, keeps them open
						matched();
						// Update the move counter
						updateMoveCounter();
						// Re-initialise cards and listeners
						openedCards = [];
					} else {
						// Show the card
						revealCard(e);
						// No match, hide the card
						hideCards();

					}
			}

	}  else {
		console.log("Huh?");
	}
});	

// Game Functions

function closeWelcome() {
	startButton.addEventListener('click', function () {
		welcomePopUp.style.display = 'none';
	});	
	window.addEventListener('click', windowCloseWelcome);
	playAgain();
}

function windowCloseWelcome (e) {
	if (e.target == welcomePopUp) {
		welcomePopUp.style.display = 'none';
	}
}

// Increments the move counter
function updateMoveCounter() {
	moveCount += 1;
	// If its a one move make it "move"
	if (moveCount === 1) {
		document.getElementById("movesMade").innerHTML =moveCount+" Move";
	// If its more than one move add the "S"	
	} else {
		document.getElementById("movesMade").innerHTML =moveCount+" Moves";
	}
	// Update the stars accordingly
	adjustStars();
	// console.log(moveCount);
}

 // Handles the matched cards
function matched() {
	// Incremnets the matched counter
	matchedCardsCount += 1;
		// Always checking if player can win
		setTimeout(function() {
		currentCards = document.querySelectorAll(".reveal");
		for (let i = 0; i< currentCards.length; i++) {
			currentCards[i].className = "card match";
			}
		winCheck();
		}, 1000);
}

function hideCards () {
	openedCards = [];
	toBeHiddenCards = document.querySelectorAll(".reveal");

	// Goes red and shakes indicating a wrong choice
	setTimeout(function() {
		for (let i = 0; i< toBeHiddenCards.length; i++) {
			toBeHiddenCards[i].className += " wrong";
			}
	}, 1000);


	setTimeout(function() { 
		// cards hidden
		console.log(toBeHiddenCards);
		for (let i = 0; i< toBeHiddenCards.length; i++) {
			toBeHiddenCards[i].className = "card hidden";
			}
			}, 3000);
		updateMoveCounter();

	}

// Opens the card
function revealCard(e) {
	e.target.classList.add('reveal', 'open');
	e.target.classList.remove('hidden');
	}

// Adds the card to the matching engine
function addOpenCard (e) {
	let classMatch = e.target.querySelector('i').className;
	openedCards.push(classMatch);
	}

// Check if all 8 cards are matched therefore, congrat the player	
function winCheck () {
	if (matchedCardsCount === 8) {
		stopTimer();
		// Display the Congrat Modal
		successModal.style.display='block';
		// Display the congrat modal header
		document.getElementById('congrats').innerHTML = "Congratulations " + person + "!";
		// Congrat modal message
		document.getElementById('success-message').innerHTML = "You won " + person + "! You completed the game in "+ moveCount + " moves and in a time of " + completedTime + "!";
		// If won with less than 16 moves he gets three stars
	if (moveCount > 0 && moveCount < 16) {
		document.getElementById('star-rating-message').innerHTML = "<i class='fa fa-star'><i class='fa fa-star'><i class='fa fa-star'>";
	}
		// If won with less than 24 moves he gets two stars
	if (moveCount > 16 && moveCount < 24) {
	document.getElementById('star-rating-message').innerHTML = "<i class='fa fa-star'><i class='fa fa-star'>";
	}
	// If won with less than 26 moves he gets one star
	if (moveCount > 24 && moveCount < 26) {
	document.getElementById('star-rating-message').innerHTML = "<i class='fa fa-star'>";
	}
	// If won with more than 27 moves he gets no stars
	if(moveCount > 27) {
		document.getElementById('star-rating-message').innerHTML = "No stars :( Try to complete in less moves next time " + person + ".";
	}
}
		closeModal();
		

	}

 // Restart the game
function playAgain () {
	playAgainButton.addEventListener('click', restartGame);
	displayTimer.textContent = "0:00";
}

// Closing the success modal function
function closeModal () {
	closeButton.addEventListener('click', function () {
		successModal.style.display = 'none';
	});	
	window.addEventListener('click', windowCloseModal);
	playAgain();
}
// Hide the window
function windowCloseModal (e) {
	if (e.target == successModal) {
		successModal.style.display = 'none';
	}
}

// Reset game
function restartGame () {
	// Loop through all cards and hide them
	for (let i = 0; i< allCards.length; i++) {
			allCards[i].className = "card hidden";
			}

	// Reset all counters
	addCards();
	moveCount = 0;
	document.getElementById("movesMade").innerHTML = moveCount;
	openedCards = [];
	matchedCards = [];
	currentCards = '';
	toBeHiddenCards = '';

	// Hide modal if not hidden already
	successModal.style.display = 'none';
	stopTimer();
	displayTimer.textContent = "0:00";
	// Reset move counter
	document.getElementById("movesMade").innerHTML =moveCount+" Moves";

}


// Timer
const displayTimer = document.querySelector('#timer');
let clock;
let timerStart;
let timeNow;
let timerEnd;
let secondsElapsed;
let minutesElapsed;
let secondsRounded;
let secondsFormatted;
let timeElapsed;
let completedTime;
let clickToRun;

// Start the timer 
function runTimer() {
	timerStart = Date.now();
	clock = setInterval(function() {
	displayTime(clock);
	}, 1000)

	document.removeEventListener('click', runTimer);
}

// Stop the timer and log the elapsed time
function stopTimer() {

	clearInterval(clock);
	completedTime = document.querySelector('#timer').textContent;
}
// Time display format
function displayTime(clock) {
	timeNow = Date.now();
	secondsElapsed = (timeNow - timerStart) / 1000;
	minutesElapsed = Math.floor(secondsElapsed / 60);
	secondsRounded = Math.floor(secondsElapsed % 60);
	secondsFormatted = secondsRounded < 10 ? '0'+secondsRounded: secondsRounded;
	timeElapsed = minutesElapsed+":"+secondsFormatted;
	displayTimer.textContent = timeElapsed;
}

// Star rating system V1.0

const starRating = document.getElementsByClassName('stars')[0];
function adjustStars () {
	// Thresholds for moves are 16, 24 and 26 
	if (moveCount > 16) {
		starRating.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star' style='color:#d3d3d3'></i></li>";
	}
	if (moveCount > 24) {
		starRating.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star' style='color:#d3d3d3'></i></li><li><i class='fa fa-star' style='color:#d3d3d3'></i></li>";
	}
	if (moveCount > 26) {
		starRating.innerHTML = "<li><i class='fa fa-star' style='color:#d3d3d3'></i></li><li><i class='fa fa-star' style='color:#d3d3d3'></i></li><li><i class='fa fa-star' style='color:#d3d3d3'></i></li>";
	}

	if(moveCount > 27) {
		starRating.innerHTML = "<li><i class='fa fa-frown-o'></i></li>";
	}
}

