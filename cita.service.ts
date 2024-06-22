import { resolve } from "path";
import { baseDatos } from "./conection-sqlite";
import { error } from "console";
import { Confirmacion, Register, Citar,Login } from "./models";
import { Request, Response } from 'express';
import { logearusuario } from "./usuario.service";


// - Una ruta GET para obtener todas las citas del dia actual (acepta parametro del dia actual). Esta consulta la usaremos para la overview del dia
// * UN SELECT con un WHERE que filtre solo por el dia actual
// - Una ruta POST que haga un insert de los datos que enviamos desde el front al hacer una reserva. Esta consulta la usaremos para la confirmación de la reserva.
// * INSERT datos bablablabla IN TablaCita

// Una ruta GET para obtener todas las citas del mes actual (acepta parametro del mes actual). Esta consulta la usaremos para la Overview del mes.
// * UN SELECT con un WHERE que filtre solo por el mes actual

export function getCitaPorMesYUsuario(
  mes: number,
  anyo: number,
  idUsuario: number
) {
  return new Promise((resolve, reject) => {
    baseDatos.all(
      `SELECT * FROM citas WHERE usuariocitado = ${idUsuario} AND mes = ${mes} AND anyo = ${anyo}`,
      [],
      (error: any, citas: Array<any>) => {
        if (error) {
          reject(error);
        } else {
          resolve(citas);
        }
      }
    );
  });
}

export function getCitaPorDiaYUsuario(
  dia: number,
  mes: number,
  anyo: number,
  idUsuario: number
) {
  return new Promise((resolve, reject) => {
    baseDatos.all(
      `SELECT * FROM citas WHERE usuariocitado =${idUsuario} AND dia = ${dia} AND mes = ${mes} AND anyo = ${anyo}`,
      [],
      (error: any, citas: Array<any>) => {
        if (error) {
          reject(error);
        } else {
          resolve(citas);
        }
      }
    );
  });
}

export function getCitaPorDiaYUsuarioDiferente(
    dia: number,
    mes: number,
    anyo: number,
    idUsuario: number
  ) {
    return new Promise((resolve, reject) => {
      baseDatos.all(
        `SELECT * FROM citas WHERE usuariocitado !=${idUsuario} AND dia = ${dia} AND mes = ${mes} AND anyo = ${anyo}`,
        [],
        (error: any, citas: Array<any>) => {
          if (error) {
            reject(error);
          } else {
            resolve(citas);
          }
        }
      );
    });
  }
  

// export function buscarCita(
//     dia: number,
//     mes: number,
//     anyo: number,
//     hora: number
// ) {
//     return new Promise((resolve, reject) => {
//         baseDatos.all(
//             `SELECT * FROM citas WHERE dia = ${dia} AND mes = ${mes} AND anyo = ${anyo} AND hora = ${hora} `,
//             (error:any, citas :Array<any>) => { // Corregido: La función de callback debe tomar error y citas como argumentos
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(citas);
//                 }
//             }
//         );
//     });
// }

export function obtenerDiasOcupadosDelMes(
    mes: number,
    anyo: number,
){
    return new Promise ((resolve,reject) =>{
        baseDatos.all(
            `SELECT dia FROM citas WHERE mes = ${mes} AND anyo = ${anyo} GROUP by dia HAVING COUNT(*)  == 8;`,
            (error:any, citas:Array<any>) =>{
                if (error){
                    reject(error);
                } else {
                    resolve (citas);
                }
            }
        );
    });
}

export function obtenerCitahoraDiasOcupadosDelMes(
  mes: number,
  anyo: number,
  dia:number,
  hora:number
){
  return new Promise ((resolve,reject) =>{
      baseDatos.all(
          `SELECT dia FROM citas WHERE mes = ${mes} AND anyo = ${anyo} AND DIA = ${dia} AND hora = ${hora} GROUP by dia HAVING COUNT(*)  == 8;`,
          (error:any, citas:Array<any>) =>{
              if (error){
                  reject(error);
              } else {
                  resolve (citas);
              }
          }
      );
  });
}

export function obtenerCitahoraDiasidOcupadosDelMes(
  mes: number,
  anyo: number,
  dia:number,
  hora:number,
  idUsuario:number
){
  return new Promise ((resolve,reject) =>{
      baseDatos.all(
          `SELECT dia FROM citas WHERE mes = ${mes} AND anyo = ${anyo} AND DIA = ${dia} AND hora = ${hora} AND usuariocitado${idUsuario} GROUP by dia HAVING COUNT(*)  == 8;`,
          (error:any, citas:Array<any>) =>{
              if (error){
                  reject(error);
              } else {
                  resolve (citas);
              }
          }
      );
  });
}
export function obtenerCitahoraDiasidOcupadosDelMesnoUsuario(
  mes: number,
  anyo: number,
  dia:number,
  hora:number
){
  return new Promise ((resolve,reject) =>{
      baseDatos.all(
          `SELECT dia FROM citas WHERE mes = ${mes} AND anyo = ${anyo} AND DIA = ${dia} AND hora = ${hora} GROUP by dia HAVING COUNT(*)  == 8;`,
          (error:any, citas:Array<any>) =>{
              if (error){
                  reject(error);
              } else {
                  resolve (citas);
              }
          }
      );
  });
}



export function getCitaPorHoraYUsuario(hora: number, idUsuario: number) {
  return new Promise((resolve, reject) => {
    baseDatos.all(
      `SELECT * FROM citas WHERE usuariocitado =${idUsuario} AND hora = ${hora}`,
      [],
      (error: any, citas: Array<any>) => {
        if (error) {
          reject(error);
        } else {
          resolve(citas);
        }
      }
    );
  });
}

export function getCitaPorMinutosYUsuario(Minutos: number, idUsuario: number) {
  return new Promise((resolve, reject) => {
    baseDatos.all(
      `SELECT * FROM citas WHERE usuariocitado =${idUsuario} AND minutos = ${Minutos}`,
      [],
      (error: any, citas: Array<any>) => {
        if (error) {
          reject(error);
        } else {
          resolve(citas);
        }
      }
    );
  });
}

export function insertarUsuario(miRegister: Register) {
  return new Promise((resolve, reject) => {
    const queriregister = `INSERT INTO usuarios (username, lastname, email, password) VALUES ('${miRegister.nombre}', '${miRegister.apellido}', '${miRegister.email}', '${miRegister.password}')`;
    baseDatos.run(queriregister, [], (error: any) => {
      if (error) {
        reject(error);
      } else {
        resolve("Usuario registrado correctamente");
      }
    });
  });
}
export function insertarConfirmacion(confirmacionReserva: Confirmacion) {
  return new Promise((resolve, reject) => {
    const queryconfirmacion = `INSERT INTO citas(anyo, mes, dia, hora, minutos,usuariocitado) VALUES (?, ?, ?, ?, ?, ?)`;
    baseDatos.run(
      queryconfirmacion,
      [
        confirmacionReserva.anyo,
        confirmacionReserva.mes,
        confirmacionReserva.dia,
        confirmacionReserva.hora,
        confirmacionReserva.minutos,
        confirmacionReserva.usuariocitado,
      ],
      (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve("cita confirmada con éxito");
        }
      }
    );
  });
}
// export function buscarCita(dia: number,mes: number,anyo: number,hora: number) {
//   return new Promise((resolve, reject) => {
//       baseDatos.get(`SELECT * FROM citas WHERE dia = '${dia}' AND mes = '${mes}' AND anyo = '${anyo}' AND hora = '${hora}'`, [], (error: any, citaExistente: any) => 
//  {
//           if (error) {
//               reject(error)
//           } else if (citaExistente) {
//               reject('ya existe una cita')
//           } else {
//               resolve(true)
//           }
//       })
//   })
// }

export function buscarCita(dia: number, mes: number, anyo: number, hora: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    baseDatos.get(
      'SELECT * FROM citas WHERE dia = ? AND mes = ? AND anyo = ? AND hora = ?',
      [dia, mes, anyo, hora],
      (error: any, citaExistente: any) => {
        if (error) {
          reject(error);
        } else if (citaExistente) {
          reject('Ya existe una cita para esta fecha y hora');
        } else {
          resolve(false); // No hay cita existente, se puede proceder a insertar
        }
      }
    );
  });
}
export function insertarCita(Cita: Citar) {
  return new Promise((resolve, reject) => {
      const queriregister = `INSERT INTO citas (dia, mes, anyo, hora, id_usuario) VALUES ('${Cita.dia}', '${Cita.mes}', '${Cita.anyo}', '${Cita.hora}', '${Cita.idUsuario}')`;
      baseDatos.run(queriregister, [], (error: any) => {
          if (error) {
              reject(error);
          } else {
              resolve('cita reservada correctamente');
          }
      });
  })
}



//insertar una cita // 
// export function insertarCita(citar: Citar) {
//   return new Promise((resolve, reject) => {
//       const quericita = `INSERT INTO citas (dia, mes, anyo, hora, usuariocitado) VALUES ('${citar.dia}', '${citar.mes}', '${citar.anyo}', '${citar.hora}', '${citar.usuariocitado}')`;
//       baseDatos.run(quericita, [], (error: any) => {
//           if (error) {
//               reject(error);
//           } else {
//               resolve('cita registrada correctamente');
//           }
//       });
//   })
// }

// export function insertarCita(citar: Citar) {
//   return new Promise((resolve, reject) => {
//     // Construir la consulta SQL para insertar la cita en la tabla 'citas'
//     const query = `INSERT INTO citas (dia, mes, anyo, hora, usuariocitado) 
//                    VALUES ('${citar.dia}', '${citar.mes}', '${citar.anyo}', '${citar.hora}', '${citar.usuariocitado}')`;

//     // Ejecutar la consulta utilizando el método 'run' de la base de datos
//     baseDatos.run(query, [], (error: any) => {
//       if (error) {
//         reject(error); // Si hay un error, rechazar la promesa con el error
//       } else {
//         resolve('cita registrada correctamente'); // Si tiene éxito, resolver la promesa con un mensaje de éxito
//       }
//     });
//   });
// }


// //buscar una cita //

// // export function buscarCitas(dia: string, mes: string, hora: string, anyo: string) {
// //   return new Promise((resolve, reject) => {
// //       baseDatos.all(`SELECT * FROM citas WHERE dia = '${dia}' AND mes = '${mes}'AND hora = '${hora}'AND anyo = '${anyo}'`, [], (error: any, citaExistente: any) => {
// //           if (error) {
// //               reject(error)
// //           } else if (citaExistente) {
// //               reject('Esta cita ya esta ocupada')
// //           } else {
// //               resolve(true)
// //           }
// //       })
// //   })
// // }

// export function buscarCitas(dia: string, mes: string, hora: string, anyo: string, usuariocitado: string) {
//   return new Promise((resolve, reject) => {
//     // Construir la consulta SQL para buscar una cita específica en la tabla 'citas'
//     const query = `SELECT * FROM citas WHERE dia = '${dia}' AND mes = '${mes}' AND hora = '${hora}' AND anyo = '${anyo} 'AND usuariocitado =${usuariocitado}' `;

//     // Ejecutar la consulta utilizando el método 'all' de la base de datos
//     baseDatos.all(query, [], (error: any, citaExistente: any) => {
//       if (error) {
//         reject(error); // Si hay un error, rechazar la promesa con el error
//       } else if (citaExistente.length > 0) {
//         reject('Esta cita ya está ocupada'); // Si existe una cita, rechazar la promesa con un mensaje de error
//       } else {
//         resolve(true); // Si no hay citas existentes, resolver la promesa con 'true'
//       }
//     });
//   });
// }


// //mega codigo supremo // Endpoint para reservar una cita
// export async function reservarCita(request: Request, response: Response) {
//   const micita = request.body as Citar;
//   console.log('Solicitud recibida con los siguientes datos:', micita);

//   // Verificar si todos los campos necesarios están presentes y tienen un valor válido
//   if (
//     micita.anyo !== undefined &&
//     micita.mes !== undefined &&
//     micita.dia !== undefined &&
//     micita.hora !== undefined &&
//     micita.minutos !== undefined &&
//     micita.usuariocitado !== undefined
//   ) {
//     try {
//       // Convertir campos a cadena si es necesario
//       const anyoStr = micita.anyo.toString();
//       const mesStr = micita.mes.toString();
//       const diaStr = micita.dia.toString();
//       const horaStr = micita.hora.toString();
//       const minutosStr = micita.minutos.toString();
//       const usuariocitadoStr = micita.usuariocitado.toString();

//       // Verificar si el usuario existe usando logearusuario
//       const usuarioExistente = await logearusuario({
//         email: micita.email,
//         password: micita.password,
//       });

//       // Llamar a la función buscarCitas para verificar disponibilidad
//       await buscarCitas(anyoStr, mesStr, diaStr, horaStr, minutosStr);

//       // Insertar la cita en la base de datos
//       await insertarCita(micita);

//       console.log('Cita insertada correctamente');
//       response
//         .status(200)
//         .json({ message: 'Cita registrada correctamente' });
//     } catch (error) {
//       console.error('Error al procesar la solicitud:', error);
//       response.status(500).json({ error: 'Error interno del servidor'});
//     }
//   } else {
//     console.log('Solicitud incorrecta: falta algún campo requerido');
//     response
//       .status(400)
//       .json({ error: 'Solicitud incorrecta', message: 'Falta algún campo requerido' });
//   }
// }