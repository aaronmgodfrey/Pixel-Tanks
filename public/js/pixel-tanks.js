(load = i => document.head.appendChild(Object.assign(document.createElement('SCRIPT'), {src: 'https://gitea.com/cs641311/Pixel-Tanks/raw/branch/master/public/js/'+['msgpackr', 'AI', 'Block', 'Client', 'Damage', 'Engine', 'GUI', 'MegaSocket', 'Menu', 'PixelTanks', 'Network', 'Menus', 'Shot', 'Singleplayer', 'Tank', 'A'][i]+'.js', onload: i++ < 15 ? () => load(i) : () => {window.onload = PixelTanks.start}})))(0);
