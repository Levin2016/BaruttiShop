const currentUser = localStorage.getItem('currentUser');
document.getElementById('userName').textContent = currentUser;

let coins = parseInt(localStorage.getItem(currentUser + '_coins')) || 0;
document.getElementById('userCoins').textContent = coins;

// Aufgabenliste
const tasksData = [
    {name: 'Mache ein Ämpli', reward: 2},
    {name: 'Räume dein Zimmer auf', reward: 3}
];

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    tasksData.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.name} - ${task.reward} Coins `;
        const btn = document.createElement('button');
        btn.textContent = '✔';
        btn.onclick = () => completeTask(task);
        li.appendChild(btn);
        tasksList.appendChild(li);
    });
}
renderTasks();

// Aufgabe erledigen
function completeTask(task) {
    if(currentUser === 'Barutti') {
        // Admin kann Aufgaben für alle abhandeln
        const users = ['Apoyo','Tintin','Cooper','Lilo','Remy'];
        users.forEach(u=>{
            let userTasks = JSON.parse(localStorage.getItem(u+'_tasks')||'[]');
            if(!userTasks.includes(task.name)){
                userTasks.push(task.name);
                let userCoins = parseInt(localStorage.getItem(u+'_coins')||0);
                userCoins += task.reward;
                localStorage.setItem(u+'_coins', userCoins);
                localStorage.setItem(u+'_tasks', JSON.stringify(userTasks));
            }
        });
        alert(`Aufgabe "${task.name}" für alle erledigt!`);
    } else {
        let userTasks = JSON.parse(localStorage.getItem(currentUser+'_tasks')||'[]');
        if(!userTasks.includes(task.name)){
            userTasks.push(task.name);
            coins += task.reward;
            localStorage.setItem(currentUser+'_coins', coins);
            localStorage.setItem(currentUser+'_tasks', JSON.stringify(userTasks));
            document.getElementById('userCoins').textContent = coins;
            alert(`Aufgabe "${task.name}" erledigt!`);
        } else {
            alert('Aufgabe bereits erledigt!');
        }
    }
}

// Glücksrad
const wheel = document.getElementById('spinWheel');
const ctx = wheel.getContext('2d');
const segments = 10;
const anglePerSegment = 2*Math.PI/segments;
let spinning = false;

function drawWheel(rotation=0) {
    ctx.clearRect(0,0,wheel.width,wheel.height);
    for(let i=0;i<segments;i++){
        ctx.beginPath();
        ctx.moveTo(150,150);
        ctx.arc(150,150,140, i*anglePerSegment + rotation, (i+1)*anglePerSegment + rotation);
        ctx.fillStyle = i%2===0 ? '#ff9999':'#99ccff';
        ctx.fill();
        ctx.stroke();
    }
}
drawWheel();

function spinWheel() {
    if(currentUser !== 'Barutti'){
        const lastSpin = parseInt(localStorage.getItem(currentUser+'_lastSpin')) || 0;
        const now = Date.now();
        if(now - lastSpin < 7*24*3600*1000){
            alert('Du kannst nur einmal pro Woche drehen!');
            return;
        }
        localStorage.setItem(currentUser+'_lastSpin', now);
    }

    if(spinning) return;
    spinning = true;
    let rotation = 0;
    let speed = Math.random()*0.3+0.3;
    const spins = setInterval(()=>{
        rotation += speed;
        speed *= 0.97;
        drawWheel(rotation);
        if(speed <0.01){
            clearInterval(spins);
            const segment = Math.floor((rotation%(2*Math.PI))/anglePerSegment);
            const reward = segment; // Coins 0-9
            coins += reward;
            localStorage.setItem(currentUser+'_coins', coins);
            document.getElementById('userCoins').textContent = coins;
            alert(`Du hast ${reward} Coins gewonnen!`);
            spinning = false;
        }
    },30);
}

// Shop
function addToCart(item, price){
    let cart = JSON.parse(localStorage.getItem(currentUser+'_cart')||'[]');
    cart.push({item, price});
    localStorage.setItem(currentUser+'_cart', JSON.stringify(cart));
    alert(item+' zum Warenkorb hinzugefügt!');
}

function checkout(){
    let cart = JSON.parse(localStorage.getItem(currentUser+'_cart')||'[]');
    let total = cart.reduce((sum,i)=>sum+i.price,0);
    if(coins>=total){
        coins -= total;
        localStorage.setItem(currentUser+'_coins', coins);
        document.getElementById('userCoins').textContent = coins;
        localStorage.setItem(currentUser+'_cart', JSON.stringify([]));
        alert('Einkauf abgeschlossen!');
    }else{
        alert('Nicht genug Coins!');
   
