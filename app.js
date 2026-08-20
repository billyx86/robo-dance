import { clampChaos, chaosLabel, parseStoredChaos } from "./lib/chaos.js";
import { capWall, seedWall, shrinkToFit } from "./lib/wall.js";
import {
  MODES,
  SURPRISES,
  STARTERS,
  REACTIONS,
  PALETTES,
  pickRandom,
  wrapTextLines,
} from "./lib/meme.js";

const robot = document.getElementById("robot");
const bpmLabel = document.getElementById("bpmLabel");
const chaosFill = document.getElementById("chaosFill");
const chaosText = document.getElementById("chaosText");
const toast = document.getElementById("toast");
const confetti = document.getElementById("confetti");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

let chaos = 12;
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

function setChaos(n) {
  chaos = clampChaos(n);
  chaosFill.style.width = chaos + "%";
  chaosText.textContent = chaosLabel(chaos);
  chaosFill.parentElement.setAttribute("aria-valuenow", String(chaos));
  try {
    localStorage.setItem("robo-chaos", String(chaos));
  } catch (e) {}
}

function setRobotMode(mode) {
  // #robot is an <svg>: className is getter-only there, so write the class
  // attribute directly (issue #6).
  robot.setAttribute("class", "robot " + mode);
}

function bumpChaos(by) {
  setChaos(chaos + by);
  if (chaos >= 100) showToast("LEGAL IS CALLING. Keep dancing.");
}

document.querySelectorAll("#danceModes .chip[data-mode]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll("#danceModes .chip[data-mode]").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    var mode = btn.dataset.mode;
    setRobotMode(mode);
    var m = MODES[mode];
    bpmLabel.textContent = "BPM: " + m.bpm + " · " + m.label;
    bumpChaos(4);
    showToast(m.label + " mode engaged");
  });
});

document.getElementById("boostBtn").addEventListener("click", function () {
  spawnConfetti(40);
  bumpChaos(8);
  showToast("🎉 Confetti tax paid");
});

function spawnConfetti(n) {
  var colors = ["#ff2d95", "#00f0ff", "#ffe600", "#b8ff3c", "#fff"];
  for (var i = 0; i < n; i++) {
    var el = document.createElement("i");
    el.style.left = Math.random() * 100 + "%";
    el.style.background = colors[i % colors.length];
    el.style.animationDuration = 1.2 + Math.random() * 1.4 + "s";
    el.style.animationDelay = Math.random() * 0.3 + "s";
    el.style.transform = "rotate(" + Math.random() * 360 + "deg)";
    confetti.appendChild(el);
    (function (node) {
      setTimeout(function () {
        node.remove();
      }, 2800);
    })(el);
  }
}

var reactionGrid = document.getElementById("reactionGrid");
var counts = {};
try {
  counts = JSON.parse(localStorage.getItem("robo-reacts") || "{}");
} catch (e) {
  counts = {};
}

REACTIONS.forEach(function (r) {
  if (counts[r.id] == null) counts[r.id] = Math.floor(Math.random() * 40) + 3;
  var card = document.createElement("button");
  card.type = "button";
  card.className = "react-card";
  card.innerHTML =
    '<span class="emoji">' +
    r.emoji +
    "</span><span class=\"name\">" +
    r.name +
    '</span><div class="count">' +
    counts[r.id] +
    " clicks</div>";
  card.addEventListener("click", function () {
    counts[r.id]++;
    card.querySelector(".count").textContent = counts[r.id] + " clicks";
    try {
      localStorage.setItem("robo-reacts", JSON.stringify(counts));
    } catch (e) {}
    bumpChaos(3);
    if (r.id === "dance") {
      setRobotMode("break");
      setTimeout(function () {
        setRobotMode("dance");
        document.querySelectorAll("#danceModes .chip[data-mode]").forEach(function (b) {
          b.classList.toggle("active", b.dataset.mode === "dance");
        });
      }, 2000);
    }
    showToast(r.emoji + " " + r.name + "!");
    spawnConfetti(8);
  });
  reactionGrid.appendChild(card);
});

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawRobotIcon(cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#00e5f5";
  roundRect(-48, -10, 96, 90, 28);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -70, 55, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0a0a12";
  roundRect(-36, -88, 72, 40, 14);
  ctx.fill();
  ctx.fillStyle = "#ff2d95";
  ctx.beginPath();
  ctx.arc(-16, -68, 11, 0, Math.PI * 2);
  ctx.arc(16, -68, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffe600";
  ctx.beginPath();
  ctx.ellipse(-55, -68, 11, 15, 0, 0, Math.PI * 2);
  ctx.ellipse(55, -68, 11, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1a1a24";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -118);
  ctx.lineTo(0, -132);
  ctx.stroke();
  ctx.fillStyle = "#ffe600";
  ctx.beginPath();
  ctx.arc(0, -136, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0d0d14";
  ctx.beginPath();
  ctx.arc(0, 35, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffe600";
  ctx.beginPath();
  ctx.arc(0, 35, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1a24";
  roundRect(-78, -5, 28, 14, 7);
  ctx.fill();
  roundRect(50, -5, 28, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#00d4e8";
  ctx.beginPath();
  ctx.arc(-78, 2, 12, 0, Math.PI * 2);
  ctx.arc(78, 2, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1a24";
  roundRect(-32, 75, 20, 40, 8);
  ctx.fill();
  roundRect(12, 75, 20, 40, 8);
  ctx.fill();
  ctx.fillStyle = "#00d4e8";
  roundRect(-40, 108, 34, 18, 6);
  ctx.fill();
  roundRect(6, 108, 34, 18, 6);
  ctx.fill();
  ctx.restore();
}

function wrapText(text, maxWidth) {
  return wrapTextLines(text, maxWidth, (t) => ctx.measureText(t).width);
}

function drawMemeText(text, y, fromTop) {
  if (!text.trim()) return;
  ctx.font = "bold 48px Impact, Arial Black, sans-serif";
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  var lines = wrapText(text.toUpperCase(), 560);
  var lineH = 54;
  var startY = fromTop ? y : y - (lines.length - 1) * lineH;
  for (var i = 0; i < lines.length; i++) {
    var yy = startY + i * lineH;
    ctx.strokeText(lines[i], 320, yy);
    ctx.fillText(lines[i], 320, yy);
  }
}

function renderMeme() {
  var top = document.getElementById("topText").value;
  var bottom = document.getElementById("bottomText").value;
  var tpl = document.getElementById("template").value;
  var cols = PALETTES[tpl] || PALETTES.cyan;
  var g = ctx.createLinearGradient(0, 0, 640, 640);
  if (tpl === "rainbow") {
    g.addColorStop(0, "#ff2d95");
    g.addColorStop(0.33, "#ffe600");
    g.addColorStop(0.66, "#00f0ff");
    g.addColorStop(1, "#b8ff3c");
  } else {
    g.addColorStop(0, cols[0]);
    g.addColorStop(0.55, cols[1]);
    g.addColorStop(1, cols[2]);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 640, 640);
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 4; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)";
      ctx.fillRect(i * 80, 480 + j * 40, 80, 40);
    }
  }
  drawRobotIcon(320, 300, 1.35);
  drawMemeText(top, 70, true);
  drawMemeText(bottom, 580, false);
  ctx.font = "16px Space Mono, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.textAlign = "right";
  ctx.fillText("ROBO.DANCE", 620, 625);
}

document.getElementById("renderMeme").addEventListener("click", function () {
  renderMeme();
  bumpChaos(5);
  showToast("Meme rendered. Shame not included.");
});

document.getElementById("surpriseMeme").addEventListener("click", function () {
  var pair = pickRandom(SURPRISES);
  document.getElementById("topText").value = pair[0];
  document.getElementById("bottomText").value = pair[1];
  document.getElementById("template").value = pickRandom(Object.keys(PALETTES));
  renderMeme();
  bumpChaos(6);
  spawnConfetti(16);
  showToast("Surprise chaos unlocked");
});

document.getElementById("downloadMeme").addEventListener("click", function () {
  renderMeme();
  var a = document.createElement("a");
  a.download = "robo-dance-meme.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
  bumpChaos(4);
  showToast("PNG stolen successfully 🫡");
});

var wallEl = document.getElementById("memeWall");
var wall = [];
try {
  wall = JSON.parse(localStorage.getItem("robo-wall") || "[]");
} catch (e) {
  wall = [];
}

function saveWall() {
  // localStorage quota is small and each post is a 640x640 PNG dataURL,
  // so a full wall can exceed it. Instead of failing silently (issue #2),
  // drop the oldest user posts / images until the payload fits, then save
  // the shrunk copy and keep `wall` in sync with what actually persisted.
  try {
    localStorage.setItem("robo-wall", JSON.stringify(capWall(wall)));
  } catch (e) {
    const shrunk = shrinkToFit(capWall(wall));
    try {
      localStorage.setItem("robo-wall", JSON.stringify(shrunk));
      wall = shrunk;
      renderWall();
      showToast("Storage full — oldest posts trimmed to make room.");
    } catch (e2) {
      // Storage is genuinely unavailable (private mode etc.): the in-memory
      // wall keeps working for this visit, it just won't persist.
    }
  }
}

function renderWall() {
  wallEl.innerHTML = "";
  if (!wall.length) {
    wall = seedWall(STARTERS);
  }
  wall.forEach(function (item, idx) {
    var card = document.createElement("div");
    card.className = "wall-card";
    var art = document.createElement("div");
    art.className = "wall-art";
    if (item.dataUrl) {
      art.style.backgroundImage = "url(" + item.dataUrl + ")";
    } else {
      art.style.background =
        "linear-gradient(135deg, " + item.bg[0] + ", " + item.bg[1] + ")";
      art.innerHTML = item.emoji + '<div class="caption">' + item.caption + "</div>";
    }
    var meta = document.createElement("div");
    meta.className = "wall-meta";
    meta.innerHTML =
      "<span>" +
      (item.seed ? "featured" : "yours") +
      '</span><button type="button">♥ ' +
      (item.likes || 0) +
      "</button>";
    meta.querySelector("button").addEventListener("click", function () {
      item.likes = (item.likes || 0) + 1;
      saveWall();
      renderWall();
      bumpChaos(2);
    });
    card.appendChild(art);
    card.appendChild(meta);
    wallEl.appendChild(card);
  });
}

document.getElementById("postWall").addEventListener("click", function () {
  renderMeme();
  wall.unshift({
    dataUrl: canvas.toDataURL("image/png"),
    likes: 0,
    caption: document.getElementById("topText").value,
  });
  saveWall();
  renderWall();
  bumpChaos(7);
  spawnConfetti(20);
  showToast("Posted to the wall of shame ✨");
  document.getElementById("wall").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("clearWall").addEventListener("click", function () {
  wall = [];
  saveWall();
  renderWall();
  showToast("Wall wiped. Crimes forgotten.");
});

document.getElementById("randomChaos").addEventListener("click", function () {
  var mode = pickRandom(Object.keys(MODES));
  setRobotMode(mode);
  document.querySelectorAll("#danceModes .chip[data-mode]").forEach(function (b) {
    b.classList.toggle("active", b.dataset.mode === mode);
  });
  bpmLabel.textContent = "BPM: " + MODES[mode].bpm + " · " + MODES[mode].label;
  document.getElementById("surpriseMeme").click();
  bumpChaos(10);
  spawnConfetti(30);
});

try {
  var saved = localStorage.getItem("robo-chaos");
  setChaos(saved ? parseStoredChaos(saved) : 12);
} catch (e) {
  setChaos(12);
}

renderMeme();
renderWall();

setInterval(function () {
  if (Math.random() > 0.7) spawnConfetti(3);
}, 4000);

var statuses = [
  "still dancing. will not stop. cannot stop.",
  "currently violating three laws of robotics (for fun).",
  "buffering nothing. dancing everything.",
  "mainframe reports: 'this is fine.'",
  "upgraded from bug to feature mid-spin.",
];
setInterval(function () {
  document.getElementById("statusLine").textContent = pickRandom(statuses);
}, 5000);
