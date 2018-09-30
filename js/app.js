/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb","fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

let ul = document.getElementById("masterdeck");
let panelWon = document.getElementsByClassName("game-won");
let cardOpen = 0;
let cardTracker = [];
let wait = "";
let totalCards = cards.length;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function displayDeck(array) {
    let cardOuput = "";
    for (let card of array) {
        cardOuput += '<li class="card closed">\n' +
            '                <i class="fa '+card+'"></i>\n' +
            '            </li>\n';
    }
    //console.log(cardOuput);
    ul.innerHTML = cardOuput;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function initDeck() {
    //create array of cards
    let cardSet = [...shuffle(cards)];
    //console.log(cardSet);

    //empty deck
    ul.innerHTML = '';

    //remove win screen
    panelWon[0].classList.remove("show");

    displayDeck(cardSet);
    return false;
}

//restart game
function restartGame() {
    //reset cards
    initDeck();
    //zero moves
    let counter = document.getElementsByClassName("moves");
    counter[0].innerHTML = "0";
    //remove stars for moves

}

//wining game
function gameWon() {
    panelWon[0].classList.add("show");
}

//stars logic
function starsLogic(moves) {
    let panelStars = document.getElementsByClassName("stars");
    console.log(panelStars);
    let starsValue = "0";
    if (moves > cards.length / 2) { // 1 star
        //panelStars[0].children[0].classList.add("fa");
        panelStars[0].children[0].classList.remove("fa-star-o");
        panelStars[0].children[0].classList.add("fa-star");

       // panelStars[0].children[1].classList.add("fa");
        panelStars[0].children[1].classList.add("fa-star-o");

        //panelStars[0].children[2].classList.add("fa");
        panelStars[0].children[2].classList.add("fa-star-o");
        starsValue = "1";
    } else if (moves < cards.length / 2) { // 2 stars
        //panelStars[0].children[0].classList.add("fa");
        panelStars[0].children[0].classList.remove("fa-star-o");
        panelStars[0].children[0].classList.add("fa-star");

        //panelStars[0].children[1].classList.add("fa");
        panelStars[0].children[1].classList.remove("fa-star-o");
        panelStars[0].children[1].classList.add("fa-star");

        //panelStars[0].children[2].classList.add("fa");
        panelStars[0].children[2].classList.add("fa-star-o");
        starsValue = "2";
    } else if (moves === cards.length / 2) { // 3 stars
        //panelStars[0].children[0].classList.add("fa");
        panelStars[0].children[0].classList.remove("fa-star-o");
        panelStars[0].children[0].classList.add("fa-star");

        //panelStars[0].children[1].classList.add("fa");
        panelStars[0].children[1].classList.remove("fa-star-o");
        panelStars[0].children[1].classList.add("fa-star");

        //panelStars[0].children[2].classList.add("fa");
        panelStars[0].children[2].classList.remove("fa-star-o");
        panelStars[0].children[2].classList.add("fa-star");
        starsValue = "3";
    }

    let panelWonStars = document.getElementsByClassName("starsText");
    panelWonStars[0].innerHTML = starsValue;
}

//restart game
function counterMove() {
    let counter = document.getElementsByClassName("moves");
    //get current count
    let currentCounter = counter[0].innerHTML;
    currentCounter = parseInt(currentCounter) + 1;
    counter[0].innerText = currentCounter;
    //populate winning screen
    let panelWonMoves = document.getElementsByClassName("movesText");
    panelWonMoves[0].innerHTML = currentCounter;
    starsLogic(currentCounter);
}

//check matching cards
function isMatching(crd1, crd2) {
    if (crd1 === crd2) {
        totalCards = totalCards - 2;
        if (totalCards === 0) { gameWon(); }
        return true;
    } else {
        return false;
    }
}

function foldCards() {
    wait = setTimeout(function(){
        cardTracker[0].classList.remove("open");
        cardTracker[0].classList.remove("show");
        cardTracker[0].classList.add("closed");
        cardTracker[1].classList.remove("open");
        cardTracker[1].classList.remove("show");
        cardTracker[1].classList.add("closed");
        cardTracker = [];
        cardOpen = 0;
    }, 1000);
}

function matchCards() {
    wait = setTimeout(function(){
        cardTracker[0].classList.add("match");
        cardTracker[0].classList.remove("closed");

        cardTracker[1].classList.add("match");
        cardTracker[1].classList.remove("closed");
        cardTracker = [];
        cardOpen = 0;
    }, 1000);
}

//logic card event
function showCard(e) {
    if (cardOpen === 0) {
        e.target.classList.remove("closed");
        e.target.classList.add("open");
        e.target.classList.add("show");
        cardTracker.push(e.target);
    } else if (cardOpen === 1) {
        e.target.classList.remove("closed");
        e.target.classList.add("open");
        e.target.classList.add("show");
        cardTracker.push(e.target);
        //two cards are up
        counterMove();
        if (isMatching(cardTracker[0].lastElementChild.className, cardTracker[1].lastElementChild.className)) {
            //matching keep
            matchCards();
        } else {
            //does not match fold
            foldCards();
        }
    }
    cardOpen++;
}

//click events manager
document.addEventListener('click', function (event) {

    //list of click events on the page
    if (event.target.matches('.fa-repeat')) { restartGame() }
    if (event.target.matches('.card.closed')) { showCard(event); }
    if (event.target.matches('.btnPlayAgain')) { initDeck(); }

    // Don't follow the link
    event.preventDefault();

    // Log the clicked element in the console
    //console.log(event.target);

}, false);
initDeck();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
