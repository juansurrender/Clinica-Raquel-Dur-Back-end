import { baseDatos } from "./conection-sqlite";
import { Request, Response, query } from "express";
import { Login, Register } from "./models";
import { buscarUsuario, insertarUsuario, logearusuario } from "./usuario.service";
const express = require('express');
//es requerido para cargar el contenido del fichero .env y las variables dentro de este
//asignarlas al process.env.*
const dotenv = require('dotenv');
//import dotenv from "dotenv"; Otra forma de importar librerias/dependencias aunque dependerá de nuestra configuración de proyecto
dotenv.config();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())



const port = process.env.PORT;

app.get('/',(request: Request, response: Response) => {
    response.send('¡Hola, mundo!');
});

app.post('/login', async (request: Request, response: Response) => {
    const mibody = request.body as Login;
    if (!!mibody.email && !!mibody.password) {
        try{
            await logearusuario(mibody)
            const logigin = await logearusuario(mibody)
            response.status(200).send(logigin)
        }catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(400).send('usuario o contraseña incorrecto');
    }
});

        
//        const query = `SELECT * FROM usuarios WHERE email = '${mibody.email}' AND password = '${mibody.password}'`
//        baseDatos.all(query, [], (error: any, datosDevueltos: Array<any>) => {
//            if (error) {
//                console.error(error)
//                response.status(500).send(error) //500 significa Server internal error indica un error que se ha producido por culpa nuestra (del servidor)
//            } else {
//                if (datosDevueltos.length == 0) {
//                    response.status(404).send("Usuario no encontrado")
//                } else {
//                    let usuarioObtenido = datosDevueltos[0];
//                   delete usuarioObtenido.password;
//                    response.status(200).send(usuarioObtenido)
//                }
//
//            }
//        })
//    } else {
//        response.status(400).send('usuario o contraseña incorrecto')
//    }
    //Una vez obtenidos email y password, comprobarlos con la base de datos si existen y coinciden
    //Si existen y coinciden le das el OK al res (200) => Exito en la comunicación
    //Si no es OK 401 => No autorizado // contraseña incorrecta
    //400 Bad Request, que significa, que la petición que hemos hecho está mal
    // baseDatos.all('SELECT * FROM usuarios')
    // res.status(401).send('email or password incorrect')
    // res.send('I am the login');
//});



app.post('/register', async (request: Request, response: Response) => {
    const miRegister = request.body as Register;
    if (miRegister.nombre && !!miRegister.apellido && !!miRegister.email && !!miRegister.password) {
        try {
            await buscarUsuario(miRegister.email)
            const mensaje = await insertarUsuario(miRegister)
            response.status(200).send(mensaje)
        } catch (error) {
            response.status(500).send(error);
        }
    } else {
        response.status(400).send('Falta algún campo requerido');
    }
});

app.get('/citas/pormes/:mes',  async (request: Request, response: Response) => {
    const mes = request.params.mes;
    //Hacer query de select y obtener solo las citas del mes pasado
})

app.get('/citas/pordia/:dia',  async (request: Request, response: Response) => {
    const dia = request.params.dia;
    //Hacer query de select y obtener solo las citas del mes pasado
})


app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});