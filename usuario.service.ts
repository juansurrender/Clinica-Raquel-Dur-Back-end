import { resolve } from "path";
import { baseDatos } from "./conection-sqlite";
import { Login, Register } from "./models";
import { rejects } from "assert";


export function buscarUsuario(email: string) {
    return new Promise((resolve, reject) => {
        baseDatos.get(`SELECT * FROM usuarios WHERE email = '${email}'`, [], (error: any, usuarioExistente: any) => {
            if (error) {
                reject(error)
            } else if (usuarioExistente) {
                reject('El usuario ya existe')
            } else {
                resolve(true)
            }
        })
    })
}

export function insertarUsuario(miRegister: Register) {
    return new Promise((resolve, reject) => {
        const queriregister = `INSERT INTO usuarios (username, lastname, email, password) VALUES ('${miRegister.nombre}', '${miRegister.apellido}', '${miRegister.email}', '${miRegister.password}')`;
        baseDatos.run(queriregister, [], (error: any) => {
            if (error) {
                reject(error);
            } else {
                resolve('Usuario registrado correctamente');
            }
        });
    })
}

export function logearusuario (mibody:Login){
    return new Promise((resolve,reject) =>{
        const query = `SELECT * FROM usuarios WHERE email = '${mibody.email}' AND password = '${mibody.password}'`
        baseDatos.all(query, [], (error: any, datosDevueltos: Array<any>) => {
            if (error) {
                console.error(error)
                reject(error) //500 significa Server internal error indica un error que se ha producido por culpa nuestra (del servidor)
            } else {
                if (datosDevueltos.length == 0) {
                    reject (new error("Usuario no encontrado"))
                } else {
                    let usuarioObtenido = datosDevueltos[0];
                    delete usuarioObtenido.password;
                    resolve(usuarioObtenido)
                }

            }
        })
    })
}

