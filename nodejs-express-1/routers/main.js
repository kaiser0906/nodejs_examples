var dataPath = __dirname + '/../data/user.json';

module.exports = function(app, fs) {
  app.get('/', function(req, res) {
    var session = req.session;

    res.render('index', {
      title: 'My Homepage',
      length: 5,
      name: session.name,
      username: session.username,
    });
  });

  app.post('/login', function(req, res) {
    if (!req.body['username'] || !req.body['password']) {
      res.json({'success': 0, 'error': 'Invalid request.'});
      return;
    }

    var session = req.session;

    fs.readFile(dataPath, 'utf8', function(err, data) {
      var users = JSON.parse(data);
      var user = users[req.body['username']];

      if (!user) {
        res.json({'success': 0, 'error': 'User not found.'});
        return;
      }

      if (user.password == req.body['password']) {
        session.name = user.name;
        session.username = req.body['username'];
        res.redirect('/');
      }
      else {
        res.json({'success': 0, 'error': 'Username and password are invalid.'});
        return;
      }
    });
  });

  app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      }
      else {
        res.redirect('/');
      }
    });
  });

  app.get('/users', function(req, res) {
    fs.readFile(dataPath, 'utf8', function(err, data) {
      console.log(data);
      res.end(data);
    });
  });

  app.get('/users/:username', function(req, res) {
    fs.readFile(dataPath, 'utf8', function(err, data) {
      var users = JSON.parse(data);
      res.json(users[req.params.username]);
    });
  });

  app.post('/users', function(req, res) {
    var result = {};

    // Validation
    if (!req.body['username'] || !req.body['password'] || !req.body['name']) {
      res.json({'success': 0, 'error': 'Invalid request.'});
      return;
    }

    var username = req.body['username'];
    // load data
    var users = {};
    fs.readFile(dataPath, 'utf8', function(err, data) {
      users = JSON.parse(data);
      // Add the new data
      users[username] = req.body;
      fs.writeFile(dataPath, JSON.stringify(users, null, '\t'), 'utf8', function(err, data){
        res.json({'success': 1});
      });
    });
  });

  app.put('/users/:username', function(req, res) {
    fs.readFile(dataPath, 'utf8', function(err, data) {
      var users = JSON.parse(data);
      user = users[req.params.username];

      if (!user) {
        res.json({'success': 0, 'error': 'User not found'});
        return;
      }

      // Validation
      if (!req.body['password'] || !req.body['name']) {
        res.json({'success': 0, 'error': 'Invalid request.'});
        return;
      }

      users[req.params.username] = req.body;
      // Update data
      fs.writeFile(dataPath, JSON.stringify(users, null, '\t'), 'utf8', function(err, data) {
        res.json({'success': 1});
      });
    });
  });

  app.delete('/users/:username', function(req, res) {
    fs.readFile(dataPath, 'utf8', function(err, data) {
      var users = JSON.parse(data);
      user = users[req.params.username];

      if (!user) {
        res.json({'success': 0, 'error': 'User not found'});
        return;
      }

      delete users[req.params.username];
      // Update data
      fs.writeFile(dataPath, JSON.stringify(users, null, '\t'), 'utf8', function(err, data) {
        res.json({'success': 1});
      });
    });
  });
}

