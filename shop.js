const profiles = {
    Lilo: { coins: 100 },
    Cooper: { coins: 120 },
    Remy: { coins: 90 },
    Tintin: { coins: 150 },
    Apoyo: { coins: 80 }
};

let currentProfile = "Lilo";

const products = [
    { id: 1, name: 'T-Shirt', price: 19 },
    { id: 2, name: 'Hose', price: 29 },
    { id: 3, name: 'Schuhe', price: 49 }
];

const cart = [];

function displayProducts() {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = '';
    products.forEach(product => {
        const prodEl = document.createElement('div');
        prodEl.className = 'product';
        prodEl.innerHTML = `
            <h3>${product.name}</h3>
            <p>Preis: <b>${product.price} BaruttiCoins</b></p>
            <button onclick="addToCart(${product.id})">In den Warenkorb</button>
        `;
        productsDiv.appendChild(prodEl);
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    displayCart();
}

function displayCart() {
    const cartUl = document.getElementById('cart');
    cartUl.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} BaruttiCoins`;
        cartUl.appendChild(li);
    });
}

function displayProfileCoins() {
    const coinsDiv = document.getElementById('profileCoins');
    coinsDiv.innerHTML = `Profil <b>${currentProfile}</b>: <b>${profiles[currentProfile].coins}</b> BaruttiCoins`;
}

function changeProfile() {
    const select = document.getElementById('profileSelect');
    currentProfile = select.value;
    displayProfileCoins();
    cart.length = 0;
    displayCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('Ihr Warenkorb ist leer!');
        return;
    }
    let sum = cart.reduce((acc, item) => acc + item.price, 0);
    if (profiles[currentProfile].coins >= sum) {
        profiles[currentProfile].coins -= sum;
        alert(`Vielen Dank für Ihren Einkauf!\nAbgezogen: ${sum} BaruttiCoins\nVerbleibend: ${profiles[currentProfile].coins} BaruttiCoins`);
        cart.length = 0;
        displayCart();
        displayProfileCoins();
    } else {
        alert(`Nicht genug BaruttiCoins!\nBenötigt: ${sum}, Verfügbar: ${profiles[currentProfile].coins}`);
    }
}

displayProducts();
displayProfileCoins();
