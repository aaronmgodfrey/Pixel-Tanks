class Menu {
  static {
    this.scaler = document.createElement('CANVAS');
    this.scaler.getContext('2d').imageSmoothingEnabled = false;
  }
  constructor(data, id) {
    this.elements = [];
    this.loaded = false;
    this.id = id;
    this.listeners = data.listeners || {};
    this.buttons = data.buttons || [];
    this.cdraw = data.cdraw ? data.cdraw.bind(this) : () => {};
    this.ontrigger = data.ontrigger ? data.ontrigger.bind(this) : () => {};
    for (const l in this.listeners) this.listeners[l] = this.listeners[l].bind(this);
  }
  compile() {
    let compiled = this.elements.some(e => e.tagName === 'BUTTON');
    if (!compiled) for (const b of this.buttons) {
      let button = document.createElement('BUTTON'), image = document.createElement('IMG');
      button.image = image;
      button.onclick = () => (typeof b[4] === 'function' ? b[4]() : Menus.trigger(b[4]));
      button.width = image.width = window.innerHeight*(button.w = Menu.scaler.width = b[2])/1000;
      button.height = image.height = window.innerHeight*(button.h = Menu.scaler.height = b[3])/1000;
      button.b = b;
      const leftOffset = (window.innerWidth-window.innerHeight*1.6)/2+(button.x = b[0])/1000*window.innerHeight;
      Menu.scaler.getContext('2d').drawImage(GUI.canvas, -b[0], -b[1], 1600, 1000);
      image.src = Menu.scaler.toDataURL();
      button.style = 'position: absolute; left: '+leftOffset+'px; top: '+(window.innerHeight*(button.y = b[1])/1000)+'px; padding: 0; border: 0; ';
      button.className = 'expand';
      button.appendChild(image);
      document.body.appendChild(button);
      this.elements.push(button);
    }
    if (compiled) for (const e of this.elements) {
      if (e.tagName !== 'BUTTON') continue;
      Menu.scaler.width = e.b[2];
      Menu.scaler.height = e.b[3];
      Menu.scaler.getContext('2d').drawImage(GUI.canvas, -e.b[0], -e.b[1], 1600, 1000);
      e.image.src = Menu.scaler.toDataURL();
    }
  }
  adapt() {
    if (!this.elements.length) this.loaded = false;
    for (const e of this.elements) {
      e.style.width = (e.width = window.innerHeight*e.w/1000)+'px';
      e.style.height = (e.height = window.innerHeight*e.h/1000)+'px';
      if (e.children.length) for (const c of e.children) {
        c.style.width = (c.width = window.innerHeight*e.w/1000)+'px';
        c.style.height = (c.height = window.innerHeight*e.h/1000)+'px';
      }
      e.style.left = Math.max(0, (window.innerWidth-window.innerHeight*1.6)/2)+(window.innerHeight*e.x/1000)+'px';
      e.style.top = (window.innerHeight*e.y/1000)+'px';
    }
  }
  addListeners() {
    for (const l in this.listeners) window.addEventListener(l, this.listeners[l]);
    for (const b of this.elements) b.style.visibility = 'visible';
  }
  removeListeners() {
    for (const l in this.listeners) window.removeEventListener(l, this.listeners[l]);
    for (const b of this.elements) b.style.visibility = 'hidden';
  }
  draw() {
    if (PixelTanks.images.menus[this.id]) GUI.drawImage(PixelTanks.images.menus[this.id], 0, 0, 1600, 1000, 1);
    this.cdraw();
    if (!this.loaded) this.loaded = this.compile() || 1;
  }
}
