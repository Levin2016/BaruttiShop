const products = [
    { id: 1, name: 'T-Shirt', price: 19.99 },
    { id: 2, name: 'Hose', price: 29.99 },
    { id: 3, name: 'Schuhe', price: 49.99 }
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
            <p>Preis: €${product.price.toFixed(2)}</p>
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
        li.textContent = `${item.name} - €${item.price.toFixed(2)}`;
        cartUl.appendChild(li);
    });
}

function checkout() {
    if (cart.length === 0) {
        alert('Ihr Warenkorb ist leer!');
        return;
    }
    let sum = cart.reduce((acc, item) => acc + item.price, 0);
    alert(`Vielen Dank für Ihren Einkauf!\nGesamt: €${sum.toFixed(2)}`);
    cart.length = 0;
    displayCart();
}

displayProducts();
