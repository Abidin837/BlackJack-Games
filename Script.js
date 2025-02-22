let deck, playerHand, dealerHand, balance = 1000, bet = 100;
const balanceSpan = document.getElementById("balance");
const betSpan = document.getElementById("bet");
const dealerCards = document.getElementById("dealer-cards");
const playerCards = document.getElementById("player-cards");
const resultDiv = document.getElementById("result");

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("hit").addEventListener("click", playerHit);
document.getElementById("stand").addEventListener("click", dealerPlay);
document.getElementById("restart").addEventListener("click", restartGame);

function createDeck() {
    let suits = ["♥", "♦", "♠", "♣"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let newDeck = [];
    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ value, suit });
        }
    }
    return newDeck.sort(() => Math.random() - 0.5);
}

function startGame() {
    if (balance < bet) {
        alert("Saldo tidak cukup untuk bertaruh!");
        return;
    }
    balance -= bet;
    balanceSpan.textContent = balance;
    betSpan.textContent = bet;

    deck = createDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];

    displayCards(playerCards, playerHand);
    displayCards(dealerCards, [dealerHand[0], { value: "?", suit: "?" }]);

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
    document.getElementById("start-game").disabled = true;
}

function drawCard() {
    return deck.pop();
}

function displayCards(container, hand) {
    container.innerHTML = "";
    for (let card of hand) {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.textContent = `${card.value}${card.suit}`;
        container.appendChild(cardDiv);
    }
}

function getHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
        if (card.value === "A") {
            aces += 1;
            value += 11;
        } else if (["J", "Q", "K"].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }
    return value;
}

function playerHit() {
    playerHand.push(drawCard());
    displayCards(playerCards, playerHand);
    
    if (getHandValue(playerHand) > 21) {
        endGame("Kamu kalah! Kartu kamu lebih dari 21.");
    }
}

function dealerPlay() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;

    displayCards(dealerCards, dealerHand);
    
    while (getHandValue(dealerHand) < 17) {
        dealerHand.push(drawCard());
        displayCards(dealerCards, dealerHand);
    }

    let playerScore = getHandValue(playerHand);
    let dealerScore = getHandValue(dealerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame("Selamat! Kamu menang!", true);
    } else if (playerScore < dealerScore) {
        endGame("Kamu kalah! Dealer menang.");
    } else {
        endGame("Seri! Tidak ada pemenang.");
        balance += bet;
    }
}

function endGame(message, win = false) {
    resultDiv.textContent = message;
    if (win) balance += bet * 2;
    balanceSpan.textContent = balance;
    document.getElementById("start-game").disabled = false;
}

function restartGame() {
    balance = 1000;
    balanceSpan.textContent = balance;
    betSpan.textContent = bet;
    resultDiv.textContent = "";
    playerCards.innerHTML = "";
    dealerCards.innerHTML = "";
    document.getElementById("start-game").disabled = false;
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
}
