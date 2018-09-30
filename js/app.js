/*
 * Create a list that holds all of your cards
 */
const temp = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
const cards = temp.concat(temp);

let ul = document.getElementById("masterdeck");
let timerDiv = document.getElementById("timer");
let panelWon = document.getElementsByClassName("game-won");
let panelWonMoves = document.getElementsByClassName("movesText");
let counter = document.getElementsByClassName("moves");
let cardOpen = 0;
let cardTracker = [];
let wait = "";
let totalCards = cards.length;
let timer = new Timer();

function displayDeck(array) {
    let cardOuput = "";
    for (let card of array) {
        cardOuput += '<li class="card closed">\n' +
            '                <i class="fa '+card+'"></i>\n' +
            '            </li>\n';
    }
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

    //empty deck
    ul.innerHTML = '';

    //reset moves
    counter[0].innerText = "0";

    //init timer
    timer.start();
    timer.addEventListener('secondsUpdated', function (e) {
        timerDiv.innerHTML = timer.getTimeValues().toString();
    });

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
    //reset timer
    timer.reset();
    //reset cards array
    cardTracker = [];
}

//wining game
function gameWon() {
    panelWon[0].classList.add("show");
    //zero timer win
    let winTimer = document.getElementsByClassName("timeText");
    winTimer[0].innerHTML = timerDiv.innerHTML;
}

//stars logic
function starsLogic(moves) {
    let panelStars = document.getElementsByClassName("stars");

    //markup
    let fullStar = '<li><i class="fa fa-star"></i></li>';
    let noStar = '<li><i class="fa fa-star-o"></i></li>';

    let starsValue = "0";
    if (moves <= cards.length) { // 3 star
        panelStars[0].innerHTML = fullStar+fullStar+fullStar;
        starsValue = "3";
    } else if (moves <= cards.length && moves > cards.length) { // 2 stars
        panelStars[0].innerHTML = fullStar+fullStar+noStar;
        starsValue = "2";
    } else if (moves > cards.length) { // 1 stars
        panelStars[0].innerHTML = fullStar+noStar+noStar;
        starsValue = "1";
    }

    let panelWonStars = document.getElementsByClassName("starsText");
    panelWonStars[0].innerHTML = starsValue;
}

//restart game
function counterMove() {
    //get current count
    let currentCounter = counter[0].innerHTML;
    currentCounter = parseInt(currentCounter) + 1;
    counter[0].innerText = currentCounter;
    //populate winning screen
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

}, false);
initDeck();

