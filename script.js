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
    
    // Reset the wheel transform to trigger the animation again
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    
    // Trigger reflow to ensure the transform resets before applying transition
    void wheel.offsetWidth;
    
    // Apply the transition and new rotation
    wheel.style.transition = 'transform 5s cubic-bezier(0, 0.4, 0.6, 1)';
    const rotation = -((spinResult * 9.73) + (10 * 360)); // 10 full rotations plus final position, negative for left
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

// Initialize
document.getElementById('balance').textContent = balance;
