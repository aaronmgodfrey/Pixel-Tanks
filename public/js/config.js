window.sourceMap = {
  fail: 'data',
  host: 'https://aaronmgodfrey.github.io/Pixel-Tanks/public/images',
  map: [ // image loading
    {
      ref: 'bullets',
      path: 'bullets',
      load: ['normal', 'shotgun', 'powermissle', 'torpedo', 'megamissle', 'grapple', 'dynamite', 'fire', 'usb'],
    },
    {
      ref: 'tanks',
      path: 'tanks',
      load: ['buff', 'reflect', 'base', 'destroyed', 'top', 'bottom', 'bottom2'],
    },
    {
      ref: 'menus',
      path: 'menus',
      load: ['credits', 'perksheet', 'world1', 'world2', 'world3', 'world4', 'world5', 'ui', 'stats', 'start', 'main', 'multiplayer', 'victory', 'victory2', 'defeat', 'crate', 'settings', 'inventory', 'classTab', 'itemTab', 'perkTab', 'cosmeticTab', 'shop', 'shop2', 'broke', 'pause', 'locked', 'adrenaline', 'cooldown', 'core', 'radar', 'refresh', 'scavenger', 'shield', 'thermal', 'arrow', 'arrow_friendly', 'upgrader'],
    },
    {
      ref: 'animations',
      path: 'animations',
      load: ['lightning', 'tape', 'glu', 'fire', 'detonate', 'explosion', 'healexplosion', 'shield_make', 'shield_break'],
      meta: {
        tape_: { frames: 17, speed: 50 },
        toolkit_: { frames: 16, speed: 50 },
        glu_: { frames: 45, speed: 50 },
        fire_: { frames: 1, speed: 50 },
        detonate_: { frames: 28, speed: 20 },
        lightning_: { frames: 20, speed: 35 },
      },
    },
    {
      ref: 'items',
      path: 'items',
      load: ['airstrike', 'duck_tape', 'super_glu', 'shield', 'flashbang', 'bomb', 'dynamite', 'weak', 'strong', 'spike', 'reflector', 'usb'],
    },
  ],
  blocks: {
    path: 'blocks',
    load: ['goal', 'supplyairstrike', 'spike', 'fire', 'friendlyfire', 'airstrike', 'friendlyairstrike', 'crate', 'friendlyspike'],
    perZone: ['barrier', 'strong', 'weak', 'floor', 'void', 'gold'],
    zones: ['battlegrounds', 'cave', 'deep', 'ice', 'gem'],
  },
  cosmetic: {
    path: 'cosmetics',
    common: ['medic', 'police', 'log', 'small_scratch', 'spikes', 'moustache', 'pumpkin_face', 'army', 'hardhat', 'halo', 'lego', 'present', 'pumpkin_hat', 'top_hat', 'stamp', 'dead', 'earmuffs', 'ban', 'sweat', 'lava', 'bricks'],
    uncommon: ['camo', 'ripped', 'scarred', 'block', 'chip', 'deep_scratch', 'evil_eye', 'inferno_eye', 'motherboard', 'blue_wings', 'blue_horns', 'white_wings', 'white_horns', 'gold_wings', 'gold_horns', 'devil_wings', 'devil_horns', 'hazard', 'angel_wings', 'bat_wings', 'locked', 'mini_tank', 'dust', 'pouch'],
    rare: ['nvg', 'cracked', 'blue_tint', 'glitch', 'blue_helmet', 'white_helmet', 'helmet', 'gold_helmet', 'hacker_hoodie', 'purple', 'visor', 'veins', 'cookie', 'splattered'],
    epic: ['smoke', 'christmas_hat', 'christmas_lights', 'dizzy', 'rage', 'toxic', 'error', 'supersight', 'crown', 'darkcrown'],
    legendary: ['plasma', 'cry', 'missing', 'hoodie', 'galaxy',],
    admin: [],
    mythic: ['terminator', 'mlg_glasses', 'corrupted'],
    meta: {},
  },
  deathEffect: {
    path: 'animations',
    common: ['explode', 'nuke', 'insta', 'evan'],
    uncommon: ['anvil', 'gameover', 'erase'],
    rare: ['magic', 'shatter'],
    epic: ['battery', 'skull', 'banhammer', 'blackhole'],
    legendary: ['error', 'tombstone'],
    mythic: ['clicked', 'cat'],
    meta: {
      shatter_: {frames: 18, speed: 100, kill: 12, type: 2},
      pokeball_: {frames: 85, speed: 50, kill: 18, type: 2},
      explode_: {frames: 17, speed: 75, kill: 8, type: 1},
      clicked_: {frames: 29, speed: 75, kill: 28, type: 2},
      //Cactus_: { frames: 19,  type: 2 },
      nuke_: {frames: 12, speed: 75, kill: 6, type: 1},
      error_: {frames: 10, speed: 300, kill: 10, type: 2},
      magic_: {frames: 69, speed: 50, kill: 51, type: 2},
      securly_: {frames: 1, speed: 9900, kill: 1, type: 3},
      anvil_: {frames: 22, speed: 75, kill: 6, type: 1},
      insta_: {frames: 22, speed: 75, kill: 21, type: 1}, 
      cat_: {frames: 2, speed: 500, kill: 2, type: 1},
      battery_: {frames: 55, speed: 75, kill: 54, type: 2},
      evan_: {frames: 8, speed: 500, kill: 7, type: 1},
      minecraft_: {frames: 22, speed: 100, kill: 15, type: 2},
      gameover_: {frames: 40, speed: 75, kill: 1, type: 2},
      skull_: {frames: 11, speed: 50, kill: 1, type: 1},
      darksouls_: {frames: 56, speed: 50, kill: 33, type: 2},
      tombstone_: {frames: 36, speed: 50, kill: 8, type: 1},
      blackhole_: {frames: 40, speed: 100, kill: 28, type: 2},
      erase_: {frames: 17, speed: 100, kill: 10, type: 2},
    }
  },
  sounds: {
    path: 'sounds',
    load: ['battlegrounds', 'menu', 'menuopener', 'victory', 'defeat', 'ice', 'gem', 'cave', 'deep'],
  },
}
