window.oncontextmenu = () => false;

const canvas = document.createElement('canvas'), draw = canvas.getContext('2d'), output = document.createElement('div'), coords = document.createElement('div'), select = document.createElement('div');
canvas.width = 599;
canvas.height = 599;
canvas.tabIndex = 1;
document.documentElement.appendChild(coords);
document.documentElement.appendChild(output);
document.documentElement.appendChild(canvas);
document.documentElement.appendChild(select);
const zone = prompt('Enter zone: battlegrounds, cave, ice, deep');
const type = +prompt('Enter level type(1-3 ONLY): 1 - Genocide, 2 - Extraction, 3 - Survival');
const key = [
  ['X', 'Eraser', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAABCAQAAAB0m0auAAAADElEQVR42mNkIBIAAABSAAI2VLqiAAAAAElFTkSuQmCC'],
  ['Q', 'Weak Block', 'blocks/'+zone+'/weak'],
  ['Z', 'Strong Block', 'blocks/'+zone+'/strong'],
  ['G', 'Gold Block', 'blocks/'+zone+'/gold'],
  ['I', 'Barrier Block', 'blocks/'+zone+'/barrier'],
  ['R', 'Void Block', 'blocks/'+zone+'/void'],
  ['V', 'Spike', 'blocks/spike'],
  ['E', 'Explosive Barrel', 'blocks/barrel'],
  ['T', 'Turret', 'cosmetics/hoodie'],
  ['W', 'Adv. AI', 'cosmetics/police'],
  ['P', 'Dis. AI', 'cosmetics/blue_helmet'],
  ['D', 'Def. AI', 'cosmetics/terminator'],
  ['S', 'Global Spawn', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mNk+C/xn4GKgHHUwFEDRw0cNXDUwJFqIABtgCnNTYQqZgAAAABJRU5ErkJggg=='],
  ['A', 'Spawn A', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAHklEQVR42mP8z8AARNQDjKMGjho4auCogaMGjlQDAUwCJ+0NBcXlAAAAAElFTkSuQmCC'],
  ['B', 'Spawn B', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mNkkPj/n4GKgHHUwFEDRw0cNXDUwJFqIABbdCnNVZ8NSQAAAABJRU5ErkJggg=='],
  ['C', 'Crate', 'blocks/crate'],
  ['F', 'Finish', 'blocks/goal'],
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
  coords.innerHTML = Math.ceil((x+1)/10)+', '+Math.ceil((y+1)/10);
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
    world[Math.floor(y/10)][Math.floor(x/10)] = e.button === 0 ? current : 'X';
    output.innerHTML = ex();
  }
}

const ex = () => {
  let output = '', p = world[0][0], streak = 0;
  for (let y = 0; y < 60; y++) {
    for (let x = 0; x < 60; x++) {
      let c = world[y][x];
      if (p === c) streak++;
      if (p !== c || (x === 59 && y === 59)) {
        output += streak === 1 ? p : p+streak;
        streak = 1;
        p = c;
      }
    }
  }
  return JSON.stringify([type, zone, output]).replace(/"/g, "'");
}

const im = s => {
  let chars = s.split(''), a = [];
  main: for (let i = 0; i < chars.length; i++) {
    a.push(chars[i]);
    for (let q = 1, n = ''; true; q++) if (isNaN(chars[i+q])) {
      a.push(q === 1 ? 1 : Number(n));
      i += q-1;
      continue main;
    } else n += chars[i+q];
    a.push(Number(n));
  }
  let l = 0, x = 0, y = 0;
  for (let i = 0; i < a.length; i += 2) {
    for (let m = 0; m < a[i+1]; m++) {
      world[Math.floor(l/60)][l%60] = a[i];
      l++;
    }
  }
}

let importer = document.createElement('BUTTON');
importer.innerHTML = 'Import';
document.documentElement.appendChild(importer);
importer.addEventListener('click', () => {
  eval('sourced = '+prompt('Input level code:'));
  im(sourced[2]);
  zone = sourced[1];
  type = sourced[0];
  output.innerHTML = ex();
});

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
