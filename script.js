const options = [
  "Crunchyroll 📺",
  "Spotify 🎵",
  "OTT Pass 🍿",
  "Ear Studs 💎",
  "Bracelet ⛓️",
  "Mystery 🎲"
];

const messages = {
  "Crunchyroll 📺": "Looks like you unlocked a Crunchyroll subscription! 🎉",
  "Spotify 🎵": "Music never stops! You won a Spotify subscription! 🎵",
  "OTT Pass 🍿": "Movie nights just got better! You unlocked an OTT subscription 🍿",
  "Ear Studs 💎": "A stylish little surprise is waiting for you! 💎",
  "Bracelet ⛓️": "A cool bracelet is coming your way! ✨",
  "Mystery 🎲": "🎉 JACKPOT! You can ask for one reasonable and affordable surprise!"
};

const colors = [
  "#2196F3",
  "#00BCD4",
  "#4CAF50",
  "#FFC107",
  "#FF7043",
  "#9C27B0"
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");
const message = document.getElementById("message");
const surpriseBox = document.getElementById("surpriseBox");

const centerX = 250;
const centerY = 250;
const radius = 230;

let startAngle = 0;
let spinning = false;

function drawWheel() {
  const arc = (2 * Math.PI) / options.length;

  for (let i = 0; i < options.length; i++) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      radius,
      startAngle + i * arc,
      startAngle + (i + 1) * arc
    );

    ctx.fillStyle = colors[i];
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + i * arc + arc / 2);

    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "right";
    ctx.fillText(options[i], radius - 18, 7);

    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.fillStyle = "#132238";
  ctx.font = "bold 27px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🎲", centerX, centerY + 10);
}

function spin() {
  if (spinning) return;

  spinning = true;
  spinBtn.disabled = true;
  result.innerHTML = "";
  message.innerHTML = "";
  surpriseBox.classList.add("hidden");

  const extraRotation = Math.random() * 360 + 2520;
  const finalAngle = startAngle + extraRotation * Math.PI / 180;
  const duration = 4600;
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);

    startAngle = startAngle + (finalAngle - startAngle) * ease;

    ctx.clearRect(0, 0, 500, 500);
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      showResult();
      spinning = false;
      spinBtn.disabled = false;
    }
  }

  requestAnimationFrame(animate);
}

function showResult() {
  const degrees = (startAngle * 180 / Math.PI + 90) % 360;
  const index =
    Math.floor(((360 - (degrees % 360)) / 360) * options.length) %
    options.length;

  const selected = options[index];

  result.innerHTML = "🎉 You got: " + selected;
  message.innerHTML = messages[selected];

  makeConfetti();

  if (selected === "Mystery 🎲") {
    surpriseBox.classList.remove("hidden");
  }
}

function makeConfetti() {
  for (let i = 0; i < 45; i++) {
    const confetti = document.createElement("div");
    confetti.innerHTML = ["⭐", "✨", "🎉", "🎂", "🎁", "🔥"][
      Math.floor(Math.random() * 6)
    ];

    confetti.style.position = "fixed";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-30px";
    confetti.style.fontSize = Math.random() * 18 + 18 + "px";
    confetti.style.animation = "fall 3s linear forwards";
    confetti.style.zIndex = "999";

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

spinBtn.addEventListener("click", spin);

drawWheel();