let deck = [];
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;

const dealerCardsDiv = document.getElementById("dealer-cards");
const playerCardsDiv = document.getElementById("player-cards");
const dealerScoreText = document.getElementById("dealer-score");
const playerScoreText = document.getElementById("player-score");
const resultText = document.getElementById("result");

document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stand").addEventListener("click", stand);
document.getElementById("restart").addEventListener("click", startGame);

function createDeck() {
    const suits = ["♠", "♣", "♦", "♥"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    
    deck = deck.sort(() => Math.random() - 0.5); // Shuffle deck
}

function calculateScore(cards) {
    let score = 0;
    let aces = 0;

    for (let card of cards) {
        if (["J", "Q", "K"].includes(card.value)) {
            score += 10;
        } else if (card.value === "A") {
            score += 11;
            aces += 1;
        } else {
            score += parseInt(card.value);
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }

    return score;
}

function dealCard(player) {
    const card = deck.pop();
    player.push(card);
}

function renderCards() {
    dealerCardsDiv.innerHTML = "";
    playerCardsDiv.innerHTML = "";

    dealerCards.forEach((card, index) => {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.innerText = index === 0 ? "🂠" : `${card.value} ${card.suit}`;
        dealerCardsDiv.appendChild(cardDiv);
    });

    playerCards.forEach(card => {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.innerText = `${card.value} ${card.suit}`;
        playerCardsDiv.appendChild(cardDiv);
    });

    dealerScoreText.innerText = `Score: ${dealerScore}`;
    playerScoreText.innerText = `Score: ${playerScore}`;
}

function hit() {
    dealCard(playerCards);
    playerScore = calculateScore(playerCards);
    renderCards();

    if (playerScore > 21) {
        resultText.innerText = "You Busted! Dealer Wins!";
        disableButtons();
    }
}

function stand() {
    while (dealerScore < 17) {
        dealCard(dealerCards);
        dealerScore = calculateScore(dealerCards);
    }

    renderCards();
    checkWinner();
}

function checkWinner() {
    if (dealerScore > 21 || playerScore > dealerScore) {
        resultText.innerText = "You Win!";
    } else if (dealerScore > playerScore) {
        resultText.innerText = "Dealer Wins!";
    } else {
        resultText.innerText = "It's a Tie!";
    }
    disableButtons();
}

function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
}

function startGame() {
    createDeck();
    dealerCards = [];
    playerCards = [];

    dealCard(playerCards);
    dealCard(playerCards);
    dealCard(dealerCards);
    dealCard(dealerCards);

    dealerScore = calculateScore(dealerCards);
    playerScore = calculateScore(playerCards);

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
    resultText.innerText = "";

    renderCards();
}

startGame();
