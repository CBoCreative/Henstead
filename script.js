const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#a3d9a5',
  parent: 'game',
  scene: {
    preload,
    create,
    update
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);

let money = 100;
let selectedBuilding = null;
const tileSize = 64;
const gridWidth = 10;
const gridHeight = 8;
let gridGroup;
let buildings = [];

function preload() {
  this.load.image('tile', 'https://opengameart.org/sites/default/files/tile_grass_0.png');
  this.load.image('coop', 'https://opengameart.org/sites/default/files/chicken_coop_icon.png');
  this.load.image('garden', 'https://opengameart.org/sites/default/files/garden_icon.png');
}

function create() {
  gridGroup = this.add.group();
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const tile = this.add.image(
        (x - y) * tileSize / 2 + 400,
        (x + y) * tileSize / 4 + 50,
        'tile'
      ).setInteractive();
      tile.setData({ x, y, built: false });
      tile.on('pointerdown', () => placeBuilding(this, tile));
      gridGroup.add(tile);
    }
  }
  updateMoney();
}

function update() {}

function placeBuilding(scene, tile) {
  if (!selectedBuilding || tile.getData('built')) return;
  let cost = selectedBuilding === 'coop' ? 50 : 75;
  if (money < cost) return;

  const building = scene.add.image(tile.x, tile.y - 20, selectedBuilding);
  building.setScale(0.6);
  tile.setData('built', true);
  buildings.push({ tile, type: selectedBuilding });

  money -= cost;
  updateMoney();
}

function selectBuilding(type) {
  selectedBuilding = type;
}

function updateMoney() {
  document.getElementById('money').textContent = money;
}
