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
    this.elements.length = 0;
    for (const b of this.buttons) {
      let button = document.createElement('BUTTON'), image = document.createElement('IMG');
      button.onclick = () => (typeof b[4] === 'function' ? b[4].bind(this)() :  Menus.trigger(b[4]));
      button.width = window.innerHeight*(button.w = Menu.scaler.width = b[2])/1000;
      button.height = window.innerHeight*(button.h = Menu.scaler.height = b[3])/1000;
      const leftOffset = (window.innerWidth-window.innerHeight*1.6)/2+(button.x = b[0])/1000*window.innerHeight;
      button.style = 'position: absolute; left: '+leftOffset+'px; top: '+(window.innerHeight*(button.y = b[1])/1000)+'px; padding: 0; border: 0;';
      image.style = 'width: 100%; height: 100%';
      Menu.scaler.getContext('2d').drawImage(GUI.draw, -b[0], -b[1], 1600, 1000);
      image.src = Menu.scaler.toDataURL();
      button.appendChild(image);
      document.body.appendChild(button);
      this.elements.push(button);
    }
  }
  adapt() {
    for (const e of this.elements) {
      e.width = window.innerHeight*e.w/1000;
      e.height = window.innerHeight*e.h/1000;
      e.style.top = (window.innerHeight*e.x/1000)+'px';
      e.style.left = (window.innerHeight*e.y/1000)+'px';
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
