class Menu {
  static scaler = document.createElement('CANVAS');
  constructor(data, id) {
    this.id = id;
    this.listeners = data.listeners;
    this.buttons = data.buttons;
    this.elements = [];
    this.loaded = false;
    this.cdraw = data.cdraw.bind(this);
    for (const l in this.listeners) this.listeners[l] = this.listeners[l].bind(this);
  }
  compile() {
    // remove old elements from dom to reduce lag here eventually
    this.elements = this.elements.reduce((a, c) => (c.tagName !== 'button' ? a.concat(c) : a), []);
    for (const b of this.buttons) {
      let button = document.createElement('BUTTON'), image = document.createElement('IMG');
      button.onclick = () => (typeof b[4] === 'function' ? b[4].bind(this)() : Menus.trigger(b[4]));
      button.width = image.width = window.innerHeight*(button.w = Menu.scaler.width = b[2])/1000;
      button.height = image.height = window.innerHeight*(button.h = Menu.scaler.height = b[3])/1000;
      const leftOffset = (window.innerWidth-window.innerHeight*1.6)/2+(button.x = b[0])/1000*window.innerHeight;
      Menu.scaler.getContext('2d').drawImage(GUI.canvas, -b[0], -b[1], 1600, 1000);
      image.src = Menu.scaler.toDataURL();
      button.style = 'position: absolute; left: '+leftOffset+'px; top: '+(window.innerHeight*(button.y = b[1])/1000)+'px; padding: 0; border: 0; ';
      button.className = 'expand';
      button.appendChild(image);
      document.body.appendChild(button);
      this.elements.push(button);
    }
  }
  adapt() {
    if (!this.elements.length) this.loaded = false;
    for (const e of this.elements) {
      e.style.width = e.width = window.innerHeight*e.w/1000;
      e.style.height = e.height = window.innerHeight*e.h/1000;
      if (e.children.length) for (const c of e.children) {
        c.style.width = c.width = window.innerHeight*e.w/1000;
        c.style.height = c.height = window.innerHeight*e.h/1000;
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
