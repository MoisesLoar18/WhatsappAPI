// Imports
const bodyparser = require( 'body-parser' );
const router = require( './services/' );
const express = require( 'express' );
const cors = require( 'cors' );

// Express application
const app = express();

// Configuration
app.use( bodyparser.urlencoded( { extended: false } ) );
app.use( bodyparser.json() );
app.use( cors() );

// Routes
app.use( '/whatsapp', router );

// Variables
app.set( require( './config.js' ) );

// App running
app.listen( process.env.PORT, () => {
    console.log( `Escuchando el puerto ${ process.env.PORT }` );
} );