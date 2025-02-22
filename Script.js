// Deklarasi variabel utama
let deck = [];
let playerCards = [];
let dealerCards = [];
let playerTotal = 0;
let dealerTotal = 0;
let isGameOver = false;

// Mengambil elemen dari HTML
const message = document.getElementById("message");
const playerCardsDiv = document.getElementById("player-cards");
const dealerCardsDiv = document.getElementById("dealer-cards");
const playerTotalSpan = document.getElementById("player-total");
const dealerTotalSpan = document.getElementById("dealer-total");

const startGameBtn = document.getElementById("start-game");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");

// Membuat dek kartu
function createDeck() {
    const suits = ["♥", "♦", "♣", "♠"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    deck = [];
    
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    deck = shuffleDeck(deck);
}

// Mengacak urutan kartu
function shuffleDeck(deck) {
    return deck.sort(() => Math.random() - 0.5);
}

// Mengambil kartu dari dek
function drawCard() {
    return deck.pop();
}

// Menghitung nilai total kartu
function calculateTotal(cards) {
    let total = 0;
    let aceCount = 0;
    
    for (let card of cards) {
        if (card.value === "A") {
            total += 11;
            aceCount++;
        } else if (["J", "Q", "K"].includes(card.value)) {
            total += 10;
        } else {
            total += parseInt(card.value);
        }
    }

    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}

// Memulai permainan
function startGame() {
    isGameOver = false;
    createDeck();

    playerCards = [drawCard(), drawCard()];
    dealerCards = [drawCard(), drawCard()];
    
    updateGameState();
    message.textContent = "Ambil kartu atau tahan!";
    
    hitBtn.disabled = false;
    standBtn.disabled = false;
    startGameBtn.disabled = true;
}

// Memperbarui tampilan kartu dan skor
function updateGameState() {
    playerTotal = calculateTotal(playerCards);
    dealerTotal = calculateTotal(dealerCards);

    playerCardsDiv.innerHTML = playerCards.map(card => `<span>${card.value}${card.suit}</span>`).join(" ");
    dealerCardsDiv.innerHTML = dealerCards.map(card => `<span>${card.value}${card.suit}</span>`).join(" ");
    
    playerTotalSpan.textContent = playerTotal;
    dealerTotalSpan.textContent = isGameOver ? dealerTotal : "?";

    if (playerTotal > 21) {
        endGame("Anda kalah! Skor melebihi 21.");
    }
}

// Pemain mengambil kartu
function hit() {
    if (isGameOver) return;
    
    playerCards.push(drawCard());
    updateGameState();
}

// Pemain memilih tahan
function stand() {
    if (isGameOver) return;
    
    while (dealerTotal < 17) {
        dealerCards.push(drawCard());
        dealerTotal = calculateTotal(dealerCards);
    }
    
    isGameOver = true;
    updateGameState();
    
    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        endGame("Selamat, Anda menang!");
    } else if (playerTotal < dealerTotal) {
        endGame("Anda kalah! Dealer menang.");
    } else {
        endGame("Seri! Tidak ada pemenang.");
    }
}

// Menentukan hasil permainan
function endGame(result) {
    message.textContent = result;
    dealerTotalSpan.textContent = dealerTotal;
    
    hitBtn.disabled = true;
    standBtn.disabled = true;
    startGameBtn.disabled = false;
}

// Event listeners untuk tombol
startGameBtn.addEventListener("click", startGame);
hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);
