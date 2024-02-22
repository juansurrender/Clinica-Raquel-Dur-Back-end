const http = require('http') 
const port = 1488 
  
// Create a server object: 
//Definimos una respuesta por defecto a cualquiera que se conecte a nuestro servidor
//Request (req) es lo que recibe nuestro servidor desde fuera (IP, credenciales, headers , cookies)
//Response (res) es lo que nosotros (el servidor) le vamos a dar de respuesta
//Esto si que se ejecuta de nuevo
const server = http.createServer(function (req, res) { 
  
    // Write a response to the client 
    res.write(' hola ffffffffffffffffffffffffill de puta ' + (+new Date())) 
  
    // End the response  
    res.end() 
}) 
  
// Set up our server so it will listen on the port 
//Configuración para que nuestro servidor escuche en un puerto en concreto
//Solo se ejecuta una vez, ya que es codigo de arranque, una vez arrancado, no se ejecuta de nuevo
server.listen(port, function (error) { 
  
    // Checking any error occur while listening on port 
    if (error) { 
        console.log('Something went wrong', error); 
    } 
    // Else sent message of listening 
    else { 
        console.log('Server is listening on port' + port); 
    } 
})