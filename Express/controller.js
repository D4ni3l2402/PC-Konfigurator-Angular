const e = require('express');
const pool = require('./connection'); // importing the connection file which connects to our database
const queries = require('./queries'); // importing the queries file which contains the sql queries
const bcrypt = require('bcrypt'); // importing it for hashing




const getusers = (req,res)=>{
    pool.query( queries.getusers, (err,result)=>{ // holds our sql queries : queries.getusers
        if(err){
            throw err;
        }
        res.status(200).json(result.rows); // 200 means succesfull
        //console.log(result.rows);
    })
}


const getuserbyNr = (req,res)=>{
    const userNr = parseInt(req.params.userNr); // we are getting the userNr from the url
    pool.query( queries.getuserbyNr,[userNr], (err,result)=>{
        if(err){
            throw err;
        }
        res.status(200).json(result.rows);
        //console.log(result.rows);
        
    })
    
}

const getItems = (req,res)=>{
    pool.query( queries.getItems, (err,result)=>{ // holds our sql queries : queries.getusers
        if(err){
            throw err;
        }
        res.status(200).json(result.rows); // 200 means succesfull
        //console.log(result.rows);
        

    })
}

const getitembyNr = (req,res)=>{
    const itemNr = parseInt(req.params.itemsnr); // we are getting the userNr from the url note item s* nr != item nr
    pool.query( queries.getitembyNr,[itemNr], (err,result)=>{
        if(err){
            throw err;
        }
        res.status(200).json(result.rows);
        //console.log(result.rows);
        
    })
}

// // UPDATING THE ITEM TABLE

// const edititem = (req, res) => {
//     const itemsNr = parseInt(req.params.itemsnr); // Getting the itemsNr from the URL

//     // Data to update the item (excluding itemsnr)
//     const { name, description, quantity, price, power, ['typeof']: itemType } = req.body;

//     // Building the SET part of the SQL query dynamically
//     let queryParts = [];
//     let queryParams = [];

//     if (name !== undefined) {
//         queryParts.push("name = $"+(queryParts.length+1));
//         queryParams.push(name);
//     }
//     if (description !== undefined) {
//         queryParts.push("description = $"+(queryParts.length+1));
//         queryParams.push(description);
//     }
//     if (quantity !== undefined) {
//         queryParts.push("quantity = $"+(queryParts.length+1));
//         queryParams.push(quantity);
//     }
//     if (price !== undefined) {
//         queryParts.push("price = $"+(queryParts.length+1));
//         queryParams.push(price);
//     }
//     if (power !== undefined) {
//         queryParts.push("power = $"+(queryParts.length+1));
//         queryParams.push(power);
//     }
//     if (itemType !== undefined) {
//         queryParts.push("typeof = $"+(queryParts.length+1));
//         queryParams.push(itemType);
//     }

//     if (queryParts.length === 0) {
//         return res.status(400).send("No fields provided for update");
//     }

//     queryParams.push(itemsNr); // Add itemsNr as the last parameter for the WHERE clause
//     const setClause = queryParts.join(', ');
//     const updateQuery = `UPDATE items SET ${setClause} WHERE itemsnr = $${queryParams.length}`;

//     // First, check if the item exists
//     pool.query(queries.getitembyNr, [itemsNr], (err, result) => {
//         if (err) {
//             console.error('Error executing query', err.stack);
//             return res.status(500).send("Internal Server Error");
//         }

//         if (!result.rows.length) {
//             return res.status(404).send("Item does not exist");
//         }

//         // Item exists, proceed to update
//         pool.query(updateQuery, queryParams, (err, result) => {
//             if (err) {
//                 console.error('Error executing query', err.stack);
//                 return res.status(500).send("Internal Server Error");
//             }

//             res.status(200).send("Item updated successfully");
//         });
//     });
// };


// END UPDATING THE ITEM TABLE

 // START USER REGISTRATION 
// new edited code  including daniels username verification
// const saltRounds = 10; // Number of rounds to hash the password ( like the computational power needed, the more the rounds the longer it can take to hash it)
// const adduser = (req, res) => {
//     const { username, firstname, lastname, email, phone, address, password } = req.body;

//     pool.query(queries.checkEmailExists, [email], async (err, result) => {
//         if (err) {
//             return res.status(500).send("Error checking email");
//         }

//         if (result.rows.length) {
//             return res.send("Email already exists"); // if there is somehting in the result of the query, then the email sent to be checked had a match hence already exist
//         }

//         // Check if username exists
//         pool.query(queries.checkUsernameExists, [username], async (err, result) => {
//             if (err) {
//                 return res.status(500).send("Error checking username");// if there is somehting in the result of the query, then the username sent to be checked had a match hence already exist
//             }

//             if (result.rows.length) {
//                 return res.send("Username already exists");
//             }

//             try {
//                 // Hash the password
//                 const hashedPassword = await bcrypt.hash(password, saltRounds);

//                 // Insert user with hashed password
//                 pool.query(queries.adduser, [username, firstname, lastname, email, phone, address, hashedPassword], (err, result) => {
//                     if (err) {
//                         throw err;
//                     }
//                     res.status(201).send("User added");
//                 });
//             } catch (error) {
//                 res.status(500).send("Error adding user");
//             }
//         });
//     });
// };

// END USER REGISTRATION







// async function getUserByEmail(email) {
//     const result = await pool.query(queries.getUserByEmail, [email]);
//     return result.rows[0]; // returns the first user found or undefined if no user is found
// }

/*

const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email); // Replace with your actual function to get user by email

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ userNr: user.userNr }, '99999999999999999999', { expiresIn: '1h' }); 
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send('Error logging in user');
    }
};
*/

// modiefied Login from daniel

/*
  const jwt = require('jsonwebtoken');

  const loginUser = async (req, res) => {
      try {
          const { userName, password } = req.body;
          const user = await getUserByEmail(userName); // Replace with your actual function to get user by email
  
          if (!user) {
              return res.status(404).send('User not found');
          }

          if (!userName || !password) {
            res.status(400).json({ error: 'userName and Password are needed.' });
            return;
          }
  
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return res.status(400).send('Invalid credentials');
          }
  
          const token = jwt.sign({ userNr: user.userNr }, '99999999999999999999', { expiresIn: '1h' }); // Replace 'your_jwt_secret' with your actual secret key
          res.status(200).json({ message: 'Login successful' } ) ;
      } catch (error) {
          res.status(500).json('Error logging in user');
      }
  };

*/

// simplified but still does not work on the site
// const loginUser = async (req, res) => {
//     try {
//         const { userName, password } = req.body;
//         const user = await getUserByEmail(userName); // Replace with your actual function to get user by email

//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         if (!userName || !password) { // probably delete, it does work ?
//           res.status(400).json({ error: 'userName and Password are needed.' });
//           return;
//         }

//         const usern = user.rows[0];
//         const isMatch = await bcrypt.compare(password, usern.password);
//         if (isMatch) {
//             res.json({ message: 'Login successful' });
//           } else {
//             res.status(401).json({ error: 'Invalid Credentials' });
//           }
        
//     } catch (error) {
//         res.status(500).json('Error logging in user');
//     }
// };





// const deleteUser = (req, res) => {
//     const userNr = parseInt(req.params.userNr); // Getting the userNr from the URL

//     // First, check if the user exists
//     pool.query(queries.getuserbyNr, [userNr], (err, result) => { // becarefull of getuserbyNr the U just lost me time. fixe it now ?
//         if (err) {
//             // Handle any error that occurred during the first query
//             console.error('Error executing query', err.stack);
//             return res.status(500).send("Internal Server Error");
//         }

//         if (!result.rows.length) {
//             // If the user doesn't exist, return a response and stop further execution
//             return res.status(404).send("User does not exist");
//         }

//         // User exists, proceed to delete
//         pool.query(queries.deleteUser, [userNr], (err, result) => {
//             if (err) {
//                 // Handle errors that occur during the deletion
//                 console.error('Error executing query', err.stack);
//                 return res.status(500).send("Internal Server Error");
//             }

//             // Confirm the deletion
//             res.status(200).send("User deleted");
//             //console.log(result.rows);
//         });
//     });
// };


const getmostViewdItems = async (req, res)=>{
    pool.query( queries.getmostViewdItems, (err, result)=>{ // holds our sql queries : queries.getusers
        if(err){
            throw err;
        }
        res.status(200).json(result.rows); // 200 means succesfull
        // console.log(result.rows);
    })
}

/*
// when working with URl / geting discount code from url
const getDiscount = async (req, res) => {

    const discountCode = req.params.discountcode;
    pool.query(queries.getDiscount, [discountCode], (err, result) => { // Assumes queries.getDiscount is parameterized to fetch a specific discount by ID
        
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error!" });
        }

        if (result.rows.length === 0) {
            // No discount found by the given ID, send a custom message
            return res.status(404).json({ message: "No discount coupon exists with this Name." });
        }

        //  in case we get more than one
        const discount = result.rows[0];
        // checking time validity
        const today = new Date();
        const validfrom = new Date(discount.validfrom);
        const validuntil = new Date(discount.validuntil);

        if (today < validfrom || today > validuntil) {
            // The discount is not valid based on today's date
            return res.status(404).json({ message: "This discount coupon is no longer valid." });
        }

        // The discount is valid, send it back
        res.status(200).json(discount);
    });
}

*/

//geting from the user
const getDiscount = async (req, res) => {
    const discountCode = req.params.discountcode;

    pool.query(queries.getDiscount, [discountCode], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error!" });
        }

        if (result.rows.length === 0) {
            // No discount found by the given code, send a custom message
            return res.status(404).json({ message: "No discount coupon exists with this code." });
        }

        // if we get more that one
        const discount = result.rows[0];
        // checking time validity
        const today = new Date();
        const validFrom = new Date(discount.validfrom);
        const validUntil = new Date(discount.validuntil);

        if (today < validFrom || today > validUntil) {
            // The discount is not valid based on today's date
            return res.status(404).json({ message: "This discount coupon is no longer valid." });
        }

        // The discount is valid, send it back
        res.status(200).json(discount);
    });
};


const getShopCart = (req, res) => {
    const userId = parseInt(req.params.userId);
    pool.query(queries.getShopCart, [userId], (err, result) => {
        if(err){
            return res.status(500).send("Internal Server Error");
        }
        res.status(200).json(result.rows);
    });
}

const addToCart = async (req, res) => {
    const { userId, cartItem, pcid, pcprice, ram, speicher, os} = req.body;
    // const userId = parseInt(req.params.userId);
    // const cartItem = req.body;
    await pool.query(queries.addToCart, [userId, cartItem, pcid, pcprice, ram, speicher, os]);
    res.json({ message: 'Item successful added' });
}

const changeCart = async (req, res) => {
    const { userId, typeOf, cartItem, pcprice } = req.body;
    const typeResult = await pool.query(queries.getTypeOf, [userId, typeOf]);
    const shopcartid = typeResult.rows.map(row => row.shopcartid);

    await pool.query(queries.changeCart, [userId, cartItem, shopcartid[0], pcprice]);
    res.json({ message: 'Item successful changed' });
}

const changePcCart = async (req, res) => {
    const { userId, pcid, shopcartid, pcprice, ram, speicher, os } = req.body;
    await pool.query(queries.changePcCart, [userId, pcid, pcprice, shopcartid, ram, speicher, os]);
    res.json({ message: 'PC successful changed' });
}

const deleteCart = async (req, res) => {
    const userId  = req.params.userId;
    await pool.query(queries.deleteCart, [userId]);

}

const deleteCartPart = async (req, res) => {
    const userId = req.params.userId; // Auf userId zugreifen
    const shopcartid = req.params.shopcartId; // Auf shopcartid zugreifen
    console.log(userId + " " + shopcartid);
    
    await pool.query(queries.deleteCartPart, [userId, shopcartid]);
    res.json({ message: 'Item successfully removed' });
}

const deleteConfigItems = async (req,res)=>{
    const userId = req.params.userId;

    await pool.query(queries.deleteConfigItems, [userId]);

}


// const getuserbyNr = (req,res)=>{
//     const userNr = parseInt(req.params.userNr); // we are getting the userNr from the url
//     pool.query( queries.getuserbyNr,[userNr], (err,result)=>{
//         if(err){
//             throw err;
//         }
//         res.status(200).json(result.rows);
//         //console.log(result.rows);
        
//     })
    
// }

const getCartFullPrice = async (req, res) => {
    const usernr  = req.params.userId;
    pool.query(queries.getCartFullPrice, [usernr], (err, result) => {
        if(err){
            return res.status(500).send("Internal Server Error");
        }
        res.status(200).json(result.rows[0]);
    });
}

module.exports = {
    getusers,
    getuserbyNr,
    //adduser,
    //loginUser,
    //deleteUser,
    getItems,
    getitembyNr,
    //
    //von Jehee
    getCartFullPrice,
    deleteCartPart,
    deleteConfigItems,
    //edititem,
    getmostViewdItems,
    getShopCart,
    addToCart,
    deleteCart,
    //Discounts
    getDiscount,
    changeCart,
    changePcCart
};  