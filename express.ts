import { baseDatos } from "./conection-sqlite";
import { Request, Response, query } from "express";
import { Confirmacion, Login, Register, Citar } from "./models";
import {
  buscarUsuario,
  insertarUsuario,
  logearusuario,
} from "./usuario.service";
import {
  buscarCita,
  getCitaPorMesYUsuario,
  obtenerDiasOcupadosDelMes,
  obtenerCitahoraDiasOcupadosDelMes,
  obtenerCitahoraDiasidOcupadosDelMes,
  insertarConfirmacion,
  insertarCita,
  obtenerCitahoraDiasidOcupadosDelMesnoUsuario

} from "./cita.service";
import { getCitaPorDiaYUsuario } from "./cita.service";
import { getCitaPorHoraYUsuario } from "./cita.service";
import { getCitaPorMinutosYUsuario } from "./cita.service";
import { request } from "http";



const express = require("express");
//es requerido para cargar el contenido del fichero .env y las variables dentro de este
//asignarlas al process.env.*
const dotenv = require("dotenv");
//import dotenv from "dotenv"; Otra forma de importar librerias/dependencias aunque dependerá de nuestra configuración de proyecto
dotenv.config();
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json()); // Middleware para parsear JSON en solicitudes POST
// Otros middlewares y configuraciones
const cors = require("cors");
app.use(cors());

const port = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
  response.send("¡Hola, mundo!");
});

app.post("/login", async (request: Request, response: Response) => {
  const mibody = request.body as Login;
  if (!!mibody.email && !!mibody.password) {
    try {
      const objetoUsuario = await logearusuario(mibody);
      response.status(200).send(objetoUsuario);
    } catch (error) {
      response.status(500).send(error);
    }
  } else {
    response.status(400).send("usuario o contraseña incorrecto");
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

app.post("/register", async (request: Request, response: Response) => {
  const miRegister = request.body as Register;
  if (
    miRegister.nombre &&
    !!miRegister.apellido &&
    !!miRegister.email &&
    !!miRegister.password
  ) {
    try {
      await buscarUsuario(miRegister.email);
      const mensaje = await insertarUsuario(miRegister);
      response.status(200).send(mensaje);
    } catch (error) {
      response.status(500).send(error);
    }
  } else {
    response.status(400).send("Falta algún campo requerido");
  }
});

// app.post(
//   "/confirmacionreserva",
//   async (request: Request, response: Response) => {
//     const confirmacioDeReserva = request.body as Confirmacion;
//     if (
//       !!confirmacioDeReserva.anyo &&
//       !!confirmacioDeReserva.mes &&
//       !!confirmacioDeReserva.dia &&
//       !!confirmacioDeReserva.hora &&
//       !!confirmacioDeReserva.minutos &&
//       !!confirmacioDeReserva.usuariocitado
//     ) {
//       try {
//         const listaCitas = (await buscarCita(
//           confirmacioDeReserva.dia,
//           confirmacioDeReserva.mes,
//           confirmacioDeReserva.anyo,
//           confirmacioDeReserva.hora,
//         )) as Array<any>;
//         if (listaCitas.length != 0)
//           return response.status(400).send("Ya existe una cita cogida!");
//         await insertarConfirmacion(confirmacioDeReserva);
//         return response.status(200).send(true);
//       } catch (error) {
//         return response.status(500).send(error);
//       }
//     } else {
//       return response.status(400).send("Falta algún campo requerido");
//     }
//   }
// );



app.get(
  "/citas/pormes/:anyo/:mes/:idUsuario",
  async (request: Request, response: Response) => {
    const mes = request.params.mes;
    const anyo = request.params.anyo;
    const idUsuario = request.params.idUsuario;
    if (!!mes && !!idUsuario && !!anyo) {
      try {
        const citasDelUsuarioActualDelMesActual = await getCitaPorMesYUsuario(
          Number(mes),
          Number(anyo),
          Number(idUsuario)
        );
        response.status(200).send(citasDelUsuarioActualDelMesActual);
      } catch (error) {
        response.status(500).send(error);
      }
    } else {
      response.status(400).send("Falta algún campo requerido");
    }
  }
);

app.get(
  "/citas/pordia/:anyo/:mes/:dia/:idUsuario",
  async (request: Request, response: Response) => {
    const mes = request.params.mes;
    const anyo = request.params.anyo;
    const dia = request.params.dia;
    const idUsuario = request.params.idUsuario;
    if (!!dia && !!idUsuario) {
      try {
        const citasDelUsuarioActualDelDiaActual = await getCitaPorDiaYUsuario(
          Number(dia),
          Number(mes),
          Number(anyo),
          Number(idUsuario)
        );
        response.status(200).send(citasDelUsuarioActualDelDiaActual);
      } catch (error) {
        response.status(500).send(error);
      }
    } else {
      response.status(400).send("Falta algún campo requerido");
    }
  }
);

app.get(
  "/citasocupadasmes/:anyo/:mes",
  async (request: Request, response: Response) => {
    const mes = request.params.mes;
    const anyo = request.params.anyo;
    if (!!anyo && !!mes) {
      try {
        const diasOcupadosDelMes = await obtenerDiasOcupadosDelMes(
          Number(mes),
          Number(anyo)
        );
        return response.status(200).send(diasOcupadosDelMes);
      } catch (error) {
        return response.status(500).send(error);
      }
    } else {
      response.status(400).send("Falta algún campo requerido");
    }
  }
);



app.get(
  "/citas/porhora/:hora/:idUsuario",
  async (request: Request, response: Response) => {
    const hora = request.params.hora;
    const idUsuario = request.params.idUsuario;
    if (!!hora && !!idUsuario) {
      try {
        const citasDelUsuarioActualHoraActual = await getCitaPorHoraYUsuario(
          Number(hora),
          Number(idUsuario)
        );
        response.status(200).send(citasDelUsuarioActualHoraActual);
      } catch (error) {
        response.status(500).send(error);
      }
    } else {
      response.status(400).send("Falta algún campo requerido");
    }
  }
);

app.get(
  "/citas/porminutos/:minutos/:idUsuario",
  async (request: Request, response: Response) => {
    const minutos = request.params.minutos;
    const idUsuario = request.params.idUsuario;
    if (!!minutos && !!idUsuario) {
      try {
        const citasDelUsuarioActualMinutosActual =
          await getCitaPorMinutosYUsuario(Number(minutos), Number(idUsuario));
        response.status(200).send(citasDelUsuarioActualMinutosActual);
      } catch (error) {
        response.status(500).send(error);
      }
    } else {
      response.status(400).send("Falta algún campo requerido");
    }
  }
);


app.get(
  "/citasocupadasmesdiahora/:anyo/:mes/:dia/:hora/:idUsuario",
  async (request: Request, response: Response) => {
    const mes = request.params.mes;
    const anyo = request.params.anyo;
    const dia = request.params.dia;
    const hora = request.params.hora;
    const idUsuario = request.params.idUsuario;
    
    if (!!anyo && !!mes && !!dia &&  !!hora && !!idUsuario ) {
      try {
        const diasOcupadosDelMes = await obtenerCitahoraDiasidOcupadosDelMes(
          Number(mes),
          Number(anyo),
          Number(dia),
          Number(hora),
          Number(idUsuario)

        );
        return response.status(200).send(diasOcupadosDelMes);
      } catch (error) {
        return response.status(500).send(error);
      }
    } else {
      response.status(400).send("Falta algún campo requerido");
    }
  }
);
app.get(
  "/citasocupadassinUsuario/:anyo/:mes/:dia/:hora",
  async (request: Request, response: Response) => {
    const mes = request.params.mes;
    const anyo = request.params.anyo;
    const dia = request.params.dia;
    const hora = request.params.hora;
   
    
    if (!!anyo && !!mes && !!dia &&  !!hora  ) {
      try {
        const diasOcupadosDelMesnoUsuario = await obtenerCitahoraDiasidOcupadosDelMesnoUsuario(
          Number(mes),
          Number(anyo),
          Number(dia),
          Number(hora),

        );
        return response.status(200).send(diasOcupadosDelMesnoUsuario);
      } catch (error) {
        return response.status(500).send(error);
      }
    } else {
      response.status(400).send("Falta algún campo requerido");
    }
  }
);


app.post("/buscarcita", async (request: Request, response: Response) => {
  const Cita = request.body as Citar;
  if (
    Cita.dia &&
    !!Cita.mes &&
    !!Cita.anyo &&
    !!Cita.hora &&
    !!Cita.idUsuario
  ) {
    try {
      await buscarCita(Cita.dia,Cita.hora,Cita.mes,Cita.anyo );
      const mensaje = await insertarCita(Cita);
      response.status(200).send(mensaje);
    } catch (error) {
      response.status(500).send(error);
    }
  } else {
    response.status(400).send("Falta algún campo requerido");
  }
});






app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});



