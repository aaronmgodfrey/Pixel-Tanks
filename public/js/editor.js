window.oncontextmenu = () => false;

const canvas = document.createElement('canvas'), draw = canvas.getContext('2d'), output = document.createElement('div'), coords = document.createElement('div'), select = document.createElement('div'), porter = document.createElement('BUTTON');
document.documentElement.innerHTML += '<h1>Pixel Tanks Level Editor</h1>';
canvas.width = 599;
canvas.height = 599;
canvas.tabIndex = 1;
porter.innerHTML = 'Import';
document.documentElement.appendChild(coords);
document.documentElement.appendChild(output);
document.documentElement.appendChild(canvas);
document.documentElement.appendChild(select);
document.documentElement.appendChild(porter);

const key = [
  ['X', 'Eraser', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAABCAQAAAB0m0auAAAADElEQVR42mNkIBIAAABSAAI2VLqiAAAAAElFTkSuQmCC'],
  ['Q', 'Weak Block', 'blocks/weak'],
  ['Z', 'Strong Block', 'blocks/strong'],
  ['G', 'Gold Block', 'blocks/gold'],
  ['I', 'Barrier Block', 'blocks/barrier'],
  ['R', 'Void Block', 'blocks/void'],
  ['V', 'Spike', 'blocks/spike'],
  ['T', 'Turret', 'cosmetics/hoodie'],
  ['W', 'Adv. AI', 'cosmetics/police'],
  ['P', 'Dis. AI', 'cosmetics/blue_helmet'],
  ['D', 'Def. AI', 'cosmetics/terminator'],
  ['S', 'Global Spawn', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mNk+C/xn4GKgHHUwFEDRw0cNXDUwJFqIABtgCnNTYQqZgAAAABJRU5ErkJggg=='],
  ['A', 'Spawn A', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAHklEQVR42mP8z8AARNQDjKMGjho4auCogaMGjlQDAUwCJ+0NBcXlAAAAAElFTkSuQmCC'],
  ['B', 'Spawn B', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mNkkPj/n4GKgHHUwFEDRw0cNXDUwJFqIABbdCnNVZ8NSQAAAABJRU5ErkJggg=='],
];
const images = {};

let world = [], current = key[0][0];
for (let y = 0; y < 60; y++) {
  world[y] = [];
  for (let x = 0; x < 60; x++) world[y][x] = current;
}

for (const p of key) {
  const button = document.createElement('BUTTON');
  button.innerHTML = p[1];
  button.addEventListener('click', e => {
    current = p[0];
    document.querySelectorAll('button').forEach(e => (e.style.border = 'none'));
    button.style.border = '5px solid black';
  });
  select.appendChild(button);
  images[p[0]] = new Image();
  images[p[0]].src = p[2].includes('data') ? p[2] : 'https://cs6413110.github.io/Pixel-Tanks/public/images/'+p[2]+'.png';
}

let x, y;
canvas.addEventListener('mousemove', (e) => {
  x = e.offsetX;
  y = e.offsetY;
  coords.innerHTML = x+', '+y;
});

let drawLoop;
canvas.addEventListener('mousedown', (e) => {
  clearInterval(drawLoop);
  drawer(e);
  drawLoop = setInterval(drawer, 10, e);
});
window.addEventListener('mouseup', e => clearInterval(drawLoop));

const drawer = (e) => {
  if (x > 0 && y > 0 && x < 600 && y < 600) {
    world[Math.floor(y/10)][Math.floor(x/10)] = e.button === 0 ? current : 'B0';
    output.innerHTML = JSON.stringify(world);
  }
}


const convert = () => {
  let output = '';
  for (let y = 0; y < 60; y++) {
    for (let x = 0; x < 60; x++) {
      let id = world[y][x], s = y*60+x, next;
      do {
        s++;
        if (s >= 3600) output += ''
        next = world[Math.floor(s/60)][s%60];
        if (id !== next) 
      } while ();
      
    }
  }
}


const render = () => {
  draw.clearRect(0, 0, 600, 600);
  draw.strokeStyle = '#000000';
  for (let i = 1; i < 60; i++) {
    draw.beginPath();
    draw.moveTo(i*10, 0);
    draw.lineTo(i*10, 600);
    draw.stroke();
    draw.beginPath();
    draw.moveTo(0, i*10);
    draw.lineTo(600, i*10);
    draw.stroke();
  }
  for (const y in world) for (const x in world[y]) draw.drawImage(images[world[y][x]], x*10, y*10, 10, 10);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
