// ---- Nutzer laden ----
const currentUser = localStorage.getItem("currentUser");
document.getElementById("userName").textContent = currentUser;

// alle Spieler inkl. Barutti
const players = ["Apoyo", "Tintin", "Cooper", "Lilo", "Remy"];
const allUsers = [...players, "Barutti"];

// Reset Coins wenn neu
allUsers.forEach(u => {
  localStorage.setItem(u + "_coins", 0);
});

// Coins-Funktionen
function getCoins(user) {
  return parseFloat(localStorage.getItem(user + "_coins") || "0");
}
function setCoins(user, val) {
  localStorage.setItem(user + "_coins", val);
}

// ---- Aufgaben ----
const tasks = [
  { text: "Zimmer aufräumen", reward: 2 },
  { text: "Tisch decken", reward: 3 },
  { text: "Hausaufgaben machen", reward: 5 },
  { text: "Hund füttern", reward: 4 }
];

// ---- Render ----
function render() {
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (currentUser === "Barutti") renderAdmin(content);
  else renderPlayer(content);

  document.getElementById("userCoins").textContent = getCoins(currentUser);
}

// ---- Spieler ----
function renderPlayer(content) {
  // Aufgaben
  const secTasks = document.createElement("section");
  secTasks.innerHTML =
    "<h2>Deine Aufgaben</h2><p>Wenn du fertig bist, sag es Barutti!</p><ul></ul>";
  tasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.text} (${t.reward} Coins)`;
    secTasks.querySelector("ul").appendChild(li);
  });
  content.appendChild(secTasks);

  // Glücksrad
  const secWheel = document.createElement("section");
  secWheel.innerHTML = "<h2>Glücksrad</h2><div id='wheelPointer'></div>";
  const canvas = document.createElement("canvas");
  canvas.id = "wheelCanvas";
  canvas.width = 300;
  canvas.height = 300;
  secWheel.appendChild(canvas);
  const btn = document.createElement("button");
  btn.textContent = "Drehen!";
  btn.onclick = () => spinWheel(currentUser);
  secWheel.appendChild(btn);
  content.appendChild(secWheel);

  drawWheel("wheelCanvas");
}

// ---- Admin ----
function renderAdmin(content) {
  players.forEach(user => {
    const sec = document.createElement("section");
    sec.innerHTML = `<h3>${user} – Coins: <span>${getCoins(user)}</span></h3><ul></ul>`;
    const ul = sec.querySelector("ul");
    const done = JSON.parse(localStorage.getItem(user + "_tasks") || "[false,false,false,false]");
    tasks.forEach((t, i) => {
      const li = document.createElement("li");
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = done[i];
      chk.onchange = () => {
        done[i] = chk.checked;
        localStorage.setItem(user + "_tasks", JSON.stringify(done));
        if (chk.checked) {
          let c = getCoins(user) + t.reward;
          setCoins(user, c);
          sec.querySelector("span").textContent = c;
        }
      };
      li.appendChild(chk);
      li.appendChild(document.createTextNode(" " + t.text + " (" + t.reward + " Coins)"));
      ul.appendChild(li);
    });
    content.appendChild(sec);
  });
}

// ---- Glücksrad ----
function drawWheel(id) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  const colors = ["#f44336", "#2196f3", "#ffeb3b", "#4caf50", "#9c27b0", "#ff9800", "#00bcd4", "#e91e63"];
  const seg = colors.length;
  const angle = 2 * Math.PI / seg;

  for (let i = 0; i < seg; i++) {
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 140, i * angle, (i + 1) * angle);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(i * angle + angle / 2);
    ctx.fillStyle = "#000";
    ctx.fillText(i + 1, 90, 5);
    ctx.restore();
  }
}

function spinWheel(user) {
  const lastSpin = parseInt(localStorage.getItem(user + "_lastSpin"));
  const now = Date.now();
  if (now - lastSpin < 7 * 24 * 3600 * 1000) {
    alert("Nur 1x pro Woche drehen!");
    return;
  }
  localStorage.setItem(user + "_lastSpin", now);

  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  let rotation = 0, speed = 0.35 + Math.random() * 0.25;

  const spin = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(rotation);
    ctx.translate(-150, -150);
    drawWheel("wheelCanvas");
    ctx.restore();
    rotation += speed;
    speed *= 0.97;

    if (speed < 0.01) {
      clearInterval(spin);
      const seg = Math.floor(((rotation % (2 * Math.PI)) / (2 * Math.PI)) * 8);
      const reward = seg + 1;
      let coins = getCoins(user) + reward;
      setCoins(user, coins);
      document.getElementById("userCoins").textContent = coins;
      alert("Gewonnen: " + reward + " Coins!");
    }
  }, 30);
}

render();
