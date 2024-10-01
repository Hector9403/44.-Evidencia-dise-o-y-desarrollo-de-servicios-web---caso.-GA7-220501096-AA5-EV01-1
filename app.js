const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const puerto = 3000;

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'logindb'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function(request, response) {
	try {
		// Si es usuario es autenticado
		if (request.session.loggedin) {
			// Output username
			response.send('¡Bienvenido, ' + request.session.username + '!');
		} else {
			// Lo llevará a la pagina de logeo
			response.sendFile(path.join(__dirname + '/login.html'));
		}
	} catch (error) {
		return res.status(500).send({ message: error.message });
	}
});

// http://localhost:3000/login
app.post('/login', function(request, response) {
	// Capturar la entrada de los campos de request
	let username = request.body.usuario;
	let password = request.body.password;
	// Están vacios los campos entonces?
	if (username && password) {
		// Ejecute una consulta SQL que seleccionará la cuenta de la base de datos en función del nombre de usuario y la contraseña especificados
		connection.query('SELECT * FROM usuarios WHERE usuario = ? AND password = ?', [username, password], function(error, results, fields) {
			// Si hay un problema con la consulta, genere el error
			if (error) throw error;
			//Si existe el usuario entonces
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				// Redirecciona a pagina home
				response.redirect('/home');
			} else {
				response.send('Usuario y/o contraseña incorrecta!');
			}			
			response.end();
		});
	} else {
		response.send('¡Por favor ingrese usuario y contraseña!');
		response.end();
	}
});

app.get('/login', function(request, response) {
	// Si no es autenticado redireciona a la pagina de home
	if (!request.session.loggedin) {
		response.send("Por favor inicie sesión en la página de inicio");
	} else {
		response.redirect('/home');
	}
	response.end();
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// Si es usuario es autenticado
	if (request.session.loggedin) {
		// Da la bienvenida al usario logeado
		response.send('¡Bienvenido, ' + request.session.username + '!');
	} else {
		// Usuario no autenticado
		response.send('Por favor inicie sesión en la página de login');
	}
	response.end();
});

// http://localhost:3000/
app.get('/logout', function(request, response) {
	request.session.loggedin = false;
	request.session.username = null;
	//enviar mensaje JSON como respuesta
    response.json("¡Ha terminado la sesión!");
	response.end();
});

// Una vez definidas nuestras rutas podemos iniciar el servidor
app.listen(puerto, err => {
    if (err) {
        // Aquí manejar el error
        console.error("Error escuchando: ", err);
        return;
    }
    // Si no se detuvo arriba con el return, entonces todo va bien ;)
    console.log(`Escuchando en el puerto :${puerto}`);
});

// http://localhost:3000/login
app.post('/crear', function(request, response) {
	// Capturar la entrada de los campos de request
	let username = request.body.usuario;
	let password = request.body.password;
	let email = request.body.email;
	
	// Están vacios los campos entonces?
	if (username && password) {
		// Ejecute una consulta SQL que seleccionará la cuenta de la base de datos en función del nombre de usuario y la contraseña especificados
		var sql = 'INSERT INTO usuarios ( usuario, password, email) VALUES (?)';
		let todos = [username,password, email];
		connection.query( sql, [ todos] , function (error, result) {
			// Si hay un problema con la consulta, genere el error
			if (error) throw error;
 			//Si existe el usuario entonces
			 console.log("1 record inserted");		
			 console.log('Todo Id:' + result.insertId);

			response.end();
	});
	} else {
		response.send('¡Por favor ingrese usuario , contraseña y correo!');
		response.end();
	}
});