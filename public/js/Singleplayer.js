class Singleplayer extends Engine {
  constructor(level) {
    const levels = [
      [2,'battlegrounds','R1229IR60IR54IRI5R58IR4I9R45IR3I3X7I2R48IXGX8I2R46I2X11IGIGIR40I3X16GR40IZX3I6GX5FXIR40IX4IG4I2X7GR39I2X4IGXDGI6GIGIR38I2X5G2X2GR48IX6IG4R48IZX4I2R52IX4I2R41IR11IX3ZIR43IR6Z4IX4IR38IRI5R5ZPXZI2ZX2IR43IR6ZX2Z3X2I2R42IR7Z4I2X2IR40I3R11I2X3IR38I3XI6R4I3X4IR38IX2QX5I6ZX4I2R38IQX2SX5QX8I2R39IX15ZXI2R3IR36I3QX3QX7QI3R3I3R37I9XZX2I2R4IRIRIR44I3QI2R7IR48Q4R7IR48QXWQR56QX2QR7IR48Q4R513'],
      [1,'battlegrounds','R1219I17R43IX15IR43IX4GX5GX4IR38I6X4GX5GX4I6R33IX8R3IXIR3X8IR33IX2WXIX3RI3ZI3RX3IXWX2IR33IX4IX3RIX5IRX3IX4IR33IX4IX3I2X5I2XG2IX4IR33IX4IX4ZX2DX2ZX4IX4IR33IX4IG2XI2X5I2X3IX4IR33IX4IX3RIX5IRX3IX4IR33IX8RI3ZI3RX3IX4IR33I6X3R3IXIR3X8IR38IX3GX11I6R38IX3GX3SX3GX3IR43IX11GX3IR43I17R1404'],
      [3,'battlegrounds','R1099X2QXWX5R50XI5XR2XR50XI5XR2PR50X5ZXR53X3QX4R52X6Q2XR51GXIXI2X3QR50X2IXSX2IX2R50XGIX4IX2R50X4I2XIXQR51X3ZQX4R52X2ZQX4R53X7R50XR2XI5XR50XR2XI5PR50XWX4QX3R1591'],
      [2,'battlegrounds','R1225Q2R58Q2R57Q4R55Q5R52QR2TX4RQR49Q2RX6TQRQR47Q2X9Q2R47TX10RQR43Q2RQX6IX7R42Q3RX4IX8ZX2WR38X13IX4ZX3R38XSX2IX2IX7IXRZX2R40QRQIX13ZXWR41Q3X3IX4IX4RQR44QX6IX5RQ2R45X10TQ2R48TX7QRQ2R48Q2X2TX3Q2R52X2RX3Q3R50Q6RQRQR52QRQR2QRQR54QR2QR1111'],
      [3,'battlegrounds','R1575I21R39IWX13WX4IR39IXIX6ZX4G4X2IR39IXZI3QX2ZX7GX2IR39IX2IX11Q2GX2IR39IX2IXI2ZX12IR39IX3QIX2IDI3X7IR39IX2QX4I3DIX2IX2QXIR39IX13I2SIX2IR39IX3GX4ZX7IX2IR39IX2G2X4ZQXQX2I3X2IR39IXG2X14IXIR39IX5WX10ZX2IR39I21R1224'],
      [2,'battlegrounds','R1611G2R10I7R41G3R9IX5IR36G9R8IX2SX2IRX6TIX2R2XR6PR4Q2X4TIXWXG10R7I2X3I2X19GX2Z3Q2X14FG5R6X29Z3XQX9G10R7X12Z3X2GX15QR2X4RWXG9R11XRX2GXTR3Z2X2PXR5X8R6X5R5G3R18IR17XTIR18G2R1507'],
      [1,'battlegrounds','R860I17R43IX15IR42I2XI4X5I4XI2R41IWX4IXZ3XIX4WIR41IX4GX3ZX3GX4IR41IX3IX4ZX4IX3IR41IXZXIX2I5X2IXZXIR41IXZXIXZX5ZXIXZXIR41IXZXIXI2X3I2XIXZXIR41IDX2IX9IX2DIR41I5X9I5R43IX13IR45I2X6QX4I2R46I5X3I5R51IXQZIR56X3IR55IX3R57X3R57ZXQR57X3R57XPDR57X3R57QXZR56IXZXR57X3R57X3IR55IXQXIR55IQXQIR52I4X3I4R49IX9IR49IX7SXIR49IX9IR49I11R806'],
      [1,'battlegrounds','R1157G12R48GXCX8G6R43GXI5XI2X5PGR43GX5IX2I7GR43GI4XI2X3IX3IGR43GX2PIX4IX3IXIGR43GXI3XI2XI4CXIGR43GX5IX5I2XIGR43GXI5X3ISIPX2GR43GX5IX3I3XI2GR43G4XPIX9GR46GXI2X3I2XI2XGR46GX10IXGR46GIXIXI5XIXGR46GCXIX3IPX4GR46GXI4XI3XI2GR46GPX6ICX3GR46G14R1406'],
      [3,'battlegrounds','R1157X17R43XI3XI6XI4XR43XI15XR40X16G2X2R40XI2XI2XQX8GX3R40X5IX9G2X3R43X2I2X2I2XI2XGX4R43DX2IX2IX3IX5PR43DX3QXIXSXIX2QX2DR43DWX4IX3IX4QDR43X6I2XI2XQX4R43X20R40X2G2X3QX5I2X2I2XR40X20R40XI15XR43XI4XI6XI3XR43X17R1466'],
      [2,'battlegrounds','R1039X3R53X10R47X6ZX12R41QX3QX11Q2XR41QX19R40X3I10GI2X4R39Q2X2IX11IX2QXR38Z2X3IX9WXIXQX3R37ZX4IX2I7X2IX5R36XZX4IX2IX3WXIX2IX3Q2XR35XZ2X3IX2IXIGIXIX2IX5R36X2ZX3IWXIXIFIXGX2IX2ZX2R37X2QX2IX2IXI3WIX2IXZ2X2R37X5IX2GXWX3IX2IXZX3R37X2QX2IX2I7X2IX5R38X4IXWX9IX4R39XQX2IX8WX2IX4R39XQX2I4GI8X4R39X2ZX16QXR39X19QXR40X4Z2X3SX3Z2XQXZXR40X2Z3QX7ZX4ZR43X13RXR48X4R57XR1121'],
      [3,'battlegrounds','R1276X17R43XR6XGXR6XR43XR5X2GX2R5XR43XR4X7R4XR43XR3IX7IR3XR43XR2X2IX5IX2R2XR43XRX13RXR43X5DXQXQXDX5R43XG2XDWDZSZDWDXG2XR43X5DXQXQXDX5R43XRX13RXR43XR2X2IX5IX2R2XR43XR3IX7IR3XR43XR4X7R4XR43XR5X2GX2R5XR43XR6XGXR6XR43X17R1347'],
      [1,'battlegrounds','R1395P2X8R3PR50XIX2IXR3PR50XIX2IXR3XR50XI4XR3XR46X14R46XI3XIXI2XI3XR46XIX3ISXIX3IXR46XIX3IX2IX3IXR46XI3XI2XIXI3XR46X14R46XR3XI4XR50XR3XIX2IXR50PR3XIX2IXR50PR3X8P2R1411'],
      [2,'battlegrounds','R1163X9R48X2QX6WX4R43X7R7WX3R39X8QXR9X3R37X8R13X3R35X3WR18QXQR35QXQR7XQX5R6X2R34X4R5X10R5X2R34X3R5X5R3GQX2R4X3R33X3R5XQXR3G3RX2R5X2R33X3R4X3R4XFGRX3R4QXR33X2QR4X2R3QX2G2R2X2R4X2R33QX2R4X2R3X2R3X3QR5XQR32X3R4QXR3XWRX2WX3R5X2R33X3R3X2R3XWX2QX2R6X3R33X3R4XWR14X3R34X3R4X2QR11XQX2R36XSXR4X4R7X5R37X3R5XWX2WXQX6QR39X2R7QX7R1289'],
      [1,'battlegrounds','R1284P3R55X2W3X2R53XGD3GXR52X2IG3IX2R51X9R45X10SX10R39X21R39XR2GX13GR2XR39XR2G2X11G2R2XR39XR2G3X9G3R2XR39XR3GRXG3XG3XRGR3XR39X3R3X3GXGX3R3X3R39X21R39X2R17X2R39X4R13X4R39X21R39X8GX3GX8R42X5GX3GX5R49X7R1231'],
      [3,'battlegrounds','R1229X8R49X4I5X2R47X3I4R3I2XSR45X3I2R7IX2R44X2I3R8I2XR43X3IR11IXR42X3I2R11IXR42X2I2R12IXR42X2IR12I2XR42GXIR12IX2R41W2XI2R10I2X2R41W2XIR10I2X2R42W2XIR9I2X3R42W2XI2R6I3X2R44W2X2I8X3R46GX13R49X6R1411'],
      [3,'battlegrounds','R1339Q11R49QX9QR49QXVX5VXQR49QX2I5X2QR43Q7X4IX4Q8R36QX2IX4VX2IX2VX7IQR36QX2I5X3IX4I3X3IQR36QX6IX3I3X4IXVI2QR36QX2VX9IX4IX4QR36QX7VX2SX2VX8QR36QXIX2I8X3I4X3QR36QXIXVX4IDX8IX3QR36QXIX3VX2D2WI3X4IX3QR36QXI2X3I2D4IXVX4VX2QR36QX10D2IX9QR36Q24R1343'],
      [1,'battlegrounds','R678I10R50IX2IX5IR50IX4I2XQIR50IX3I2WX2IR50IXWXIX4IR50IX3IXWX2IR50IXQX6IR12I7R31I4XI5R12IX5IR34X4R15IQXWX2IR31X4R2X4R2X5R5IX3IXIR31XR2X4R2X4R3X4RX3IWX2IR31XR8XR8X4IX2WIXIR31XR4I4ZI4R5XR2IX3QXIR31XR4IX7IR5XR2I7R31XR4IXIX5IR5XR40XR4IXIX3IXIR4X2R38X7ZXIXSXIXZX6R38XR6IX5IXIR5XR38XR6IX7IR5XI4R34XR6I5ZI3R5XIQXIR34XR11XR8X3I2R34X7R5X10IXWIR34XR5XR14XI4R30I4XI3R2XR14XR34IQIX4IR2XR3I6R5XR34IX6IR2X9IR3X3R34IXWXWXQIX3R3IQXIX6R36IX4IXIR6IXW2XIR40I8R6I6R1228'],
      [2,'battlegrounds','R1090XR2X2R55XR2X3R3XR46X4IXRX3RXRX2R42X2RX4IXRXIX6R41X6I3XRX4IXIX3R39X2I2X17R39XIXIX2IX6I2X2IXIX2R38X2IX3IX6IXI2XIX4W5R31X3IX6IXI2X12G3R31SXIX7IX4I2X2IX5G4R31X7IX6IXIXIX5PG2FGR31X3IXIX3IX2IX12G4R31X7IX4IX3I2XIXRX3G4R32X8IX9IXRX2W5R33X5RX6IX6R44X2RXR2XRX7R45X2RXR4X3RXRXR52X2RXRXRXR53XR3XR55XR3XR59XR1301'],
      [2,'battlegrounds','R1041X19R41XWX15WXR41X3IX11IX3R41X2IR6ZR6IX2R41X3RX2IX8RX3R41X3RXWX6IWXRX3R41X3RX2R7X2RX3R41I2XRX2RX3GWRX2RI2XR41X3RXIRXRGRXRXIRX3R40FXWXRX2ZXRSRXZX2RXWXFR40X3RIXRXRGRXRIXRX3R41XI2RX2RWGX3RX2RXI2R41X3RX2R7X2RX3R41X3RXWIX6WXRX3R41X3RX8IX2RX3R41X2IR6ZR6IX2R41X3IX11IX3R41XWX15WXR41X19R1460'],
      [1,'battlegrounds','R494I19R40IX8QXQX8IR39IX8DZPX8IR39IXZI3X3QXQX3I3ZXIR40IX3I3X5I3X3IR41IX3IX2I2XI2X2IX3IR41IX3ZX9ZX3IR41IX3ZX9ZX3IR41I2X2IX9IX2I2R42IZI6XI6XIR42I2X3IX7IX3I2R40IX5QX7QX5IR38I3Z2IXIZX5ZIXIZXI3R37IWX4I2XGX3GXI2X4WIR36I2WQXQX2GX7GX2QXQWI2R35I2X2ZX3IX3SX3IX3ZX2I2R35I2WQXQX2GX7GX2QXQWI2R36IWX4I2XGX3GXI2X4WIR37I3ZXIXIZX5ZIXIZ2I3R38IX5QX7QX5IR40I2X3IX7IX3I2R42IXI6XI6ZIR42I2X2IX9IX2I2R41IX3ZX9ZX3IR41IX3ZX9ZX3IR41IX3IX2I2XI2X2IX3IR41IX3I3X5I3X3IR40IXZI3X3QXQX3I3ZXIR39IX8PZDX8IR39IX8QXQX8IR40I19R1287'],
      [2,'ice','R1644Z3R54ZRZ9R49Z3WX3Z4R49Z2X2WX3Z3R9G6R32Z4X6Z4R6G3X3GR35Z2X3GX3Z2R6GXVX4G2R5Q2R27Z2XWGSX3Z3G5X2VXVX2G2R4QXQ3R25Z2WXGX14VXVX2G2R3QX4QR26Z2X2GX2Z3X8VXVX2G2RQ3X4Q2R24Z3X5Z2G5CX5VX2G2Q2X7QR25Z3XZ6R3G3X4VX9WX4QR22Z12R5G3X2VX2G2Q3X7QR25Z2RZ2RZ2R8G2XVXG3R2QXV5Q2R42G5R4Q2VQ3VQR52Q2VQ3VR54QVQFQVR55VQ3VR964'],
      [3,'ice','R1399X13R46XQIX2WX6IQXR45XIX11IXR45X11PX3R45XQ2XGI5GXQ2XR45X15R45X2I3XIXIXI3X2R45X2QXQXISIXQXQX2R45X2I3XIXIXI3X2R45X15R45XQ2XGI5GXQ2DR45X2PX12R45XIX11IXR45XQIX3WX5IQXR46X13R1348'],
      [3,'ice','R1241I6R53I2X4I2R52IX2I2X2IR48X6IR2IXIR46X8IR2IXIR45X6GIX2I2X2IR44X4G4I2X4I2R44X3G6I4XI2R44X3G7XZ4IR30I14X3IX5IXZ4IR30IW4GX11IX5IXZ4IR30IWXWX3GSX8IX5IXZ4IR30I14X3IX5IXZ4IR44X3G7XZ4IR45X3G5I4XI2R45X4G3I2X4I2R46X6IX2I2X2IR47X7IR2IXIR48X6IR2IXIR52IX2I2X2IR52I2X4I2R53I6R1093'],
      [1,'ice','R1704I15R44I2X12QI5R38I3X2I11X5IR35I3XIXQIR11IX3PXI2R32I2X5IR12IX2GX3IR32IXPX2PXIR11IX2PGX3IR32IX2G2X3IR10IX3GPX2IR32IX2PGX3IR10I2X5I2R32IX6IR13I2X3IR33I2X4I2R14I2XIR35I3X2IR16IQIR38IXIR16IXIR38IQIR16IXIR38IXIR16IXIR38IXIR16IXIR38IXI2R15IXIR38IX2IR15IXIR38I2XI2R13I2XIR39IX2I2R11I2X2IR39I2X2I3R4I6X2I2R40I2X3I5X6QI2R42I3X3IX7I3R45I3QX4GX4IR48I3X3GSX3IR51IX2G3X2IR51IX6I2R51I2X5IR53IX2I4R53I4R204'],
      [1,'ice','R1644X9R50X5PDCX3R46X4I9X2R45XIX5VX8R44XIXIXI8XIX2R43XIXIXIX6IXZX2R42X2IVZXIXI2ZIXIXIX2R42X2IXIXIVISXIXZXIX3R42XIXIXZXIX2IVIXIXIX2R40X2IXIXIXIZI2XIXVXIX2R40XPIXZXIX6IXIXIPR42DX2IXI8XIX2DR43X9VX6R46X2I7X3R49X4WX4R1107'],
      [2,'ice','R2925X6VX2RX2R26X5R15X4IX3VX6R3CX3WGR13XCX4ZXPR13XI2X3I2XVX7RZ2X4GXR12XI6X2R12X2I2X3I2XVX7RFGX8QXR2X2R3XI2X4IX3R4X3R4X4IX5VX4WX2RGZX7RX8RX2IX2IX3ZX2QX4QX10I2X2VX3SX3RGZX2PXGXR4X2RXRQX5I2XI2X3QRXR3X3QXI2X3I2X2VX4WX2R2XWX3GR12X2I6X3R11XI2X2IX4VX7R21X9R12CX2IX6VX6R24ZX5PR14X6R6X2R26XR96'],
      [3,'ice','R1766I3R57IXIR50X17R43XI15XR43X17R43XIX13IXR41I2XIX2G2X5G2X2IXI2R39IX2IX2G2X5G2X2IX2IR39I2XIX5W3X5IXI2R41XI2X4WSWX4I2XR43X2I2X3W3X3I2X2R44X2I2X7I2X2R46X2I2X2GX2I2X2R48X2I2X3I2X2R50X2I2XI2X2R52X2IXIX2R54X5R56IXIR57I3R751'],
      [2,'ice','R1816I11R49IXP2X2GX3I8R42IX12GXICI7R36IX6P2XSX3G7F2IR36IX6P2X5G7F2IR36IX12GXICI7R36IXP2X2GX2I9R42I10R1354'],
      [1,'ice','R1216X2DIXZR53DW2DIXZXR52DXWXIXZXR52DWX2IX4R51IGIXIX9R46X11I2XR46X2I4XGX4IXR46X4GX2GX2Z2IXR47X4IX6IXR47X4IXI3GI2X2R47ZXGIX6IX3R46XZXIXIX3CIXIXR47X4IX2SCIXIXR47X4IXC2IX4R47X2I6X2IXIR48X11IR50X4I2X2I2R52X5I2R1350'],
      [1,'ice','R1458I8R52IX3WX2IR52IX2WX3I7R46IX6ICXPX2I6R35I7GI10GIX4IR35IX5IX3GQ2GX5IX4IR35IX2WX2IXQX8QXIXWX2IR35IX2WX2IX5SX6IXWX2IR35IXWX3GX6GQ2GX2IX4IR35IX5IQ2I9QIGI4R35I7X14IR44IX14IR44I9GI6R47ICXPX3IR52I8R1291'],
      [3,'ice','R802X9R48X3CPX9R45X10PX7R39X19R40X5PX15R39X11IX10R37X4IXQX13CX2R37X6QX13PX2R37X6QX3Q6X7R37X2PX3QX11IX4R37XCX4QX17R35X7QX17R35X11ZXZX5QX5R36X2PX8SX5QX5CR36X10ZXZX3QX7R36X5IX10QX7R36X7Q4X5QX7R36X5Q2X17R37X19PX2R38X12QX9R39X2PX2IX5QXIX7R39XCX9QX8R41X10QX3CX3R43X4PX4QX4PXR45X15R46X10R54X4R1233'],
      [1,'ice','R927X2R51D2R5X2R51D2R5X2R4XR46WXR5V2R3V2R46X2R5X10R43X17R43X10I5X2R43X2I5X3I5X2VXR41X2I5X3I5X2VXR41X2I5V3I5X2R43X2I5X3I5X2R43X2I5X3I5X2R40X2VX4VX3SXI5X2R39X3VX4VX7VX5VXR40X2I6X4VX5VR41X2I6X2I6X2R42X2I6X2I6X2R42X2I6V2I6X2R42X2I6X2I6X2R42X18R42X18R48V2R3VR4D2R48X2R8D2R49XR9WR49XR9XR1222'],
      [2,'ice','R2039GR58G2R33G4R21G2R4G8R21G11R8G8X5IX2I3TXPX2ZX12ZXIX4TX6IPXI2XZ2X10SXIXGX7PXIVG2XPX2IX3ZCX2IVIXIXZ2X4IXPX3ZVX2IP2XZXFX5IX9IXZGX2PIX5P2X5IX2Z4X5TXZ2XI2XPXZX2R14TG2R7G8R10G10R4G4R48G4R6G2R58G2R59GR960'],
      [2,'ice','R1405I9R51IX7IR51IXWXWXWXIR50I2X7I2R46I4X4GX4I4R43IX4I2GRGQIX4IR43IX4QG5IX4IR43IX4G2RGRG2X4IR43IXWXGRG2FG2RGXWXIR43IX4G2RGRG2X4IR43IX4IG5QX4IR43IX4IQGRGI2X4IR43I4X4GX4I4R46I2XWX3WXI2R50IXWX3WXIR51IXWX3WXIR51I3Q3I3R52X7R52X4SX4R51X2I4X3R51X3I4X2R51X9R52X7R867'],
      [3,'ice','R1118I7R53W3IW3R53X7R53X7R53I2X3I2R53X7R53X7R53X7R53X2I3X2R53X7R37I16XIX3IXR37I4RCGX16R37I4CXGX3IX12R37IX2GX2GX5I4R44IX6SXI7R44I7X5GX2IR44I4X5GX5IR37X12IX3GXCI4R37GX15GCI5R37XGX2GX2I16R37XGX4GR53X7R53XWX3WXR53X7R53XGW3X2R53X3WX3R53X3G3XR53X7R878'],
      [1,'ice','R1640Q13R47Q3ZQ2I3Q4R41XR5QIX9IQR5XR34X3R4QX3IX6ZQR4X3R32WX4R5XI2X2I2X2R5X4WR30DWX7Z2X4SX4Z2X7WDR29DWX7Z2X9Z2X7WDR30WX4R5X2I2X2I2XR5X4WR32X3R4QZX6IX3QR4X3R34XR5QIX9IQR5XR41Q4I3Q2ZQ3R47Q13R1287'],
      [3,'ice','R1519X14R46XI5X2I5XR46XI2X8I2XR46XIX3IX2IX3IXR46X5IX2IXIX3R42X5IX3IX2IX2IX6R37DWGX2IX4IX2IX7GWDR36DWGSX4IX6IX5GWDR36DWGX7IX2IX4IX2GWDR37X6IX2IX2IX3IX5R42X3IXIX2IX5R46XIX3IX2IX3IXR46XI2X8I2XR46XI5X2I5XR46X14R1227'],
      [1,'ice','R1283X5R53X3GXPX2PR47X5PXQXIX4R45X2ZXZX12R43X2ZX5I3XZ2Q2X2R33I8XQ2X2I5X2QX6I8R25IX6PX4QX3QX4IGX2QXPX6IR25IX6PIX2Q2X2QXSX3IX4IPX6IR25IX6PXIX2Q2X6IXI2X3PX6IR25I7X3Z2XQ2IX4IXQ2XQZXI7R33XQX2ZX3I2X2QXQX5R41XQX2GX4IQZXQXIX2R44PX4IX2ZX2GX3R46X2QX3ZX3PX2R48X2PX3PX2R52XR1418'],
      [2,'ice','R546SR59X2R58X4R56X4R57X4GR55XIXGXR56XGX2R57X4R56CX3IR56X2I2R56X5R55XPX4R54X3P2XR55XG4X2R54X5CR54X3WX3R54X4PX2R54XWIX3GR53XIX3GX3R52X3GX4R52CXGX6R53X2WX5R52X4PX5R52X7CR54X3PX3R55X4GX3R52X3GX4IR53GX5IXR52X4WI2X2R52X4IX3R53CX3WX3CR52X11R50X3PX5GX2R50X5IXGX3R56X3IXR56XCX3R56X2WX3R56X2WXZXR56X2ZFR58X2R672'],
      [1,'ice','X3IX3IX3IX2R2XQX12R30X3IX3IX3I2XR2XIXGX2QXIX2IX2R30X3IX3IX3IX2R2QIXGXQ2X2IZI2XR30I2ZI3ZI3ZIXIR2XIXG2XQXZX5R30X14R2XIX5Z2X2QX2R30XI2XWZ6X2WR2QIX4Z2X6R30X2IX2Z6X3R2XIXI2XZX2I2X3R30XI2X2ZXZXZ2XQXR2XIX3ZX4IX3R30X2IX7WXQXR2QIPXZ2X7QR30X2IX5WX3QXR2XIPZ2I2X2G3XQR30XI2X3QXQX5R2XIXZI3X4GX2R30X4IXQXQ2X4R2X6PX7R30X4IXIX2QX9I10XR30X4IX2IX13QX2QX2QXQR42X2SX3R54X6R42Z2IZX26R30IQ2GX15I2X3QX3IXR30IZIZX4I2XIX2R2X3I2ZX8R30ZQI2X2PXQ2IQIXR2X5Z3XWX4R30IZ2IX4IQ3IXR2Q2X6Z4X2R30Z2I2X3PXI3X2R2XQ2X4WX3ZX2R30IQIQX10R2X5WX8R30Z3GX6PX3R9XWX5R30ZI7X6R2X8IXIXIQR30ZQ2ZGZ2IZ6R2XZXZ2XZXI5XR30I2Q2Z2QIQZ5R2XZXZX2Z2IX3IXR30ZGZQZQZIQZ2GQZR2X2Z3XZ2IX3IXR30Z5IZIZQ2Z3R2X2ZX2ZXZQX3IXR30Q2Z2QIZ6QZR2X2ZX5I5XR1830'],
      [2,'cave','R874I4Q2I2R52IX6IR52IX6IR52IX6IR52IX6IR52IXI3QI2R52IXQR55I3XI6R44I5RQXW2X4GIR44IX3IRIXWXI4GQR44IX3IRIXI3R2IXQR44IQIXIQIGIR3I2XQI3R33I7R3IX5IR3IX5IR33IX5IR3IX5IR3IX5IR33IX5I5XWX3IR3QX2Z3IR33IX2SX3Q2XQX5IR3IX2ZFZQR33IX5I5X5IR3IX2Z3IR33IX5IR3I3QIGQR3I2XI2QIR33I7R5I3GI2QR2IXIR47I2X5IQI2XIR47IX3WX3GX3IR47IX2WXWX2I2Q3R47QX7IR51I5Q2I2R1342'],
      [3,'cave','R1886I13R47IX9QXIR47IX3DC3DXQXIR47IX3WDWDWXQXIR47IXI2QICIXI2XIR47IX3QISIQX3IR47IXI2XI3QI2XIR47IXQX9IR47IXQX9IR47IXQX9IR47I13R1101'],
      [1,'cave','R1463X4R55XZX2ZXR54XZX2ZXR54XI4XR54X6R54XZX2ZXR53X3G2X3R36WQPQWQPQWQPQWQPQX4SX3R52X3G2X3R53XZX2ZXR54X6R54XI4XR54XZX2ZXR54XZX2ZXR55X4R1293'],
      [2,'cave','R1584I7R52I2R5I2R49I3R2G3R2I3R45I3R3G5R3I3R43IR3ZRG2FG2RZR3IR43IRQRZRWIGIWRZRQRIR43IRQRZRG2WG2RZRQRIR43IRQRZRWIGIWRZRQRIR43IRQRZRG2WG2RZRQRIR43IRQRZRGWGWGRZRQRIR43IRQRZRIZIZIRZRQRIR43IRQRZRQZ3QRZRQRIR43IR3ZRQXSXQRZR3IR43I3R3Q5R3I3R45I3R2Q3R2I4R48I2R5I2R52I7R1049'],
      [1,'cave','R1769XPDPXR55XDWDXR55XPDPXR55X5R55I2XI2R54IX5IR51I2XGX5I2R48IX3GX3ZX3IR45I2X8G2ZX2I2R42IX5ZGX10IR39I2X2I3X3I3X3I3X2I2R36IX3I4X3ZX2GX2I4X3IR34IX12SX12IR34I25R1036'],
      [3,'cave','R1885Q10R50Q10R50Q10R50Q3I4Q3R50Q3IR2IQ3R50Q3I4Q3R44X3Z3X10Z3X3R38X3Z3XSX8Z3X3R38X3Z3X10Z3X3R38X3I3X3I4X3I3X3R38X3IRIX3IR2IX3IRIX3R38X3IRIX3IR2IX3IRIX3R38X3I3X3I4X3I3X3R38X3Z3X7D3Z3X3R38X3Z3X7DWDZ3X3R38X3Z3X7D3Z3X3R44Q3I4Q3R50Q3IR2IQ3R50Q3I4Q3R50Q10R50Q10R50Q10R445'],
      [3,'cave','R682X10R48X6WX6R46X18R39X5GX11GX5R34X9R9X9R32X9R13X7R30X3GX2R17X8R29X5R21X6R26X5R23X3GX2R26X5R25X5R24X3GXR27X4R23X6R27X5R22X5R29X4R22X5R29X2GX2R21X4R30X4R21X5R30X5R20X4R31X4R21X2GXR31X4R21X4R31XDX2R21X4R31XDWXR21X2GXR31X4R21X4R31X4R21X4R31X2GXR22X4R30X3R23X4R29X4R23X2DXR28X5R23XDWX2R26X6R23X6R23X7R25X2GX3R18X6GX4R26X7R15X11R27X9R7X10GX4R30X17DX12R31X5GX10WDX6R38X7SX2GX8R43X11R874'],
      [2,'cave','R1471I9R44I8X7IR38I7X3W2XIX4IFXIR33I6X2WX2IX3IXWIX4I2XIR29I5X2WXIX2IWXIX3I2WIV4X3IR26I4X2WIXIXWIX2I2WIX6IQ3VX3IR26IXSIXIXIXI2XIX5IX6IV2QVX3IR26IX2G2X2G2X3G2X4G2X5G2VQVX3IR26I34R1640'],
      [2,'cave','R1157FICIX5PXCIX2CR44XIXIXI8PI2R44XIXIX4PX3IX3R44XIXI6XI5XR44XIX3PX8IXR44XIXI10XIXR44XPXIX4CIX2PXIXR44I4XI8XIXR44X2CIXICX2PX2IX3R44XI3XI4XI5XR44XIX2PX9IXR44XIXI10XIPR44X3ICPX6IX3R44XIXI3XI4XI4R44XIX5IX3PX3CR1587'],
      [1,'cave','R1461X2QX3CX3QX2R43X5IXI7XIX5R39XI3XIQX3CX3QIXI3XR39WXQX2IXI7XIX2QX2R39WIXIQXQXVXCXVXQXQIXIWR39WIXIXI3XIXIXI3XIXIWR39WIXIX4ZISIZX4IXIWR39WIXIXI3XIXIXI3XIXIWR39WIXIQXQXVXCXVXQXQIXIWR39X2QX2IXI7XIX2QXWR39XI3XIQX3CX3QIXI3XR39X5IXI7XIX5R43X2QX3CX3QX2R1406'],
      [3,'cave','R1931I17R43IXGXD6WD5IR43IXIXI13R43IXIX3QX9IR43IXIQIXI7GIXIR43IXIXIX7GXIXIR43IXIXIX7IXIXIR43IXIXIX7IXIXIR43IXIXIX3SX3IXIXIR43IXIXIX7IXIXIR43IXIXIX7IXIXIR43IXIXGX7IXIXIR43IXIXI7GIXIXIR43IXGX11IXIR43IXI11GIXIR43IX15IR43I17R692'],
      [1,'cave','R2478X8R52XI2X2I2XR47X2R3X8R3X2R40X6R2X6R2X6R36W2X7GX6GX7W2R32CWXWXI4X2GXISXIXGX2I4XWXWCR32W2X7GX6GX7W2R36X6R2X6R2X6R40X2R3X2IX2IX2R3X2R47X2IX2IX2R52X8R514'],
      [1,'cave','R1638I7R53IWIWIWIR51I3QIQIQI3R49IWQX5QWIR49I3XZQZXI3R49IWQZSXWZQWIR49I3XZQZXI3R49IWQX5QWIR49I3QIQIQI3R51IWIWIWIR53I7R1355'],
      [2,'cave','R1403X8R50X12R47X2IX2I5X2D2XR44X3IX3DX5ID2XR43XI3XP2XPX4IX3R43X6R4X3I3XR43X2IX2RG4X7R43X2IX2RGR3X3IX3R43X2IX2RGRFGRX2IXPXR43X2IX2RGR2GRX2IXPXR43X2IX2RG4RX2IDX2R43X5SR4X4PXR44X2I3X6I3XR46X3IX6IX3R47X2IXI3X2IX2R49X10R52X5R1231'],
      [1,'cave','R1698I19R41IX17IR41IXI2XIXI2XI2XIXI2XIR41IX2PX14IR41IXIDIXI2XIXI2XIDIXIR41IXIDX2IX5IX2DIXIR41IXIWIXIXISIXIXIDIXIR41IXIDIXIXIXIXIXIWIXIR41IXIDX2IX5IX2DIXIR41IXIDIXI2XIXI2XIDIXIR41IX14PX2IR41IXI2XIXI2XI2XIXI2XIR41IX17IR41I19R1103'],
      [1,'cave','R1484X3IX3IX3IXR47XIXIXIXIXIXIXR47XIXIXIXIXIXIXR47XIXIXIXIXIXIXR47X13R3W5X11ZX11G2X10ZX4IXIXIXIXIXIXR3W4X3QSX36IX3IX3IX3R3W5X6QX2QX4Z2X4GX9GX6QX2IXIXIXIXIXIXR47X13R47XIXIXIXIXIXIXR47XIXIXIXIXIXIXR47XIXIXIXIXIXIXR47X3IX3IX3IXR1383'],
      [1,'cave','R1453X14Q2X2Q2X4Q2X2Q2X2Q2X3WX6R16X6WX7Q2X2Q2X2WXQ2X2Q2X2Q2X10R16X2Q6X2Q2X2Q2X4Q4X2Q2X10Q4X2R16X2Q6X2Q2XWQ2X4Q4X2Q2X8WXQ4X2R16X4Q4X2Q4X2Q2X2Q2X6WXWXQ2X6Q2X2R16X4Q4X2Q4X2Q2X2Q2X10Q2X6Q2X2R16X2Q6X2Q2X2Q2XWX2Q2X4Q2X4Q2X4Q6R16X2Q6X2Q2X2Q2X4Q2XW2XQ2X4Q2XWX2Q6R16X2Q4X4WX2WQ2X2Q2X6Q2X2WXQ2X10R16SXQ4X8Q2X2Q2X6Q2X4Q2X6WX3R1563'],
      [1,'cave','R2654I9R51ITX2TX2TIR46I6X4W3IR46IX4QX4WQGIR46ISX3QX4WGFIR46IX4QX4WQGIR46I6X4W3IR51ITX2TX2TIR51I9R457'],
      [1,'cave','R1344X8R52XR6XR52W4P4R51XW4P4R50X10R49IXI2QX6R49X4IXZXZ2XR49XI2XIXZX2ZXR49XI2XIXZ2XZX9R41X4IX6QIXZQXRXR41I2XIQX6IX2QZXRXR40X12IXZX3RXR40XRX10IX3RXRXR40XRXQI3QIX2IQI3QXRXR40XRXIX3IX10RXR40XRX3ZXIXZX8RXR40XRXZQX2IXZ2XQI3XIRXR40XRXQ2XIQXZX2IX7R40X12IXIX3R49IXG2X6R50IX4IX2SR52XR6XR52X8R924'],
      [1,'cave','R384IR58IXIR56IGXGIR43IR10IXZ3XIR10IR30IXIR8IX2WXWX2IR8IXIR28IXZXIR8IXZXZXIR8IXZXIR25I2XIGIXI2R7IGXGIR7I2XIZIXI2R22IX4ZX4IR6IX3IR6IX4ZX4IR21IX2WX3WX2IR6IX3IR6IX2WX3WX2IR22I4XI4R3I5ZXZI5R3I4XI4R25I2XI3RI3X5IXIX5I3RI3XI2R26IX6IX19IX6IR24IXIXZXIXIX4I5GI5X4IXIXZXIXIR22IWXZIXIZXIX3I2ZX7ZI2X3IXZIXIZXWIR20IX13GX2Q2XSXQ2X2GX13IR20IWXZIXIZX5GX2Q2X3Q2X2GX5ZIXIZXWIR22IXIXZXIXIX3I2ZX7ZI2X3IXIXZXIXIR24IX6IX4I5GI5X4IX6IR26I7X19I7R33I4X5IXIX5I4R42IXI3X2ZX2I3XIR45IXIX2IX3IX2IXIR45IXZX2ZX3ZX2ZXIR45IXIX2IX3IX2IXIR45IXI3X2ZX2I3XIR45IX6QX6IR45IX2I2X2ZX2IRX2IR45IX2IRX5RIX2IR45IX2IRI2XIR2IX2IR45IG2I3GXGI3G2IR45IX13IR45IXWXW2GXGW2XWXIR46I13R1289'],
      [1,'deep','R1401I21R39IX2PX13PX2IR39IXQ3XQ2XQXQXQ2XQ3XIR39IPQ3XQ2XQXQXQ2XQ3PIR39IXQ3XQ2XQXQXQ2XQ3XIR39IX4QX2QXQXQX2QX4IR39IXQ3XZ2XZXZXZ2XQ3XIR39IXQ3XZ2XZXZXZ2XQ3XIR39IX4QX2QXQXQX2QX4IR39IXQ3XZ2XGXGXZ2XQ3XIR39IX4QX2QXSXQX2QX4IR39IXQ3XZ2XGXGXZ2XQ3XIR39IX4QX2QXQXQX2QX4IR39IXQ3XZ2XIXZXZ2XQ3XIR39IXQ3XZ2XZXZXZ2XQ3XIR39IX4QX2QXQXQX2QX4IR39IXQ3XQ2XQXQXQ2XQ3XIR39IPQ3XQ2XQXQXQ2XQ3PIR39IXQ3XQ2XQXQXQ2XQ3XIR39IPXPX13PX2IR39I21R978'],
      [3,'deep','R1290WR59XR52X3R4XR48WX4RXR4X2R53XR5XR53XR5XR52X5R2XR43WX5R3XIQZVX5R3WXR41XR3XIQ2XI2QIXR4XR41X5VI2XIQ3XR4XR41XI2XIQI2XQ2VIX6R36X6Z2XIQI2XIQIZXR41WR4X3VX3IX4VXR43X4I2XI2X3R48XVIXQ2SQ2XR50XI2XI2XI2X6R45XQ2X3VX3R4XR41X5I2XZIXR7XR41WR3XI2XVIXR2X3R2WR45XVX5R2XRXR50XR3XR2XRXR50XR3X4RXR46WR3XR8WR46X5R940'],
      [2,'deep','R2182IX3IR3IX3IR47IWX2I5X2WIR41I7WX2IX3IX2WI7R35FGQ5WCXG2SG2XCWQ5GFR35I7WX2IX3IX2WI7R41IWX2I5X2WIR47IX3IR3IX3IR1045'],
      [3,'deep','R1221I9R51IXWDWDWXIR51IXWDWDWXIR51IX7IR51I4XI4R54IXIR57IXIR55I3XI3R53IX2SX2IR53IXI3XIR53IXIRIXIR53IXI3XIR53IX5IR53I3XI3R55X3R56XGX3R54X4GX2R52X2GX4GXR50GX4GX4GR48X3GX4GX4R46Q2I2Q2I3Q2I2Q2R46Q13R48Q2IQ2IQ2IQ2R50Q9R52QI2QI2QR51Z3Q5Z3R49Z4Q3Z4R49Z5QZ5R749'],
      [2,'deep','R869I7R53IX5IR35I7R11IXG2X2IR35IX5IR10XQX3PXIR35IX2PX2IR8X3QX2GXPIR35IPGX3QX5VX4RIX4PIR35IX2G2XQX5VX3R2I4Q2IR35IX5IR15X2R36I2Q2I3R16X2R37X2R19X2R37X2R19X2R37X2R20X2R36X3R10I7R2XVR37X2R10IX5IR2VXR37X4R8QX5IR2X2R38X5R4X2QX2SX2IR2X2R40X6WX2IX5IR2X2R41X5WXRIX5IR2X2R33I7R9I9Q2I3R30IX5IR16IX5IR30IXGX3IR16IX5IR30IX2FX4R11X4QX2GX2IR30IX3GX7R5X6QPG2XPIR30IX13VX6R2IX2P2XIR30I6R4X3VX4R5I7R1280'],
      [1,'deep','R1219I19R41IX17IR41IXP2X4I3X4W2XIR41IXPX13WXIR41IX3G11X3IR41IX3GZ9GX3IR41IX3GZQ7ZGX3IR41IX3GZQZ5QZGX3IR41IXIXGZQZQ3ZQZGXIXIR41IXIXGZQZQSQZQZGXIXIR41IXIXGZQZQ3ZQZGXIXIR41IX3GZQZ5QZGX3IR41IX3GZQ7ZGX3IR41IX3GZ9GX3IR41IX3G11X3IR41IXWX13PXIR41IX2WX4I3X4P2XIR41IX17IR41I19R1282'],
      [3,'deep','R1535I4R56IC2I8R49IC2IX6IR31X7R11IX2IXI4XIR31XIX3IXR11IX4IC2IXI2R30X2I3X2R11IXIX2IC2IX2IR30X2W4XV11X2IX2IX2I2XIR30X2W4XV11XQSX8IR30X2W4XV11X2IX2IX2I2XIR30X2I3X2R11IXIX2IC2IX2IR30XIX3IXR11IX4IC2IXI2R30X7R11IX2IXI4XIR49IC2IX6IR49IC2I8R49I4R1221'],
      [1,'deep','R925I3R55I3XIR55IX3I2R53I2X2IXI2R52IX6IR51I2XI4XIR50I2X3Z2X2I2R49IX4ZX4IR48I3X2ZX5I2R40XR6IXIX2QXI2X3IR5XR33X3R5IXIX5I2X2I2R3X4R31X3R5IXIXQ2XI2X4I2R2X2WXR30X2WXWX4GX4QX5IXGX4WX2R30X9GX4ZX2Q2XIXGX6WR30WX2WXR4I4X4QX2I3R3XWX2R31X3R5IX2IX4QX4IR4X2R40IX7G2X2I2R46I2X2IQX5I2R48I2X2IQXI4R50IX7I2R50I2XIXIXI2R52IXIXIXIR54GI3GR55XR3XR55XR3XR55XR3XR55XR3XR54W2R3W2R1051'],
      [1,'deep','G3RGR2G3RG3R5G2RGR10G3RGR24GRGR2GR4G2R5G2RGR2G3RG3RGR3GR7GR14G5R2G2R3GR6GRG2R3GR2GR3G2R2GR7GR14GRGR4GR3GR7GR2GR3GR2GR3GR11GR14GRG3R2G3RG3R5GR2GR2G3RG3RG3RGR6GRGR995GX4WX5R49XR5QR3WR49XR5QR3XR45GX3WR5QR3XR45XR3GX6Q3XR43X2WR3XR2QR2XR3GXWR41XRXQ3X4Q2XR3XRXR41XRXR3QR2XR2XR3XRXR41XRXR3QR2XR2X2GXWQXR41XRXR3QR2GR2XRXRQRXR41XQGX7R2XRXRQRXR41XRQR6SR2XRXRQRXR41WXGXWGX3GQ2XRXRQRXR43XR2XR3QR2XRXRQRXR43XR2XR3QR2XRWRQRXR43XQ2X8QXRQRXR43XR2QR6QRXRQRXR43XR2QR6QRXRQRXR43XR2QR6QRGX3WR43WX11WR1169'],
      [2,'deep','R1025X8I9R43XFX6IX7IR43X8IXQXQXQXIR43I5Z3IXQXQXQXIR43X8IXQXQXQXIR43X2Z2X4IPQXQXQXIR43X8IXQXQXQPI13R31IX6I2XQXQXQXIX3IX3IX3IR31XIX3WIXIXQXQPQXIX2WIXWXIX3IR31IX6I2XQPQXQXIX3IX3IX2WIR31X4ZX3IXQXQXQXIGI3GI3GI3R31X2WXZX3IXQXQXQXGXTX3DXDXTXIR31X8GX7GX11IR31IX7I2Z2GZ2I2GI3GI3GI3R31XIXWX3ZIXTX3TXIX3IX3IX3IR31IX7IQXQXQXQIX3IXSXIX3IR31X6WXIX7IXWXIX3IXWXIR31X2Z2X4I21R1526'],
      [2,'deep','R1277C23R37CF21CR37CFR19FCR37CFRX4GX3IX3GX4RFCR37CFRX2WXGX3IX3GX4RFCR37CFRX4GWX2IXWXGQ3XRFCR37CFRX3WIX2QIQXQIX4RFCR37CFRX2QXIX3IX3IWX3RFCR37CFRWQX2IX3IXWXIX2Q2RFCR37CFRXQ2XIX3GXQ2IXQ2XRFCR37CFRX4IX2WGX3IXWXWRFCR37CFRX4IX3GX3IX4RFCR37CFRG4I9G4RFCR37CFRXWXQGX3IF3GX4RFCR37CFRX4GXSXIF3GXWX2RFCR37CFRXWX2GX3IF3GX3WRFCR37CFR19FCR37CF21CR37C23R1220'],
      [1,'deep','R1830X30R30X4ZX2I7XIX14R30X2SXZX10IX2G2XQ8XR30X4ZX6GX3IX2G2X10R30XZ4X6GX3IX5Q2X7R30X11G2X2IX11IX2R30X6IX5GX2IX10IX3R30XIX5IX7IX8I2X4R30XIX6IX6IX8I2X2ZXR30XIX7IX5IX6Z2X4ZXR30XIX8IX4IX6Z2X4ZXR30XIXG3X5IX3IX12ZXR30XIX3G2X5IX2IX4ZX7ZXR30XIX11IXIX3ZX10R30X27G2XR30XI13XI3X9G2XR30X15IXIX12R30X15I3XI10XR30X2G2X26R30X2G2X9ZX3IX11IR30X12ZX4IX2WXW2X4IXR30X2QXQX12IX3W3X3IX2R30X2QXQX4Z2X6IX2W4X2IX3R30X2QX6Z2X6IX2W4XIX2IXR30X2QX4I2X8IX9IX2R30X2QX4I2X8IX5IX2IX2CR30X2QX3IX10IX4IX2IX2C2R30X2QX2IX8G2XIX3IX2IX2C3R30X2QX5Z5XG2XIX2IX2IX2C4R30X19IX5C5'],
      [3,'deep','R448X2RX2R53X6ZR53XZXR3X3R50X3QR5X2R24D5R4X2R2X4R2QR3X4R7X3R23D2WD2X3SX3QX13R4GXGR2X2R23D5R5X2ZX2R4X6R5X3GTX2R53GXGR2X2R26X2RXR4XRX2R5X3R2ZR8X2R27X5RZ2X11ZQX5QR4XZR28ZXRX4R3ZRXRZX3R3X7QXZR28XQXR3TR13ZR4XZX2R2XR28X3R2GXGR52X2R3X3R52ZXR3GXGR4XR2X4R13X4R24ZX3R5X2ZX2ZX3ZX2QX3ZXQR2X2RX5R23X2QRX2R2X2R9X12R3ZX2R25X7R26ZR27X3ZX2R25XQXR39X3RX6QX2RGXGRX3R35X12ZX4RX3TX3R26XZX2ZX6ZX2RXRZR2X2RX3RGXGRX2R24X8QXR17ZX2R5XR23XR28X2R4X2R53X2ZXQXR55XZXR1643'],
      [3,'deep','R1347I8R52IWD4WIR52IWQ4WIR52IXQ4XIR52IXQ4XIR42I11XQ4XIR42IX16IR42IXQ4XQ3IXQ4XIR42IXQ4XQZ2IXQZ2QXIR42IXQ4XQZ2IXQZ2QXIR42IXQ4XQ3IXI4XI6R37IX10SX10IR37I6XI4XIQ3XQ4XIR42IXQZ2QXIZ2QXQ4XIR42IXQZ2QXIZ2QXQ4XIR42IXQ4XIQ3XQ4XIR42IX16IR42IXQ4XI11R42IXQ4XIR52IXQ4XIR52IWQ4WIR52IWD2XDWIR52I8R930'],
      [1,'deep','R1830X13QX16R30X5QX3QX3QIX2IXIXGXGXC2X3R30X3CX2GZXQXIQX3QXQX2IZ2X6R30X4GXZXIZXQX2Q4X3QX2ZIGX3R30XCX3ZIQ2XQ3X5QXQ2XZX3IX2R30X9QX7QXQX4QZ2IGXR30XGXQIX3QX3IX3IX5Q3Z2X3R30X3Z2XQ3X11QX4QX2ZXR30XGX10I6X3IXQXQ2ZIXR30XZIX5IXI3X4I3X7ZX2R30X3Q2X20Q2XIZR30X2ZX2QXQX2IX8IX7QIQR30X4QX2IX2IXQ6XIX3IXQ4XR30X2QX7IXQW4QXIX7QX2R30XIQ4XQX2IXQW4QXIX6QX3R30X10IXQW4QXIX10R30XIX3QXIX2IXQW4QXIX5QXQIXR30X10IXQ6XIX3IXQX2Q2R30XIQ2XQ2X3IX8IX5QX4R30XQ2X4IX18Q2X2R30X10I3X4I3SX7QZR30XZX4QX5I6X5Q2XQX2ZR30XZIX3QX2IX11IX3QX3ZR30XZQ2X2Q2X12QX3QXQXIZR30X2Z3X2QX5IX3IQX3Q3X5R30X3IQX2Q2X3QX9QX2Z2X3R30X4ZX3Q3XQX3Q2XQ3XQZX3IXR30X2GQXIZ2X2QX2QXQX8ZX2GX2R30XCX3QXZIZIX3IXIQXIQXZIX2I3XR30X4GXQXZ2X10Z3XGX3C'],
      [2,'deep','R411I3R2XFR52IR3IRX2R52IR5X2R52IRI3RX2R52IR2I2RX2R53I2RIRX2R13W2R43X2R13W2R38I3R2X2R13W2R37IR3IRX2R13W2R37IR5X2R13X20R19IRI3RX2R13X20R19IR2I2RX2R31X2R20I2RIRX2R31X2R25X2R31X2R25X2R31X2R25X2R31X2R25X2R31X2R25X2R4W2R25X2R25X2R4W2R25X2R25X2R4W2R25X2R25X2R4W2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X2R25X2R25X2R4X22R5X2R5X22R4X22R5X2R5X22R24X2R5X2R5X2R44X2R5X2R5X2R42QRX2RQRZRX2RZRGRX2RGR40QRX2RQRZRX2RZRGRX2RGR42X2R5X2R5X2R44G2R5G2R5G2R44X16R44X16R44X16R48XR59XR59XRI4R54XIR4IR53XR5IR53XR3I2R54SR3IR119IR89'],
      [1,'deep','R1103XQX2P5X2QXR46XQ2X3G3X3Q2XR44X17R42X19R41XZ2XQ2X7Q2XZ2XR41XZ2WXQ2G2XG2Q2XWZ2XR41XZ2TX4G3X4TZ2XR41X4I2X7I2X4R41XZ2XIXZI5ZXIXZ2XR41XZ2XIXIX5IXIXZ2XR41XZ2XIX2ZIGIZX2IXZ2XR41X5IXI2XI2XIX5R41XG2TXIXGXSXGXIXTG2XR41X5IXI2XI2XIX5R41XZ2XIX2ZIGIZX2IXZ2XR41XZ2XIXIX5IXIXZ2XR41XZ2XIXZI5ZXIXZ2XR41X4I2X7I2X4R41XZ2TX4G3X4TZ2XR41XZ2WXQ2G2XG2Q2XWZ2XR41XZ2XQ2X7Q2XZ2XR41X19R42X17R44XQ2X3G3X3Q2XR46XQX2P5X2QXR1044'],
      [2,'deep','R1159IX5IX5IXWX3R42XIX2IX2IX2IX2IXWGFR42X2IX2IX2IX2IX2GX2IR42X3IX2IX2IX2IXWIX2R42XIX2IX2IX2IWXIX2IXR42X2IX2IX2IX2GXWGW2XR42IX2IX2IX2IWXIX2IX2R42XIX2IX2IWXIWXIX2IXR42X2IX2IWXGWXGX2IX2IR42X3IX2IXWIWXIX2IX2R42XIX2IWXIXWIX2IX2IXR42X2IX2GWXGX2IX2IX3R42IX2IX2IX2IX2IX2IX2R42XIX2IX2IX2IX2IX2IXR42X2GX2GX2IX2IX2IX2IR42X3IX2IX2IX2IX2IX2R42XGX2IX2IX2IX2IX2IXR42XSIX5IX5IX3R1403'],
      [3,'deep','R941I5R54I2G3IR45Q10G4IR45QR8IG4IR45QRX9G2I2R44IQIXZ7XIQIR42Q4G2XZ7XRQR41Q3R2IG2XZ7XRQR41QR3X8Z4XRQR41QRI2XQ6XZ4XRQR39Q3RIGXQ6XZ4XRQR36Q4R3W4XQ4X6RQR36QR4XW4GX2Q3XG2IR3QR34Q3RI2X2GWG2XGXQ3XG2Q5R34QR3IGXGXGX9IQIR38QRX8SGXGXGIR3QR38IQIXQ3XGXG2WGX2I2RQ3R34Q5G2XQ3X2GW4XR4QR36QR3IG2XQ4XW4R3Q4R36QRX6Q6XGIRQ3R39QRXZ4XQ6XI2RQR41QRXZ4X8R3QR41QRXZ7XG2IR2Q3R41QRXZ7XG2Q4R42IQIXZ7XIQIR44I2G2X9RQR45IG4IR8QR45IG4Q10R45IG3I2R54I5R944'],
      [1,'deep','R305I26R34IX10QX3QX9IR34IX10ZX3ZX6WDXIR34IX2WX19DXIR31I4DWX2IX2I4X3I4X2IXDWI4R28IX3DX3I3X11I3X2WX3IR28IX2WDX3I2X6ZX6I2X6IR28IXQX5I2X6ZX6I2X4QXIR28IQX2I6X6ZX6I5X2QI6R23IX4I5X2I3GXGI3X2I4X9IR23IX11GX7GX15IR23IX7QX2ZX9ZXQX12IR23IX6QX4GX7GX3QX11IR23IGI2Q3I2X3I3GSGI3X2I2Q3I2GIX4IR23IX2IX3QX4GX7GX3QX3IX2IX4IR23IX2GX4Q3X11Q2X4GX2IXZ2XIR23I4X3QX4GX7GX3QX3I4XQ2XIR26IX3I2X3I3GXGI3X2I2X3IX7IR26IX24IXG2X4IR26IX12ZX11IXG2X4IR26IX12ZX11IXG2X2QXIR26I8X4I3X4I7XWX5IR34I4R2IX11WX6IR40IX6ZQX2D2X6IR40IX6ZQXWDXQX3QXIR40IX18IR40I20R1701'],
    ];
    if (level > levels.length || level < 1) level = 1;
    super([levels[level-1]], Math.floor((level-1)/20)*5);
    if (levels[level-1][0] === 3) {
      this.survivalTimeout = setTimeout(() => this.victory(), 60000);
      this.startTime = Date.now();
    }
    if (levels[level-1][0] === 1) {
      let ez = 0;
      for (const ai of this.ai) if (ai.role !== 0) ez++;
      this.global = ez+' Enemies remaining!';
    }

  ontick() { // maybe code an onmove?
    if (this.survivalTimeout) {
      const time = 60-Math.floor((Date.now()-this.startTime)/1000);
      this.global = time <= 0 ? 'Survived!' : 'Survive for '+time+' second'+(time !== 1 ? 's' : '')+'!';
    }
    if (!this.victoryTimeout) for (const goal of this.spawns) if (Engine.collision(this.pt[0].x, this.pt[0].y, 80, 80, goal.x, goal.y, 100, 100)) this.victory();
  }

  victory() {
    clearTimeout(this.survivalTimeout);
    this.victoryTimeout = setTimeout(() => {
      //PixelTanks.user.player.implode();
      Menus.menus.victory.stats = {kills: 'n/a', coins: 'n/a'};
      Menus.softTrigger('victory');
    }, 3000);
  }

  ondeath(t, m) {
    super.ondeath(t, m);
    if (t.username !== PixelTanks.user.username) {
      let e = 0;
      for (const ai of this.ai) if (Engine.getTeam(ai.team) === 'squad' && !ai.ded) e++;
      if (e === 0 && !this.victoryTimeout) {
        if (levels[level-1][0] === 1) this.global = 'All enemies defeated!';
        this.victory();
      }
      if (levels[level-1][0] === 1) this.global = e+' Enemies remaining!';
      return PixelTanks.user.player.killRewards();
    }
    setTimeout(() => {
      //PixelTanks.user.player.implode();
      Menus.menus.defeat.stats = {kills: 'n/a', coins: 'n/a'};
      Menus.softTrigger('defeat');
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
