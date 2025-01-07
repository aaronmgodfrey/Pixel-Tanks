class Menus {
  static start() {
    Menus.renderer = requestAnimationFrame(Menus.render);
  }
  
  static render() {
    Menus.renderer = requestAnimationFrame(Menus.render);
    GUI.clear();
    Menus.redraw();
  }
  
  static mouseLog(e) {
    Menus.x = (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/window.innerHeight*1000;
    Menus.y = e.clientY/window.innerHeight*1000;
  }
  
  static stop() {
    cancelAnimationFrame(Menus.renderer);
    Menus.renderer = undefined;
  }
  
  static trigger(name) {
    if (Menus.current) Menus.menus[Menus.current].removeListeners();
    if (Menus.renderer === undefined) Menus.start();
    Menus.current = name;
    Menus.menus[Menus.current].addListeners();
  }

  static softTrigger(name) {
    PixelTanks.user.player.menu = name;
    for (const b of Menus.menus[name].elements) b.style.visibility = 'visible';
  }

  static softUntrigger() {
    for (const b of Menus.menus[PixelTanks.user.player.menu].elements) b.style.visibility = 'hidden';
    PixelTanks.user.player.menu = false;
  }
  
  static redraw() {
    if (!Menus.current) return; else Menus.menus[Menus.current].draw();
  }
  
  static removeListeners() {
    Menus.stop();
    Menus.menus[Menus.current].removeListeners();
  }
}
