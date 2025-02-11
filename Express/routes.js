const{Router} = require("express");
const controller = require(`./controller`);


const router = Router();

// User routes
//router.get("/users", controller.getusers);
//router.post("/register", controller.adduser); // i switched from user to /register so that the frontend stays the same
//router.get("/users/:userNr", controller.getuserbyNr);
//router.post("/login", controller.loginUser);
//router.delete("/users/:userNr", controller.deleteUser);

// Item routes
router.get("/items", controller.getItems);
router.get("/items/:itemsnr", controller.getitembyNr);

// items trends
router.get("/trends", controller.getmostViewdItems);
router.get("/account/:userId", controller.getShopCart);
router.get("/account/getFullPrice/:userId", controller.getCartFullPrice);
router.post("/account", controller.addToCart);
router.post("/account/changeCart", controller.changeCart);
router.post("/account/changePcCart", controller.changePcCart);
router.delete("/account/:userId", controller.deleteCart);
router.get("/discounts/:discountcode", controller.getDiscount);
router.delete("/account/shopcart/:userId/:shopcartId", controller.deleteCartPart);
router.delete("/account/delShopCartItems/:userId", controller.deleteConfigItems)

module.exports = router;