// Imports
const express = require( 'express' );
const wbm = require( './functions' );

// App Express
const router = express.Router();

const shortcuts = {}; // Shortcuts

// Send Message
router.post( '/send', async ( req, res ) => {

    await wbm.start( { session: true } )
        .then( async () => {
            const phones = [];
            let message;

            if ( req.body.shortcut ) {
                message = shortcuts[req.body.shortcut];
            } else if ( req.body.message ) {
                message = req.body.message;
            } else {
                return res.status( 500 ).json( {
                    message: 'The message or shortcut is necessary'
                } );
            }

            phones.push( req.body.phone );

            await wbm.send( phones, message );
            await wbm.end();
        } )
        .catch();

    res.send( 'Mensaje enviado!' );
} );

// Shortcuts
router.post( '/shortcut', async ( req, res ) => {
    if ( req.body.param === 'show' ) return res.json( shortcuts ); // Mostrar comando ya guardados
    if ( req.body.param === 'new' ) { // Guardar nuevo shortcut
        if ( !shortcuts[`/${ req.body.shortcut }`] ) {
            shortcuts[`/${ req.body.shortcut }`] = req.body.value || '';
            return res.json( {
                message: 'Atajo agregado correctamente',
                shortcuts
            } );
        } else {
            return res.json( {
                message: 'Atajo ya existe',
                shortcuts
            } );
        }
    }
    if ( req.body.param === 'delete' ) { // Borrar un shortcut
        delete shortcuts[`/${ req.body.shortcut }`];
        return res.json( {
            message: 'Atajo eliminado',
            shortcuts
        } );
    }
    if ( req.body.param === 'update' ) { // Actualizar un shortcut
        if ( shortcuts[`/${ req.body.shortcut }`] ) {
            if ( req.body.shortcut_new ) {
                shortcuts[`/${ req.body.shortcut_new }`] = req.body.value || shortcuts[`/${ req.body.shortcut }`];
                delete shortcuts[`/${ req.body.shortcut }`];
            } else {
                shortcuts[`/${ req.body.shortcut }`] = req.body.value;
            }

            return res.json( {
                message: 'Atajo actualizado',
                shortcuts
            } );
        } else {
            return res.json( {
                message: 'Atajo no existe',
            } );
        }
    }
} );

// Shortcut Doc
router.get( '/doc', async ( req, res ) => {
    const doc = {
        routes: {
            send_whatsapp_message: '/whatsapp/send',
            manage_shortcuts: '/whatsapp/shortcuts'
        },
        shortcuts_doc: {
            only_method: 'POST',
            general_json_to_receive: {
                param: 'Indicate the function to want (show, new, delete, update)',
                shortcut: 'Indicate shortcut to use',
                value: 'Indicate the value of the shortcut',
                shortcut_new: 'In case you want to update the shortcut'
            },
            cases_to_use: {
                new: {
                    param: 'new',
                    shortcut: '..(numbers o words)',
                    value: 'Text of the message'
                },
                show: {
                    param: 'show'
                },
                delete: {
                    param: 'delete',
                    shortcut: 'Indicate the shortcut to delete'
                },
                update: {
                    param: 'update',
                    shortcut: 'Indicate shortcut to update',
                    value: 'Indicate the new value of the shortcut',
                    shortcut_new: 'If you want update the shortcut'
                }
            }
        },
        whatsapp_doc: {
            only_method: 'POST',
            general_json_to_receive: {
                phone: 'Indicate the number with the country code',
                message: 'Indicate message to send',
                shortcut: 'Indicate the message from a shortcut (OPTIONAL -> init whit "/")'
            }
        }
    };

    res.json( doc );

} );

// export
module.exports = router;