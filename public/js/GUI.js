class GUI {
  static setup() {
    document.body.innerHTML += `
    <button id='pack' onclick='PixelTanks.loadTexturePack(prompt("Config URL:"))'>Load Texturepack</button>
    <style>
      #pack {
        position: absolute;
        top: 0;
        right: 0;
      }
      html, body {
        margin: 0;
        padding: 0;
        text-align: center;
        background-color: black;
      }
      canvas {
        display: inline;
        height: 100%;
        width: calc(100vh*1.6);
      }
      @font-face {
        font-family: 'Font';
        src: url('https://aaronmgodfrey.github.io/Pixel-Tanks/public/fonts/PixelOperator.ttf') format('truetype');
      }
      * {
        font-family: Font;
      }
      input {
        position: absolute;
        background: transparent;
        border: none;
        font-size: 6vh;
      }
      .expand:hover {
        transform: scale(1.2);
      }
    </style>`;
    window.oncontextmenu = () => false;
    window.addEventListener('blur', e => (PixelTanks.focused = false));
    window.addEventListener('resize', e => { // TEMP move to GUI as static function
      for (const menu in Menus.menus) Menus.menus[menu].adapt();
      if (PixelTanks.user.player) PixelTanks.user.player.resize();
    });
    window.addEventListener('focus', e => {
      if (!PixelTanks.focused && PixelTanks.user.player) {
        if (PixelTanks.user.player.dx) PixelTanks.user.player.dx.t = Date.now();
        if (PixelTanks.user.player.dy) PixelTanks.user.player.dy.t = Date.now();
      }
      PixelTanks.focused = true;
    });
    const ui = e => {
      if (Client.input && Client.input.style.visibility === 'visible') return true;
      e.preventDefault();
      return false;
    };
    window.addEventListener('selectstart', ui);
    window.addEventListener('dragstart', ui);
    window.addEventListener('mousemove', Menus.mouseLog);
  }

  
  static resize() {
    PixelTanks.resizer = window.innerHeight/1000;
    GUI.canvas.height = window.innerHeight;
    GUI.canvas.width = window.innerHeight*1.6;
    GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
    Menus.redraw();
  }

  static drawImage(image, x, y, w, h, t, px, py, bx, by, a, cx, cy, cw, ch) {
    if (a !== undefined) {
      GUI.draw.translate(x+px, y+py);
      GUI.draw.rotate(a*Math.PI/180);
    }
    GUI.draw.globalAlpha = t;
    try {
      if (cx || cy || cy || ch) {
        GUI.draw.drawImage(image, cx, cy, cw, ch, a !== undefined ? -px+bx : x, a !== undefined ? -py+by : y, w, h);
      } else {
        GUI.draw.drawImage(image, a !== undefined ? -px+bx : x, a !== undefined ? -py+by : y, w, h);
      }
    } catch(e) {
      console.log('Draw failed: '+image+'; '+image?.src+'; '+e.stack);
    }
    GUI.draw.globalAlpha = 1;
    if (a !== undefined) {
      GUI.draw.rotate(-a*Math.PI/180);
      GUI.draw.translate(-x-px, -y-py);
    }
  }

  static drawText(message, x, y, size, color, anchor) {
    GUI.draw.font = `${size}px Font`;
    GUI.draw.fillStyle = color;
    GUI.draw.fillText(message, x-GUI.draw.measureText(message).width*anchor, y+size*.8*(1-anchor));
  }

  static clear = () => GUI.draw.clearRect(0, 0, 1600, 1000);
}
