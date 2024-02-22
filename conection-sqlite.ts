//Verbose => Significa loggeo extendido. Basicamente mostrará más información sobre errores,consulta,etc...
const sqlite = require('sqlite3').verbose();

export const baseDatos = new sqlite.Database('C:/Users/juansurrender/usuariosraquelapk.db', (err: any) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the usuarios database.');
    }
});


