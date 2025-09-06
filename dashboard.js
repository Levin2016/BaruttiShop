const user = localStorage.getItem('currentUser');
const coinsDisplay = document.getElementById('userCoins');
let coins = parseInt(localStorage.getItem(user + '_coins')) || 0;
coinsDisplay.textContent = 'Coins: ' + coins;

function completeTask(button, reward) {
    coins += reward;
    coinsDisplay.textContent = 'Coins: ' + coins;
    localStorage.setItem(user + '_coins', coins);
    button.disabled = true;
}

function addToCart(item, price) {
    if (!localStorage.getItem(user + '_cart')) {
        localStorage.setItem(user + '_cart', JSON.stringify([]));
    }
    let cart = JSON.parse(localStorage.getItem(user + '_cart'));
    cart.push({item, price});
    localStorage.setItem(user + '_cart', JSON.stringify(cart));
    alert(item + ' zum Warenkorb hinzugefügt!');
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem(user + '_cart')) || [];
    let total = cart.reduce((sum, i) => sum + i.price, 0);
    if (coins >= total) {
        coins -= total;
        localStorage.setItem(user + '_coins', coins);
        coinsDisplay.textContent = 'Coins: ' + coins;
        localStorage.setItem(user + '_cart', JSON.stringify([]));
        alert('Vielen Dank für deinen Einkauf!');
    } else {
        alert('Nicht genug Coins!');
    }
}

// Einfaches Glücksrad
function spinWheel() {
    let win = Math.floor(Math.random() * 11); // 0-10 Coins
    alert('Du hast ' + win + ' Coins gewonnen!');
    coins += win;
    coinsDisplay.textContent = 'Coins: ' + coins;
    localStorage.setItem(user + '_coins', coins);
}

// Verlosung
let tickets = 13;
function buyTicket() {
    if (coins >= 10 && tickets > 0) {
        coins -= 10;
        tickets--;
        coinsDisplay.textContent = 'Coins: ' + coins;
        document.getElementById('lotteryTickets').textContent = 'Verfügbare Lose: ' + tickets;
        localStorage.setItem(user + '_coins', coins);
        alert('Los gekauft!');
    } else if (tickets <= 0) {
        alert('Keine Lose mehr verfügbar!');
    } else {
        alert('Nicht genug Coins!');
    }
}
