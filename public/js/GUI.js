class GUI {
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
