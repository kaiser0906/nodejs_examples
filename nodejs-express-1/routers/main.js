var uuid = require('uuid/v1');
var dataPath = __dirname + '/../data/user.json';

module.exports = function(app, fs) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: 'My Homepage',
      length: 5,
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
    var username = uuid().toString();

    // Validation
    if (!req.body['password'] || !req.body['name']) {
      res.json({'success': 0, 'error': 'Invalid request.'});
      return;
    }

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

