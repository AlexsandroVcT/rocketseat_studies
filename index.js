const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Alex", "email": "alexsandro.vct@outlook.com"}

const users = ['Alex', 'Anthony', 'Yury'];

// Metodo middleware, faz o log da nossa aplicação a cada requisição com tempo de execução de cada metodo
server.use((req, resw, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next(); //next() : Ele executará ou executará o código depois que toda a função de middleware for concluída .

  console.timeEnd('Request');
});

// novo middlaware local
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User bane us required' });
  }

  return next();
}

// middlaware servir para rootas que receber o usuario parametros
function checkUserInArray(req, res, next) {
  const user = users[req.params.index]
  if (!user) {
    return res.status(400).json({ error: 'User does not exists' })
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
})

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Deletando 1 usuario
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});



server.listen(3000);