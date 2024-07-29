const sourceMap = {
  fail: 'data',
  host: 'https://cs6413110.github.io/Pixel-Tanks/public/images',
  map: [ // image loading
    {
      ref: 'blocks', // property stored as on PixelTanks.images
      path: 'blocks', // Location on host, *optional host property to overwrite default
      load: ['barrier', 'strong', 'weak', 'spike', 'floor', 'void', 'gold', 'fire', 'friendlyfire', 'airstrike', 'friendlyairstrike'],
    },
    {
      ref: 'bullets',
      path: 'bullets',
      load: ['shotgun', 'powermissle', 'healmissle', 'megamissle', 'grapple', 'dynamite', 'fire', 'usb'],
    },
    {
      ref: 'tanks',
      path: 'tanks',
      load: ['buff', 'reflect', 'base', 'destroyed', 'top', 'bottom', 'bottom2'],
    },
    {
      ref: 'menus',
      path: 'menus',
      load: ['ui', 'start', 'main', 'multiplayer', 'singleplayer', 'singleplayer2', 'victory', 'defeat', 'crate', 'settings1', 'settings2', 'inventory', 'classTab', 'itemTab', 'perkTab', 'cosmeticTab', 'shop', 'shop2', 'broke', 'htp1', 'htp2', 'htp3', 'htp4', 'pause', 'help', 'helpinventory', 'helpcosmetic', 'helpclass', 'helpmode', 'helpvocab', 'helpteam', 'broke', 'locked', 'alert', 'adrenaline1', 'adrenaline2', 'adrenaline3', 'cooldown1', 'cooldown2', 'cooldown3', 'core1', 'core2', 'core3', 'hook1', 'hook2', 'hook3', 'radar1', 'radar2', 'refresh1', 'refresh2', 'scavenger1', 'scavenger2', 'scavenger3', 'shield1', 'shield2', 'thermal1', 'thermal2', 'thermal3']
    },
    {
      ref: 'animations',
      path: 'animations',
      load: ['tape', 'glu', 'fire', 'text', 'detonate', 'explosion', 'healexplosion', 'smoke'],
      meta: {
        tape_: { frames: 17, speed: 50 },
        toolkit_: { frames: 16, speed: 50 },
        glu_: { frames: 45, speed: 50 },
        fire_: { frames: 1, speed: 50 },
        text_: { frames: 37, speed: 50 },
        detonate_: { frames: 28, speed: 20 },
      },
    },
    {
      ref: 'items',
      path: 'items',
      load: ['airstrike', 'duck_tape', 'super_glu', 'shield', 'flashbang', 'bomb', 'dynamite', 'weak', 'strong', 'spike', 'reflector', 'usb'],
    },
  ],
  cosmetic: {
    path: 'cosmetics',
    common: ['medic', 'police', 'small_scratch', 'spikes', 'moustache', 'pumpkin_face', 'army', 'hardhat', 'halo', 'lego', 'present', 'pumpkin_hat', 'top_hat', 'stamp', 'dead', 'earmuffs', 'ban', 'sweat'],
    uncommon: ['chip', 'deep_scratch', 'evil_eye', 'inferno_eye', 'motherboard', 'blue_wings', 'blue_horns', 'white_wings', 'white_horns', 'gold_wings', 'gold_horns', 'devil_wings', 'devil_horns', 'hazard', 'angel_wings', 'bat_wings', 'locked', 'mini_tank', 'dust'],
    rare: ['blue_tint', 'glitch', 'blue_helmet', 'white_helmet', 'helmet', 'gold_helmet', 'hacker_hoodie', 'sus', 'magma'],
    epic: ['christmas_hat', 'christmas_lights', 'dizzy', 'rage', 'toxic', 'crown', 'dark_crown', 'error'],
    legendary: ['hoodie', 'plasma'],
    mythic: ['terminator', 'mlg_glasses', 'power_armor'],
  },
  deathEffect: {
  }
  /*crate = [{
          common: ['white horns', 'white wings', 'blue horns', 'gold horns', 'blue wings', 'gold wings', 'watermelon', 'Spooked', 'Cute Eyes', 'Army', 'Top Hat', 'X', 'Red Hoodie', 'Devil Wings', 'Devil Horns', 'Exclaimation Point', 'Orange Hoodie', 'GoldShield', 'Yellow Hoodie', 'Green Hoodie', 'Blue Hoodie', 'Purple Hoodie', 'Cancelled', 'Spirals', 'Speaker', 'Spikes', 'Candy Cane', 'Pumpkin Face', 'Mask', 'Purple-Pink Hoodie', 'Bunny Ears'],
          uncommon: ['glitch', 'spoider', 'CompanionCube', 'PortalCube', 'half glitch', 'eye', 'Anime Eyes', 'Angry Eyes', 'Hard Hat', 'Present', 'Dead', 'Peace', 'Question Mark', 'Small Scratch', 'Kill = Ban', 'Reindeer Hat', 'Pumpkin Hat', 'Cat Ears', 'Cake', 'Cat Hat', 'bread', 'First Aid', 'silver', 'Fisher Hat', 'chip', 'eyes', 'zombie', 'googly', 'static', 'lava', 'void knight'],
          rare: ['gold helment', 'toxic', 'Antlers', 'White helment', 'Blue Helment', 'Aqua Helment', 'Purple helment', 'Stripes', 'scoped', 'brain', 'Hands', 'Straw Hat', 'Hax', 'Tools', 'Money Eyes', 'Dizzy', 'Checkmark', 'Sweat', 'Scared', 'Blue Tint', 'Purple Top Hat', 'Purple Grad Hat', 'Eyebrows', 'Helment', 'Rudolph', 'Candy Corn', 'Flag', 'Katana',  'Swords', 'angry hoodie'],
          epic: ['Aaron', 'hacker_hoodie', 'Plasma Ball', 'Hazard', 'Locked', 'Elf', 'Triple Gun', 'Evil Eyes', 'Gold', 'Rage', 'Onfire', 'Halo', 'Police', 'Deep Scratch', 'bluekatana', 'Assassin', 'Astronaut', 'Christmas Lights', 'No Mercy', 'Error', 'disguise', 'Lego', 'Paleontologist'],
          legendary: ['Sun Roof', 'Blind', 'Redsus', 'Uno Reverse', 'Christmas Hat', 'Mini Tank',],
          mythic: ['Terminator', 'MLG Glasses', 'Power Armor', 'venom'],
        }, {
          common: ['explode', 'nuke', 'insta', 'evan'], //bruh why am i common :(
          uncommon: ['anvil', 'gameover', 'minecraft'],
          rare: ['darksouls', 'magic', 'Cactus'],
          epic: ['battery', 'skull', 'banhammer'],
          legendary: ['error', 'tombstone', 'pokeball'],
          mythic: ['clicked', 'cat'],
        }];*/
}
/*const images = {
  cosmetics: {
    'Plasma Ball': '/cosmetics/Plasma',
    'PWR-DMG'S HELM': '/cosmetics/pwr-dmg-helm',
    'venom': '/cosmetics/venom',
    'toxic': '/cosmetics/toxic',
    'spoider': '/cosmetics/spoider',
    'Power Armor': '/cosmetics/power_armor',
    'void knight': '/cosmetics/voidknight',
    'lava': '/cosmetics/lava',
    'Antlers': '/cosmetics/Antlers',
    'static': '/cosmetics/static',
    'disguise': '/cosmetics/disguise',
    'angry hoodie': '/cosmetics/angry_hoodie',
    'PortalCube': '/cosmetics/PortalCube',
    'CompanionCube': '/cosmetics/CompanionCube',
    'googly': '/cosmetics/googly',
    'eyes': '/cosmetics/eyes',
    'zombie': '/cosmetics/zombie',
    'watermelon': '/cosmetics/watermelon',
    'bread': '/cosmetics/bread',
    'eye': '/cosmetics/eye',
    'half glitch': '/cosmetics/half_glitch',
    'glitch': '/cosmetics/glitch',
    'gold helment': '/cosmetics/gold_helment',
    'white horns': '/cosmetics/white_horns',
    'white wings': '/cosmetics/white_wings',
    'blue horns': '/cosmetics/blue_horns',
    'blue wings': '/cosmetics/blue_wings',
    'gold horns': '/cosmetics/gold_horns',
    'gold wings': '/cosmetics/gold_wings',
    'White helment': '/cosmetics/white_helment',
    'dmgcrown': '/cosmetics/dmgcrown',
    'LostKing': '/cosmetics/Jonas',
    'hacker_hoodie': '/cosmetics/hacker_hoodie',
    'totem': '/cosmetics/totem',
    'venomeme': '/cosmetics/venomeme',
    'carnage': '/cosmetics/carnage',
    'brain': '/cosmetics/brain',
    'Hands': '/cosmetics/Hands',
    'silver': '/cosmetics/silver',
    'Purple helment': '/cosmetics/purple_helment',
    'scoped': '/cosmetics/scoped',
    'Astronaut': '/cosmetics/astronaut',
    'Onfire': '/cosmetics/onfire',
    'Assassin': '/cosmetics/assassin',
    'Redsus': '/cosmetics/redsus',
    'Venom': '/cosmetics/venom',
    'Blue Tint': '/cosmetics/blue_tint',
    'Purple Flower': '/cosmetics/purple_flower',
    'Leaf': '/cosmetics/leaf',
    'Basketball': '/cosmetics/basketball',
    'Purple Top Hat': '/cosmetics/purple_top_hat',
    'Terminator': '/cosmetics/terminator',
    'Dizzy': '/cosmetics/dizzy',
    'Katana': '/cosmetics/katana',
    'Knife': '/cosmetics/knife',
    'Scared': '/cosmetics/scared',
    'Laff': '/cosmetics/laff',
    'Hacker Hoodie': '/cosmetics/hacker_hoodie',
    'Error': '/cosmetics/error',
    'Purple Grad Hat': '/cosmetics/purple_grad_hat',
    'Bat Wings': '/cosmetics/bat_wings',
    'Fisher Hat': '/cosmetics/fisher_hat',
    'Kill = Ban': '/cosmetics/ban',
    'Blue Ghost': '/cosmetics/blue_ghost',
    'Pumpkin Face': '/cosmetics/pumpkin_face',
    'Pumpkin Hat': '/cosmetics/pumpkin_hat',
    'Red Ghost': '/cosmetics/red_ghost',
    'Candy Corn': '/cosmetics/candy_corn',
    'Orange Ghost': '/cosmetics/orange_ghost',
    'Pink Ghost': '/cosmetics/pink_ghost',
    'Paleontologist': '/cosmetics/paleontologist',
    'Yellow Hoodie': '/cosmetics/yellow_hoodie',
    'bluekatana': '/cosmetics/bluekatana',
    'X': '/cosmetics/x',
    'Sweat': '/cosmetics/sweat',
    'GoldShield': '/cosmetics/GoldShield',
    'Spirals': '/cosmetics/spirals',
    'Spikes': '/cosmetics/spikes',
    'Rudolph': '/cosmetics/rudolph',
    'Reindeer Hat': '/cosmetics/reindeer_hat',
    'Red Hoodie': '/cosmetics/red_hoodie',
    'Question Mark': '/cosmetics/question_mark',
    'Purple-Pink Hoodie': '/cosmetics/purplepink_hoodie',
    'Purple Hoodie': '/cosmetics/purple_hoodie',
    'Aaron': '/cosmetics/aaron',
    'Pumpkin': '/cosmetics/pumpkin',
    'Pickle': '/cosmetics/pickle',
    'Orange Hoodie': '/cosmetics/orange_hoodie',
    'Helment': '/cosmetics/helment',
    'Green Hoodie': '/cosmetics/green_hoodie',
    'Exclaimation Point': '/cosmetics/exclaimation_point',
    'Eggplant': '/cosmetics/eggplant',
    'Devil Wings': '/cosmetics/devils_wings',
    'Christmas Tree': '/cosmetics/christmas_tree',
    'Christmas Lights': '/cosmetics/christmas_lights',
    'Checkmark': '/cosmetics/checkmark',
    'Cat Hat': '/cosmetics/cat_hat',
    'Blueberry': '/cosmetics/blueberry',
    'Blue Hoodie': '/cosmetics/blue_hoodie',
    'Blue Helment': '/cosmetics/blue_helment',
    'Banana': '/cosmetics/bannana',
    'Aqua Helment': '/cosmetics/aqua_helment',
    'Apple': '/cosmetics/apple',
    'Hoodie': '/cosmetics/hoodie',
    'Purple Helment': '/cosmetics/purple_helment',
    'Angel Wings': '/cosmetics/angel_wings',
    'Boost': '/cosmetics/boost',
    'Bunny Ears': '/cosmetics/bunny_ears',
    'Cake': '/cosmetics/cake',
    'Cancelled': '/cosmetics/cancelled',
    'Candy Cane': '/cosmetics/candy_cane',
    'Cat Ears': '/cosmetics/cat_ears',
    'Christmas Hat': '/cosmetics/christmas_hat',
    'Controller': '/cosmetics/controller',
    'Deep Scratch': '/cosmetics/deep_scratch',
    'Devil Horns': '/cosmetics/devil_horn',
    'Headphones': '/cosmetics/earmuffs',
    'Eyebrows': '/cosmetics/eyebrows',
    'First Aid': '/cosmetics/first_aid',
    'Flag': '/cosmetics/flag',
    'Halo': '/cosmetics/halo',
    'Hax': '/cosmetics/hax',
    'Low Battery': '/cosmetics/low_battery',
    'Mini Tank': '/cosmetics/mini_tank',
    'MLG Glasses': '/cosmetics/mlg_glasses',
    'Money Eyes': '/cosmetics/money_eyes',
    'No Mercy': '/cosmetics/no_mercy',
    'Peace': '/cosmetics/peace',
    'Police': '/cosmetics/police',
    'Question Mark': '/cosmetics/question_mark',
    'Rage': '/cosmetics/rage',
    'Small Scratch': '/cosmetics/small_scratch',
    'Speaker': '/cosmetics/speaker',
    'Swords': '/cosmetics/swords',
    'Tools': '/cosmetics/tools',
    'Top Hat': '/cosmetics/top_hat',
    'Uno Reverse': '/cosmetics/uno_reverse',
    'Mask': '/cosmetics/victim',
    'Present': '/cosmetics/present',
    'Blind': '/cosmetics/blind',
    'Gold': '/cosmetics/gold',
    'Straw Hat': '/cosmetics/strawhat',
    'Evil Eyes': '/cosmetics/evileye',
    'Lego': '/cosmetics/lego',
    'Dead': '/cosmetics/dead',
    'Sun Roof': '/cosmetics/sunroof',
    'Army': '/cosmetics/army',
    'Stamp': '/cosmetics/stamp',
    'Triple Gun': '/cosmetics/triplegun',
    'Hard Hat': '/cosmetics/hardhat',
    'Elf': '/cosmetics/elf',
    'Spooked': '/cosmetics/spooked',
    'Locked': '/cosmetics/locked',
    'Angry Eyes': '/cosmetics/angryeyes',
    'Cute Eyes': '/cosmetics/cuteeyes',
    'Stripes': '/cosmetics/stripe',
    'Hazard': '/cosmetics/hazard',
    'Anime Eyes': '/cosmetics/animeeyes',
    'chip': '/cosmetics/chip',
  },
  deathEffects: {
    banhammer:'/animations/banhammer',
    banhammer_: { frames: 29, speed: 50, kill: 7, type: 1 },
    pokeball:'/animations/pokeball',
    pokeball_: { frames: 85, speed: 50, kill: 18, type: 2 },
    explode: '/animations/explode',
    explode_: { frames: 17, speed: 75, kill: 8, type: 1 },
    clicked: '/animations/clicked',
    clicked_: { frames: 29, speed: 75, kill: 28, type: 2 },
    Cactus: '/animations/Cactus',
    Cactus_: { frames: 19, speed: 23, kill: 9, type: 2 },
    nuke: '/animations/nuke',
    nuke_: { frames: 12, speed: 75, kill: 6, type: 1 },
    error: '/animations/error',
    error_: { frames: 10, speed: 300, kill: 10, type: 2 },
    magic: '/animations/magic',
    magic_: { frames: 69, speed: 50, kill: 51, type: 2 },
    securly: '/animations/securly',
    securly_: {frames: 1, speed: 9900, kill: 1, type: 3},
    anvil: '/animations/anvil',
    anvil_: { frames: 22, speed: 75, kill: 6, type: 1 },
    insta: '/animations/insta',
    insta_: { frames: 22, speed: 75, kill: 21, type: 1 },
    cat: '/animations/cat',
    cat_: { frames: 2, speed: 500, kill: 2, type: 1 },
    battery: '/animations/battery',
    battery_: { frames: 55, speed: 75, kill: 54, type: 2 },
    evan: '/animations/evan',
    evan_: { frames: 8, speed: 500, kill: 7, type: 1 },
    minecraft: '/animations/minecraft',
    minecraft_: { frames: 22, speed: 100, kill: 15, type: 2 },
    gameover: '/animations/gameover',
    gameover_: { frames: 40, speed: 75, kill: 1, type: 2 },
    skull: '/animations/skull',
    skull_: { frames: 11, speed: 50, kill: 1, type: 1 },
    darksouls: '/animations/darksouls',
    darksouls_: { frames: 56, speed: 50, kill: 33, type: 2 },
    tombstone: '/animations/tombstone',
    tombstone_: { frames: 36, speed: 50, kill: 8, type: 1 }
  },
}; */
