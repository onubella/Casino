// Game variables
let balance = 1000;

const symbols = ['�', '💎', '👑', '🎲', '💰', '⭐'];

function updateBalance(amount) {
    balance += amount;
    if (balance < 0) balance = 0;
    document.getElementById('balance').textContent = balance;
}

function resetBalance() {
    balance = 1000;
    document.getElementById('balance').textContent = balance;
    clearResults();
}

function switchGame(gameName) {
    // Hide all games
    document.querySelectorAll('.game-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    // Show selected game
    document.getElementById(gameName + '-game').classList.add('active');
    event.target.classList.add('active');
    
    clearResults();
}

function clearResults() {
    document.getElementById('slot-result').textContent = '';
    document.getElementById('slot-result').className = 'result-message';
    document.getElementById('roulette-result').textContent = '';
    document.getElementById('roulette-result').className = 'result-message';
    document.getElementById('poker-result').textContent = '';
    document.getElementById('poker-result').className = 'result-message';
}

// ===== SLOT MACHINE =====
function spinSlot() {
    const bet = parseInt(document.getElementById('slot-bet').value);
    const resultDiv = document.getElementById('slot-result');

    if (isNaN(bet) || bet < 1) {
        resultDiv.textContent = '❌ Invalid bet amount!';
        resultDiv.className = 'result-message lose';
        return;
    }

    if (bet > balance) {
        resultDiv.textContent = '❌ Insufficient balance!';
        resultDiv.className = 'result-message lose';
        return;
    }

    updateBalance(-bet);

    // Animate spinning
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    reels.forEach(reel => reel.classList.add('spinning'));

    // Generate final symbols
    const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    // Show random spinning icons
    let spinCount = 0;
    const spinInterval = setInterval(() => {
        reels.forEach((reel, index) => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
        spinCount++;
    }, 100);

    // Stop spinning after 1.5 seconds
    setTimeout(() => {
        clearInterval(spinInterval);
        
        reels.forEach((reel, index) => {
            reel.textContent = result[index];
            reel.classList.remove('spinning');
        });

        // Check for win
        if (result[0] === result[1] && result[1] === result[2]) {
            const winAmount = bet * 10;
            updateBalance(winAmount);
            resultDiv.textContent = `🎉 JACKPOT! You won $${winAmount}! 🎉`;
            resultDiv.className = 'result-message win';
        } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
            const winAmount = bet * 2;
            updateBalance(winAmount);
            resultDiv.textContent = `✨ Two in a row! You won $${winAmount}!`;
            resultDiv.className = 'result-message win';
        } else {
            resultDiv.textContent = `😢 No match. You lost $${bet}.`;
            resultDiv.className = 'result-message lose';
        }
    }, 1500);
}

// ===== ROULETTE =====
function spinRoulette() {
    const bet = parseInt(document.getElementById('roulette-bet').value);
    const betType = document.getElementById('bet-type').value;
    const resultDiv = document.getElementById('roulette-result');

    if (isNaN(bet) || bet < 1) {
        resultDiv.textContent = '❌ Invalid bet amount!';
        resultDiv.className = 'result-message lose';
        return;
    }

    if (bet > balance) {
        resultDiv.textContent = '❌ Insufficient balance!';
        resultDiv.className = 'result-message lose';
        return;
    }

    updateBalance(-bet);

    // Generate a winning result based on bet type
    let spinResult;
    if (betType === 'red') {
        const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        spinResult = reds[Math.floor(Math.random() * reds.length)];
    } else if (betType === 'black') {
        const blacks = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
        spinResult = blacks[Math.floor(Math.random() * blacks.length)];
    } else if (betType === 'even') {
        const evens = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
        spinResult = evens[Math.floor(Math.random() * evens.length)];
    } else if (betType === 'odd') {
        const odds = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35];
        spinResult = odds[Math.floor(Math.random() * odds.length)];
    } else if (betType === '1-18') {
        spinResult = Math.floor(Math.random() * 18) + 1;
    } else if (betType === '19-36') {
        spinResult = Math.floor(Math.random() * 18) + 19;
    }

    const wheel = document.getElementById('roulette-wheel');
    const rotation = -((spinResult * 9.73) + (5 * 360)); // Negative for counter-clockwise (left)

    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        const winAmount = bet * 2;
        updateBalance(winAmount);
        resultDiv.textContent = `🎉 The ball landed on ${spinResult}! You won $${winAmount}!`;
        resultDiv.className = 'result-message win';
    }, 5000);
}

function isRed(num) {
    const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return reds.includes(num);
}

function isBlack(num) {
    const blacks = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    return blacks.includes(num);
}

// ===== POKER =====
const suits = ['♠️', '♥️', '♦️', '♣️'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(rank + suit);
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

let currentDeck = createDeck();
let playerHand = [];
let dealerHand = [];

function dealPokerHand() {
    const bet = parseInt(document.getElementById('poker-bet').value);
    const resultDiv = document.getElementById('poker-result');

    if (isNaN(bet) || bet < 1) {
        resultDiv.textContent = '❌ Invalid bet amount!';
        resultDiv.className = 'result-message lose';
        return;
    }

    if (bet > balance) {
        resultDiv.textContent = '❌ Insufficient balance!';
        resultDiv.className = 'result-message lose';
        return;
    }

    updateBalance(-bet);

    // Reset deck if needed
    if (currentDeck.length < 10) {
        currentDeck = createDeck();
    }

    // Deal 3 cards each
    playerHand = [];
    dealerHand = [];
    for (let i = 0; i < 3; i++) {
        playerHand.push(currentDeck.pop());
        dealerHand.push(currentDeck.pop());
    }

    displayPokerHand();

    setTimeout(() => {
        evaluateAndShowResult(bet, resultDiv);
    }, 500);
}

function displayPokerHand() {
    const playerDiv = document.getElementById('poker-hand');
    const dealerDiv = document.getElementById('dealer-hand');

    playerDiv.innerHTML = '';
    dealerDiv.innerHTML = '';

    playerHand.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.textContent = card;
        playerDiv.appendChild(cardEl);
    });

    dealerHand.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.textContent = card;
        dealerDiv.appendChild(cardEl);
    });
}

function evaluateAndShowResult(bet, resultDiv) {
    const playerRank = evaluateHand(playerHand);
    const dealerRank = evaluateHand(dealerHand);
    const dealerQualifies = dealerRank >= 0 && getHighCard(dealerHand) >= 10; // Queen or higher

    let winAmount = 0;
    let message = '';

    if (!dealerQualifies) {
        // Dealer doesn't qualify (no Queen high or better)
        winAmount = bet;
        updateBalance(winAmount);
        message = `🎉 Dealer doesn't qualify! You win $${winAmount}!`;
        resultDiv.className = 'result-message win';
    } else if (playerRank > dealerRank) {
        winAmount = bet * 2;
        updateBalance(winAmount);
        message = `🎉 You won $${winAmount}! Your ${handName(playerRank)} beats ${handName(dealerRank)}!`;
        resultDiv.className = 'result-message win';
    } else if (playerRank < dealerRank) {
        message = `😢 You lost. Dealer's ${handName(dealerRank)} beats your ${handName(playerRank)}.`;
        resultDiv.className = 'result-message lose';
    } else {
        updateBalance(bet);
        message = `🤝 It's a tie! Both have ${handName(playerRank)}.`;
        resultDiv.className = 'result-message neutral';
    }

    resultDiv.textContent = message;
}

function getHighCard(hand) {
    const rankValues = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
    const values = hand.map(card => rankValues[card[0]]);
    return Math.max(...values);
}

function evaluateHand(hand) {
    const ranks = hand.map(card => card[0]);
    const suits = hand.map(card => card.slice(1));

    const rankValues = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
    const values = ranks.map(r => rankValues[r]).sort((a, b) => b - a);

    const countMap = {};
    ranks.forEach(r => countMap[r] = (countMap[r] || 0) + 1);
    const counts = Object.values(countMap).sort((a, b) => b - a);

    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = (values[0] - values[1] === 1 && values[1] - values[2] === 1) || 
                       (values[0] === 14 && values[1] === 3 && values[2] === 2); // Ace-low straight

    // Three Card Poker hand rankings
    if (isFlush && isStraight) return 5; // Straight flush
    if (counts[0] === 3) return 4; // Three of a kind
    if (isStraight) return 3; // Straight
    if (isFlush) return 2; // Flush
    if (counts[0] === 2) return 1; // Pair
    return 0; // High card
}

function handName(rank) {
    const names = ['High Card', 'Pair', 'Flush', 'Straight', 'Three of a Kind', 'Straight Flush'];
    return names[rank];
}

// Initialize
document.getElementById('balance').textContent = balance;
