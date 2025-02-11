const client = require('./connection');
const routes = require('./routes');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);
app.use(express.static('public'));

app.listen(3300, () => {
  console.log("Sever is now listening at port 3300");
})



client.connect();

app.get('/fertigpc', (req, res) => {
  client.query('SELECT * FROM donepc ORDER BY pcid DESC', (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Error fetching items data.');
    }
  });
  //client.end(); 
});


app.post('/register', async (req, res) => {
  try {
    const { userName, firstName, lastName, email, phone, address, password } = req.body;

    // Überprüfe, ob der Benutzername mindestens 4 Zeichen lang ist und keine Leerzeichen enthält
    if (userName.length < 4 || userName.includes(' ')) {
      return res.status(400).json({ error: 'Der Benutzername muss mindestens 4 Zeichen lang sein und darf keine Leerzeichen enthalten' });
    }

    // Überprüfe, ob der Benutzer bereits existiert
    const userExistsQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    const existingUser = await client.query(userExistsQuery, [userName, email]);

    if (existingUser.rows.length > 0) {
      // Der Benutzer existiert bereits
      return res.status(400).json({ error: 'Benutzername oder E-Mail bereits vergeben' });
    }

    // Benutzer existiert noch nicht und der Benutzername entspricht den Anforderungen, fahre mit der Registrierung fort
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      'INSERT INTO users (username, firstname, lastname, email, phone, address, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userName, firstName, lastName, email, phone, address, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    const result = await client.query('SELECT * FROM users WHERE userName = $1', [userName]);

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid Credentials' });
      return;
    }

    if (!userName || !password) {
      res.status(400).json({ error: 'Benutzername und Passwort sind erforderlich.' });
      return;
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to the PC Configurator API!');
});


app.get('/users', (req, res) => {
  client.query('SELECT * FROM users ORDER BY userNr DESC', (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Error fetching user data.');
    }
  });
  //client.end(); 
});

app.get('/userDetails/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    const result = await client.query('SELECT * FROM users WHERE userName = $1', [userName]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Benutzer nicht gefunden' });
      return;
    }

    const user = result.rows[0];
    res.send(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.get('/users/:userNr', (req, res) => {
//   const userNr = req.params.userNr;
//   client.query('SELECT * FROM users WHERE userNr = $1 ORDER BY userNr DESC', [userNr], (err, result) => { // dolar 1 is just a variable that changes, it is not actually 
//     if (!err) {
//       res.send(result.rows);
//     } else {
//       console.error(err);
//       res.status(500).send('Error fetching user data.');
//     }
//   });
// });

app.get('/items', (req, res) => {
  client.query('SELECT * FROM items ORDER BY itemsNr DESC', (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Error fetching items data.');
    }
  });
  //client.end(); 
});


app.get('/items/:itemsNr', (req, res) => {
  const itemsNr = req.params.itemsNr;
  client.query('SELECT * FROM items WHERE itemsNr = $1 ORDER BY itemsNr DESC', [itemsNr], (err, result) => { // dolar 1 is just a variable that changes, it is not actually WHERE userNr = $1 ORDER BY userNr DESC, [userNr], (err, result) => { // dolar 1 is just a variable that changes, it is not actually 
    if (!err) {
      res.send(result.rows);
    } else {
      console.error(err);
      res.status(500).send('Error fetching items data.');
    }
  });
});


// from here it disappeared 

// app.get('/user_has_history/:userNr', (req, res) => {
//   const userNr = req.params.userNr;
//   client.query('SELECT * FROM user_has_history WHERE userNr = $1 ORDER BY userNr DESC', [userNr], (err, result) => { // dolar 1 is just a variable that changes, it is not actually WHERE userNr = $1 ORDER BY userNr DESC, [userNr], (err, result) => { // dolar 1 is just a variable that changes, it is not actually 
//     if (!err) {
//       res.send(result.rows);
//     } else {
//       console.error(err);
//       res.status(500).send('Error fetching user_has_history data.');
//     }
//   });
// });

app.post('/orderedItems', async (req, res) => {
  try {
    const { userNr, itemsList, donePCList, discountID } = req.body;
    // Hier wird in der bestellungen Tabell eine neue row hinzugefügt und danach die neue bestellungnr zurückgge
    const bestellungQuery = 'INSERT INTO bestellungen (usernr) VALUES ($1) RETURNING bestellungnr'
    const bestellungsResult = await client.query(bestellungQuery, [userNr]);
    const lastBestNr = 'SELECT MAX(bestellungnr) as maxBestellNr FROM bestellungen';
    const lastBestNrInserted = await client.query(lastBestNr);
    const lastBestNrObj = lastBestNrInserted.rows[0];
    const maxNr = lastBestNrObj["maxbestellnr"];

    //check if discout is applied 
    console.log(discountID);
    if(discountID !== 0){
      const discountQuery = 'INSERT INTO discountusage (discountid, usernr, bestellungnr) VALUES ($1, $2, $3)'
      await client.query(discountQuery, [discountID, userNr, maxNr]);

    }

    const getPCInfoQuery = 'SELECT * FROM shopcart WHERE pcid is not null AND usernr = $1'
    const getPCInfoResult = await client.query(getPCInfoQuery, [userNr])

    const bestellungsitemsResults = await Promise.all(itemsList.map( (item) => {
      const { itemsnr } = item;

      const updateQuantityQuery = 'UPDATE items SET quantity = quantity - 1 WHERE itemsnr = $1'
      const updateQuantity = client.query(updateQuantityQuery, [itemsnr])

      // console.log('items:', { itemsnr }); // Überprüfe, ob die Werte korrekt sind
      const userPosQuery = 'INSERT INTO bestellungsitems (bestellungnr, itemsnr) VALUES ($1, $2) RETURNING bestellungnr';
      const result = client.query(userPosQuery, [maxNr, itemsnr]);
      // return result.rows[0].bestellungnr;
    }));

    const bestellungsPCResults = await Promise.all(donePCList.map( (pcList) => {
      const { pcid } = pcList;
      // console.log(pcList.ram);
      // console.log(pcList.speicher);
      // console.log(pcList.os); // Überprüfe, ob die Werte korrekt sind
      const userPosQuery = 'INSERT INTO bestellungsitems (bestellungnr, pcid, pcprice, ram, speicher, os) VALUES ($1, $2, $3, $4, $5, $6) RETURNING bestellungnr';
      const result = client.query(userPosQuery, [maxNr, pcid, pcList.price, pcList.ram, pcList.speicher, pcList.os]);
      // return result.rows[0].bestellungnr;
    }));

    // const userHistoryPleasework = bestellungsitemsResults[0];
    // res.status(200).json({ message: 'Bestellung erfolgreich aufgegeben' });
  } catch (error) {
    console.error('Fehler beim Aufgeben der Bestellung:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// app.post('/orderedPC', async (req, res) => {
//   try {
//     // const cartItems = req.body.cartItems;
//     // const userId = req.body.userId;
//     // const { userId, cartItems, cartPC} = req.body;

//     const bestellungQuery = 'INSERT INTO bestellungen (usernr) VALUES ($1) RETURNING bestellungnr'
//     const bestellungsResult = await client.query(bestellungQuery, [userId]);

//     const lastBestNr = 'SELECT MAX(bestellungnr) as maxBestellNr FROM bestellungen';
//     const lastBestNrInserted = await client.query(lastBestNr);
//     const lastBestNrObj = lastBestNrInserted.rows[0];
//     const workpls = lastBestNrObj["maxbestellnr"];

//     console.log(lastBestNrObj);
//     console.log("--------");
//     console.log(workpls);

//     const userPosQuery = 'INSERT INTO bestellungspc (bestellungnr, pcid) VALUES ($1, $2) RETURNING bestellungnr';
//     //await client.query(userPosQuery, [workpls, null])

//     const bestellungsitemsResults = await Promise.all(cartItems.map(async (item) => {
//       console.log("works")
//       const {pcid } = item;

//       console.log('Inserting into userHistory:', { pcid }); // Überprüfe, ob die Werte korrekt sind

//       const userPosQuery = 'INSERT INTO bestellungspc (bestellungnr, pcid) VALUES ($1, $2) RETURNING bestellungnr';
//       const result = await client.query(userPosQuery, [workpls, pcid]);

//       return result.rows[0].bestellungnr;
//     }));

//     const userHistoryPleasework = bestellungsitemsResults[0];
//     res.status(200).json({ message: 'Bestellung erfolgreich aufgegeben' });
//   } catch (error) {
//     console.error('Fehler beim Aufgeben der Bestellung:', error);
//     res.status(500).json({ error: 'Interner Serverfehler' });
//   }
// });

// app.get('/bestellListe/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     // const userId = req.params.userId; // Hier die Änderung
//     const userQuery = 'SELECT * FROM bestellungen WHERE usernr = $1';
//     const userResult = await client.query(userQuery, [userId]);

//     // Extrahiere alle Bestellnummern
//     const bestellungsnr = userResult.rows.map(row => row.bestellungnr);

//     console.log(bestellungsnr);

//     for (const bnr of bestellungsnr) {
//       const bestellItemQuery = 'SELECT * FROM bestellungsitems WHERE bestellungnr = $1';
//       const bestellItemResult = await client.query(bestellItemQuery, [bnr]);
//       //console.log(LOL.rows);
//       console.log("----------------");

//       const itemsnrList = bestellItemResult.rows.map(row => row.itemsnr);

//       for (const itemsLook of itemsnrList) {
//         const itemLookQuery = 'SELECT * FROM items WHERE itemsnr = $1';
//         const itemLookResult = await client.query(itemLookQuery, [itemsLook]);
//         console.log(itemLookResult.rows[0].name);
//         res.send(itemLookResult.rows[0].name);
//       }
//     }


// app.get('/bestellListe/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const userQuery = 'SELECT * FROM bestellungen WHERE usernr = $1';
//     const userResult = await client.query(userQuery, [userId]);
//     const bestellungsnr = userResult.rows.map(row => row.bestellungnr);
//     const responseData = [];

//     for (const bnr of bestellungsnr) {

//       //responseData.push("------------");
//       const bestellItemQuery = 'SELECT * FROM bestellungsitems WHERE bestellungnr = $1';
//       const bestellItemResult = await client.query(bestellItemQuery, [bnr]);
//       const itemsnrList = bestellItemResult.rows.map(row => row.itemsnr);

//       const bestellPCQuery = 'SELECT * FROM bestellungspc WHERE bestellungnr = $1';
//       const bestellPCResult = await client.query(bestellPCQuery, [bnr]);
//       const pcidList = bestellPCResult.rows.map(row => row.pcid);


//       for (const pcLook of pcidList) {
//         const PCLookQuery = 'SELECT * FROM donepc WHERE pcid = $1';
//         const PCLookResult = await client.query(PCLookQuery, [pcLook]);
//         // Füge die gefundenen Daten zum responseData-Array hinzu
//         responseData.push(PCLookResult.rows[0].namepc);
//       }

//       for (const itemsLook of itemsnrList) {
//         const itemLookQuery = 'SELECT * FROM items WHERE itemsnr = $1';
//         const itemLookResult = await client.query(itemLookQuery, [itemsLook]);
//         // Füge die gefundenen Daten zum responseData-Array hinzu
//         responseData.push(itemLookResult.rows[0].name);
//       }
//       responseData.push("------------");
//     }

//     // Sende die Daten einmalig an den Client
//     res.json(responseData);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


//begin side fixe for bestellung history with one Querry, and sending json dictionary but not an object
// in this format, the ordered history will be odered based on the bestellungnr 
app.get('/ordered/:userId', async (req, res) => {
  client.query(`
  SELECT b.orderdate, bi.*, i.*, pc.namepc, d.*
  FROM bestellungen b
  JOIN bestellungsitems bi ON b.bestellungnr = bi.bestellungnr
  LEFT JOIN items i ON i.itemsnr = bi.itemsnr
  LEFT JOIN donepc pc ON pc.pcid = bi.pcid
  LEFT JOIN discountusage du ON bi.bestellungnr = du.bestellungnr
  LEFT JOIN discounts d ON du.discountid = d.discountid
  WHERE b.usernr = $1
  `
    , [req.params.userId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const bestellungen = result.rows;
        res.json(bestellungen);//hell
      }
    });

});



//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/bestellListe/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const userQuery = 'SELECT * FROM bestellungen WHERE usernr = $1';
//     const userResult = await client.query(userQuery, [userId]);

//     // Extrahiere alle Bestellnummern
//     const bestellungsnr = userResult.rows.map(row => row.bestellungnr);

//     console.log(bestellungsnr);

//     // Array für die gesammelten Ergebnisse erstellen
//     const itemsNames = [];

//     for (const bnr of bestellungsnr) {
//       const bestellItemQuery = 'SELECT * FROM bestellungsitems WHERE bestellungnr = $1';
//       const bestellItemResult = await client.query(bestellItemQuery, [bnr]);
//       //console.log(LOL.rows);
//       console.log("----------------");

//       const itemsnrList = bestellItemResult.rows.map(row => row.itemsnr);

//       for (const itemsLook of itemsnrList) {
//         const itemLookQuery = 'SELECT * FROM items WHERE itemsnr = $1';
//         const itemLookResult = await client.query(itemLookQuery, [itemsLook]);
//         console.log(itemLookResult.rows[0].name);
//         // Ergebnis in das Array hinzufügen
//         itemsNames.push(itemLookResult.rows[0].name);
//       }
//     }

//     // Array als JSON an den Client senden
//     res.json({ itemsNames });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/shopcart/:userId', async (req, res) => {
// });