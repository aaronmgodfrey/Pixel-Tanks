class Singleplayer extends Engine {
  constructor(level) {
    const levels = [
      [2,'battlegrounds','R1229IR60IR54IRI5R58IR4I9R45IR3I3X7I2R48IXGX8I2R46I2X11IGIGIR40I3X16GR40IZX3I6GX5FXIR40IX4IG4I2X7GR39I2X4IGXDGI6GIGIR38I2X5G2X2GR48IX6IG4R48IZX4I2R52IX4I2R41IR11IX3ZIR43IR6Z4IX4IR38IRI5R5ZPXZI2ZX2IR43IR6ZX2Z3X2I2R42IR7Z4I2X2IR40I3R11I2X3IR38I3XI6R4I3X4IR38IX2QX5I6ZX4I2R38IQX2SX5QX8I2R39IX15ZXI2R3IR36I3QX3QX7QI3R3I3R37I9XZX2I2R4IRIRIR44I3QI2R7IR48Q4R7IR48QXWQR56QX2QR7IR48Q4R513'],
      [1,'battlegrounds','R1219I17R43IX15IR43IX4GX5GX4IR38I6X4GX5GX4I6R33IX8Rde3IXIR3X8IR33IX2WXIX3RI3ZI3RX3IXWX2IR33IX4IX3RIX5IRX3IX4IR33IX4IX3I2X5I2XG2IX4IR33IX4IX4ZX2DX2ZX4IX4IR33IX4IG2XI2X5I2X3IX4IR33IX4IX3RIX5IRX3IX4IR33IX8RI3ZI3RX3IX4IR33I6X3R3IXIR3X8IR38IX3GX11I6R38IX3GX3SX3GX3IR43IX11GX3IR43I17R1404'],
      [3,'battlegrounds','R1099X2QXWX5R50XI5XR2XR50XI5XR2PR50X5ZXR53X3QX4R52X6Q2XR51GXIXI2X3QR50X2IXSX2IX2R50XGIX4IX2R50X4I2XIXQR51X3ZQX4R52X2ZQX4R53X7R50XR2XI5XR50XR2XI5PR50XWX4QX3R1591'],
      [2,'battlegrounds','R1225Q2R58Q2R57Q4R55Q5R52QR2TX4RQR49Q2RX6TQRQR47Q2X9Q2R47TX10RQR43Q2RQX6IX7R42Q3RX4IX8ZX2WR38X13IX4ZX3R38XSX2IX2IX7IXRZX2R40QRQIX13ZXWR41Q3X3IX4IX4RQR44QX6IX5RQ2R45X10TQ2R48TX7QRQ2R48Q2X2TX3Q2R52X2RX3Q3R50Q6RQRQR52QRQR2QRQR54QR2QR1111'],
      [3,'battlegrounds','R1575I21R39IWX13WX4IR39IXIX6ZX4G4X2IR39IXZI3QX2ZX7GX2IR39IX2IX11Q2GX2IR39IX2IXI2ZX12IR39IX3QIX2IDI3X7IR39IX2QX4I3DIX2IX2QXIR39IX13I2SIX2IR39IX3GX4ZX7IX2IR39IX2G2X4ZQXQX2I3X2IR39IXG2X14IXIR39IX5WX10ZX2IR39I21R1224'],
      [2,'battlegrounds','R1611G2R10I7R41G3R9IX5IR36G9R8IX2SX2IRX6TIX2R2XR6PR4Q2X4TIXWXG10R7I2X3I2X19GX2Z3Q2X14FG5R6X29Z3XQX9G10R7X12Z3X2GX15QR2X4RWXG9R11XRX2GXTR3Z2X2PXR5X8R6X5R5G3R18IR17XTIR18G2R1507'],
      [1,'battlegrounds','R860I17R43IX15IR42I2XI4X5I4XI2R41IWX4IXZ3XIX4WIR41IX4GX3ZX3GX4IR41IX3IX4ZX4IX3IR41IXZXIX2I5X2IXZXIR41IXZXIXZX5ZXIXZXIR41IXZXIXI2X3I2XIXZXIR41IDX2IX9IX2DIR41I5X9I5R43IX13IR45I2X6QX4I2R46I5X3I5R51IXQZIR56X3IR55IX3R57X3R57ZXQR57X3R57XPDR57X3R57QXZR56IXZXR57X3R57X3IR55IXQXIR55IQXQIR52I4X3I4R49IX9IR49IX7SXIR49IX9IR49I11R806'],
      [1,'battlegrounds','R1157G12R48GX10G6R43GXI5XI2X5PGR43GX5IX2I7GR43GI4XI2X3IX3IGR43GX2PIX4IX3IXIGR43GXI3XI2XI4X2IGR43GX5IX5I2XIGR43GXI5X3ISIPX2GR43GX5IX3I3XI2GR43G4XPIX9GR46GXI2X3I2XI2XGR46GX10IXGR46GIXIXI5XIXGR46GX2IX3IPX4GR46GXI4XI3XI2GR46GPX6IX4GR46G14R1406'],
      [3,'battlegrounds','R1157X17R43XI3XI6XI4XR43XI15XR40X16G2X2R40XI2XI2XQX8GX3R40X5IX9G2X3R43X2I2X2I2XI2XGX4R43DX2IX2IX3IX5PR43DX3QXIXSXIX2QX2DR43DWX4IX3IX4QDR43X6I2XI2XQX4R43X20R40X2G2X3QX5I2X2I2XR40X20R40XI15XR43XI4XI6XI3XR43X17R1466'],
      [2,'battlegrounds','R1039X3R53X10R47X6ZX12R41QX3QX11Q2XR41QX19R40X3I10GI2X4R39Q2X2IX11IX2QXR38Z2X3IX9WXIXQX3R37ZX4IX2I7X2IX5R36XZX4IX2IX3WXIX2IX3Q2XR35XZ2X3IX2IXIGIXIX2IX5R36X2ZX3IWXIXIFIXGX2IX2ZX2R37X2QX2IX2IXI3WIX2IXZ2X2R37X5IX2GXWX3IX2IXZX3R37X2QX2IX2I7X2IX5R38X4IXWX9IX4R39XQX2IX8WX2IX4R39XQX2I4GI8X4R39X2ZX16QXR39X19QXR40X4Z2X3SX3Z2XQXZXR40X2Z3QX7ZX4ZR43X13RXR48X4R57XR1121'],
      [3,'battlegrounds','R1276X17R43XR6XGXR6XR43XR5X2GX2R5XR43XR4X7R4XR43XR3IX7IR3XR43XR2X2IX5IX2R2XR43XRX13RXR43X5DXQXQXDX5R43XG2XDWDZSZDWDXG2XR43X5DXQXQXDX5R43XRX13RXR43XR2X2IX5IX2R2XR43XR3IX7IR3XR43XR4X7R4XR43XR5X2GX2R5XR43XR6XGXR6XR43X17R1347'],
      [1,'battlegrounds','R1395P2X8R3PR50XIX2IXR3PR50XIX2IXR3XR50XI4XR3XR46X14R46XI3XIXI2XI3XR46XIX3ISXIX3IXR46XIX3IX2IX3IXR46XI3XI2XIXI3XR46X14R46XR3XI4XR50XR3XIX2IXR50PR3XIX2IXR50PR3X8P2R1411'],
      [2,'battlegrounds','R1163X9R48X2QX6WX4R43X7R7WX3R39X8QXR9X3R37X8R13X3R35X3WR18QXQR35QXQR7XQX5R6X2R34X4R5X10R5X2R34X3R5X5R3GQX2R4X3R33X3R5XQXR3G3RX2R5X2R33X3R4X3R4XFGRX3R4QXR33X2QR4X2R3QX2G2R2X2R4X2R33QX2R4X2R3X2R3X3QR5XQR32X3R4QXR3XWRX2WX3R5X2R33X3R3X2R3XWX2QX2R6X3R33X3R4XWR14X3R34X3R4X2QR11XQX2R36XSXR4X4R7X5R37X3R5XWX2WXQX6QR39X2R7QX7R1289'],
      [1,'battlegrounds','R1284P3R55X2W3X2R53XGD3GXR52X2IG3IX2R51X9R45X10SX10R39X21R39XR2GX13GR2XR39XR2G2X11G2R2XR39XR2G3X9G3R2XR39XR3GRXG3XG3XRGR3XR39X3R3X3GXGX3R3X3R39X21R39X2R17X2R39X4R13X4R39X21R39X8GX3GX8R42X5GX3GX5R49X7R1231'],
      [3,'battlegrounds','R1229X8R49X4I5X2R47X3I4R3I2XSR45X3I2R7IX2R44X2I3R8I2XR43X3IR11IXR42X3I2R11IXR42X2I2R12IXR42X2IR12I2XR42GXIR12IX2R41W2XI2R10I2X2R41W2XIR10I2X2R42W2XIR9I2X3R42W2XI2R6I3X2R44W2X2I8X3R46GX13R49X6R1411'],
      [3,'battlegrounds','R1339Q11R49QX9QR49QXZX5ZXQR49QX2I5X2QR43Q7X4IX4Q8R36QX2IX4ZX2IX2ZX7IQR36QX2I5X3IX4I3X3IQR36QX6IX3I3X4IX2I2QR36QX2ZX9IX4IX4QR36QX10SX2ZX8QR36QXIX2I8X3I4X3QR36QXIXZX4IDX8IX3QR36QXIX3ZX2D2WI3X4IX3QR36QXI2X3I2D4IX6ZX2QR36QX10D2IX9QR36Q24R1343'],
      [1,'battlegrounds','R678I10R50IX2IX5IR50IX4I2XQIR50IX3I2WX2IR50IXWXIX4IR50IX3IXWX2IR50IXQX6IR12I7R31I4XI5R12IX5IR34X4R15IQXWX2IR31X4R2X4R2X5R5IX3IXIR31XR2X4R2X4R3X4RX3IWX2IR31XR8XR8X4IX2WIXIR31XR4I4ZI4R5XR2IX3QXIR31XR4IX7IR5XR2I7R31XR4IXIX5IR5XR40XR4IXIX3IXIR4X2R38X7ZXIXSXIXZX6R38XR6IX5IXIR5XR38XR6IX7IR5XI4R34XR6I5ZI3R5XIQXIR34XR11XR8X3I2R34X7R5X10IXWIR34XR5XR14XI4R30I4XI3R2XR14XR34IQIX4IR2XR3I6R5XR34IX6IR2X9IR3X3R34IXWXWXQIX3R3IQXIX6R36IX4IXIR6IXW2XIR40I8R6I6R1228'],
      [2,'battlegrounds','R1090XR2X2R55XR2X3R3XR46X4IXRX3RXRX2R42X2RX4IXRXIX6R41X6I3XRX4IXIX3R39X2I2X17R39XIXIX2IX6I2X2IXIX2R38X2IX3IX6IXI2XIX4W5R31X3IX6IXI2X12G3R31SXIX7IX4I2X2IX5G4R31X7IX6IXIXIX5PG2FGR31X3IXIX3IX2IX12G4R31X7IX4IX3I2XIXRX3G4R32X8IX9IXRX2W5R33X5RX6IX6R44X2RXR2XRX7R45X2RXR4X3RXRXR52X2RXRXRXR53XR3XR55XR3XR59XR1301'],
      [2,'battlegrounds','R1041X19R41XWX15WXR41X3IX11IX3R41X2IR6ZR6IX2R41X3RX2IX8RX3R41X3RXWX6IWXRX3R41X3RX2R7X2RX3R41I2XRX2RX3GWRX2RI2XR41X3RXIRXRGRXRXIRX3R40FXWXRX2ZXRSRXZX2RXWXFR40X3RIXRXRGRXRIXRX3R41XI2RX2RWGX3RX2RXI2R41X3RX2R7X2RX3R41X3RXWIX6WXRX3R41X3RX8IX2RX3R41X2IR6ZR6IX2R41X3IX11IX3R41XWX15WXR41X19R1460'],
    ];
    if (level > levels.length || level < 1) level = 1;
    super([levels[level-1]], Math.floor(level/20)*5);
    this.debug = confirm('Enable Debug for this level?');
    this.spawns = []; // end goals, reused variable from duels
  }

  ontick() { // maybe code an onmove?
    // add gamemode type if statmenets
    for (const goal of this.spawns) if (Engine.collision(this.pt[0].x, this.pt[0].y, 80, 80, goal.x*100, goal.y*100, 100, 100)) this.victory();
  }

  victory() {
    setTimeout(() => {
      PixelTanks.user.player.implode();
      Menus.menus.victory.stats = {kills: 'n/a', coins: 'n/a'};
      Menus.trigger('victory');
    }, 3000);
  }

  ondeath(t, m) {
    super.ondeath(t, m);
    if (t.username !== PixelTanks.user.username) {
      let e = 0;
      for (const ai of this.ai) if (Engine.getTeam(ai.team) === 'squad') e++;
      if (e === 1) this.victory();
      return PixelTanks.user.player.killRewards();
    }
    setTimeout(() => {
      PixelTanks.user.player.implode();
      Menus.menus.defeat.stats = {kills: 'n/a', coins: 'n/a'};
      Menus.trigger('defeat');
    }, 5000);
  }

  override(data) {
    PixelTanks.user.player.tank.x = data.x;
    PixelTanks.user.player.tank.y = data.y;
    if (PixelTanks.user.player.dx) {
      PixelTanks.user.player.dx.t = Date.now()
      PixelTanks.user.player.dx.o = PixelTanks.user.player.tank.x;
    }
    if (PixelTanks.user.player.dy) {
      PixelTanks.user.player.dy.t = Date.now();
      PixelTanks.user.player.dy.o = PixelTanks.user.player.tank.y;
    }
  }
}
