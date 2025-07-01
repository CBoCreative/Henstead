let money = 100;
let farmName = localStorage.getItem('farmName') || "Your Farm";
let plots = JSON.parse(localStorage.getItem("plots")) || [
  null, null, null, null, null
];

document.getElementById("farm-name").innerText = farmName;
document.getElementById("money").innerText = `💰 $${money}`;

function setFarmName() {
  const name = prompt("Name your farm:");
  if (name) {
    farmName = name;
    document.getElementById("farm-name").innerText = name;
    localStorage.setItem("farmName", name);
  }
}

function build(index) {
  if (!plots[index]) {
    const choice = prompt("Build what? (1: Chicken Coop - $50, 2: Garden Patch - $75)");
    if (choice === "1" && money >= 50) {
      plots[index] = { type: "coop", level: 1, name: prompt("Name your chicken:") || "Henrietta" };
      money -= 50;
    } else if (choice === "2" && money >= 75) {
      plots[index] = { type: "garden", level: 1 };
      money -= 75;
    } else {
      alert("Not enough money!");
      return;
    }
  } else {
    // Upgrade
    const upgradeCost = plots[index].level * 100;
    if (money >= upgradeCost) {
      plots[index].level++;
      money -= upgradeCost;
      alert(`${plots[index].type === "coop" ? plots[index].name : "Patch"} upgraded!`);
    } else {
      alert("Not enough money to upgrade.");
    }
  }
  saveGame();
  render();
}

function render() {
  document.getElementById("money").innerText = `💰 $${money}`;
  const plotEls = document.querySelectorAll(".plot");
  plots.forEach((plot, i) => {
    const el = plotEls[i];
    if (!plot) {
      el.className = "plot";
      el.innerText = "Empty";
    } else {
      el.className = "plot built";
      if (plot.level > 1) el.classList.add("upgraded");
      el.innerText =
        plot.type === "coop"
          ? `${plot.name} (Lvl ${plot.level})`
          : `Garden (Lvl ${plot.level})`;
    }
  });
}

function tick() {
  plots.forEach((plot) => {
    if (!plot) return;
    const rate = plot.type === "coop" ? 2 : 3;
    money += plot.level * rate;
  });
  render();
  saveGame();
}

function saveGame() {
  localStorage.setItem("plots", JSON.stringify(plots));
}

// Start ticking income every second
setInterval(tick, 1000);
render();
