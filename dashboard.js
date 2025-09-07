const currentUser = localStorage.getItem("currentUser");
document.getElementById("userName").textContent = currentUser;

function getCoins(user){
  return parseInt(localStorage.getItem(user+"_coins") || "0");
}
function setCoins(user, val){
  localStorage.setItem(user+"_coins", val);
}

function render(){
  const content = document.getElementById("content");
  content.innerHTML = "";

  if(currentUser === "Barutti"){
    renderAdmin(content);
  } else {
    renderPlayer(content);
  }
}

// ---------------- Spieler-Dashboard ----------------
function renderPlayer(content){
  let coins = getCoins(currentUser);
  document.getElementById("userCoins").textContent = coins;

  // Aufgaben
  const tasks = ["Zimmer aufräumen (2 Coins)","Tisch decken (3 Coins)","Hausaufgaben (5 Coins)","Hund füttern (4 Coins)"];
  const secTasks = document.createElement("section");
  secTasks.innerHTML = "<h2>Deine Aufgaben</h2><p>Wenn du fertig bist, sag es Barutti!</p><ul></ul>";
  const ul = secTasks.querySelector("ul");
  tasks.forEach(t=>{
    let li=document.createElement("li");
    li.textContent=t;
    ul.appendChild(li);
  });
  content.appendChild(secTasks);

  // Glücksrad
  const secWheel = document.createElement("section");
  secWheel.innerHTML="<h2>Glücksrad</h2>";
  const canvas=document.createElement("canvas");
  canvas.width=300; canvas.height=300; canvas.id="wheelCanvas";
  secWheel.appendChild(canvas);
  const btn=document.createElement("button");
  btn.textContent="Drehen!";
  btn.onclick=()=>spinWheel(currentUser);
  secWheel.appendChild(btn);
  content.appendChild(secWheel);

  drawWheel("wheelCanvas");
}

// ---------------- Admin-Dashboard ----------------
function renderAdmin(content){
  const users=["Apoyo","Tintin","Cooper","Lilo","Remy"];
  const tasks = ["Zimmer aufräumen (2 Coins)","Tisch decken (3 Coins)","Hausaufgaben (5 Coins)","Hund füttern (4 Coins)"];
  users.forEach(user=>{
    const sec=document.createElement("section");
    sec.innerHTML=`<h3>${user} – Coins: <span>${getCoins(user)}</span></h3><ul></ul>`;
    const ul=sec.querySelector("ul");
    const done=JSON.parse(localStorage.getItem(user+"_tasks"));
    tasks.forEach((t,i)=>{
      const li=document.createElement("li");
      const chk=document.createElement("input");
      chk.type="checkbox"; chk.checked=done[i];
      chk.onchange=()=>{
        done[i]=chk.checked;
        localStorage.setItem(user+"_tasks", JSON.stringify(done));
        if(chk.checked){
          let reward=[2,3,5,4][i];
          let c=getCoins(user)+reward;
          setCoins(user,c);
          sec.querySelector("span").textContent=c;
        }
      };
      li.appendChild(chk);
      li.appendChild(document.createTextNode(" "+t));
      ul.appendChild(li);
    });
    content.appendChild(sec);
  });
}

// ---------------- Glücksrad-Logik ----------------
function drawWheel(id){
  const canvas=document.getElementById(id);
  const ctx=canvas.getContext("2d");
  const colors=["#f44336","#2196f3","#ffeb3b","#4caf50","#9c27b0","#ff9800","#00bcd4","#e91e63"];
  const seg=colors.length;
  const angle=2*Math.PI/seg;
  for(let i=0;i<seg;i++){
    ctx.beginPath();
    ctx.moveTo(150,150);
    ctx.arc(150,150,140,i*angle,(i+1)*angle);
    ctx.fillStyle=colors[i];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(150,150);
    ctx.rotate(i*angle+angle/2);
    ctx.fillStyle="#000";
    ctx.fillText(i+"",90,5);
    ctx.restore();
  }
}

function spinWheel(user){
  const lastSpin=parseInt(localStorage.getItem(user+"_lastSpin"));
  const now=Date.now();
  if(now-lastSpin<7*24*3600*1000){
    alert("Nur 1x pro Woche drehen!");
    return;
  }
  localStorage.setItem(user+"_lastSpin", now);

  const canvas=document.getElementById("wheelCanvas");
  const ctx=canvas.getContext("2d");
  let rotation=0, speed=0.3+Math.random()*0.2;
  const spin=setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(150,150);
    ctx.rotate(rotation);
    ctx.translate(-150,-150);
    drawWheel("wheelCanvas");
    ctx.restore();
    rotation+=speed;
    speed*=0.97;
    if(speed<0.01){
      clearInterval(spin);
      const seg=Math.floor(((rotation%(2*Math.PI))/(2*Math.PI))*8);
      const reward=seg+1; // 1–8 Coins
      let coins=getCoins(user)+reward;
      setCoins(user,coins);
      document.getElementById("userCoins").textContent=coins;
      alert("Gewonnen: "+reward+" Coins!");
    }
  },30);
}

render();
