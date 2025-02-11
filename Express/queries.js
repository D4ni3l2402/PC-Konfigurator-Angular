const getusers = "SELECT * FROM users"; // for the admin 
const getuserbyNr = "SELECT * FROM users WHERE userNr = $1"; // like a variable $1
const getuserbyuserName = 'SELECT * FROM users WHERE userName = $1';                                                                                                                                                                                                                                                                                     
const checkEmailExists = "SELECT * FROM users  WHERE email = $1";
const checkUsernameExists = "SELECT * FROM users WHERE username = $1";
const adduser = "INSERT INTO users (username, firstname, lastname, email, phone, address, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
const getUserByEmail = 'SELECT * FROM users WHERE userName = $1';
const deleteUser = 'DELETE FROM users WHERE userNr = $1';
const getItems = 'SELECT * FROM items ORDER BY itemsNr DESC';
const getitembyNr = 'SELECT * FROM items WHERE itemsnr = $1 ORDER BY itemsNr DESC';
const edititem = 'UPDATE items SET name = $1, description = $2, quantity = $3, price = $4, power = $5 , typeof = $6  WHERE itemsnr = $7';
//
const getmostViewdItems = `
SELECT i.itemsnr, i.name, i.typeof, COUNT(*) AS count
FROM bestellungsitems b
JOIN items i ON b.itemsnr = i.itemsnr
GROUP BY i.itemsnr, i.name, i.typeof
ORDER BY count DESC
LIMIT 4
`;

const getShopCart = `SELECT * FROM shopcart sc
LEFT JOIN donepc dp ON sc.pcid = dp.pcid
LEFT JOIN items i ON sc.itemsnr = i.itemsnr
WHERE sc.userNr = $1`;
// const getShopCart = `SELECT i.name, i.price, i.itemsnr FROM shopcart sc
// JOIN items i ON sc.itemsnr = i.itemsnr
// WHERE sc.userNr = $1`;

const addToCart = `INSERT INTO shopcart (usernr, itemsnr, pcid, price, ram, speicher, os) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

const changeCart = `UPDATE shopcart SET itemsnr = $2, price = $4 WHERE usernr = $1 AND shopcartid = $3`;
// const changeCart = `UPDATE shopcart SET itemsnr = $2 WHERE usernr = $1 AND shopcartid = $3`;
const changePcCart = `UPDATE shopcart SET pcid = $2, price = $3, ram=$5, speicher=$6, os=$7 WHERE usernr = $1 AND shopcartid = $4`;

const deleteCart = `DELETE FROM shopcart WHERE usernr = $1`;

const deleteCartPart = `DELETE FROM shopcart WHERE usernr = $1 AND shopcartid = $2`;

const getTypeOf = `SELECT sc.shopcartid, sc.itemsnr FROM shopcart sc
LEFT JOIN items i ON sc.itemsnr = i.itemsnr
WHERE i.typeof = $2 AND sc.usernr = $1`;

const getDiscount = "SELECT * FROM discounts WHERE discountcode = $1";

const getCartFullPrice = `SELECT SUM(sc.price) AS totalPrice FROM shopcart sc
LEFT JOIN items i ON sc.itemsnr = i.itemsnr
WHERE usernr = $1`;

const deleteConfigItems = `DELETE FROM shopcart WHERE usernr = $1 AND itemsnr IS NOT NULL;`;

module.exports = { 
     getusers,
     getuserbyuserName,
     getuserbyNr,
     checkEmailExists,
     checkUsernameExists,
     adduser,
     getUserByEmail, // TODO check if this is redundant hence eventually recycle or delete
     deleteUser,
     getItems,
     getitembyNr,
     edititem,
     // 
     //von Jehee
     getCartFullPrice,
     deleteCartPart,
     deleteConfigItems,
     //
     getmostViewdItems,
     getShopCart,
     addToCart,
     deleteCart,
     //Discounts
     getDiscount,
     changeCart,
     changePcCart,
     getTypeOf
}