var getUrl = function(url) {
  return '/api/v1' + url;
}


module.exports = function(app, Book) {
  // Get all books
  app.get(getUrl('/books'), function(req, res) {
    Book.find(function(err, items) {
      if (err) {
        console.log(err);
        return res.status(500).json({error: 'DB failure.'});
      }
      res.json(items);
    });
  });

  // Get a book
  app.get(getUrl('/books/:book_id'), function(req, res) {
    Book.findOne({'_id': req.params.book_id}, function(err, item) {
      if (err) {
        console.log(err);
        return res.status(500).json({error: 'DB failure.'});
      }
      if (!item) return res.status(404).json({error: 'Book not found.'});
      res.json(item);
    });
  });

  // Create a book
  app.post(getUrl('/books'), function(req, res) {
    var book = new Book();
    book.title = req.body.title;
    book.author = req.body.author;
    book.published_at = req.body.published_at;

    book.save(function(err) {
      if (err) {
        console.log(err);
        res.json({success: 0});
        return;
      }

      res.json({success: 1});
    })
  });

  // Update a book
  app.put(getUrl('/books/:book_id'), function(req, res) {
    Book.update({'_id': req.params.book_id}, {$set: req.body}, function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({error: 'DB failure.'});
      }
      console.log(result);
      if (!result.n) return res.status(404).json({error: 'Book not found.'});
      res.json({success: 1});
    });
  });

  // Delete a book
  app.delete(getUrl('/books/:book_id'), function(req, res) {
    Book.remove({'_id': req.params.book_id}, function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({error: 'DB failure.'});
      }
      res.status(204).end();
    });
  });

  // Get books by an author
  app.get(getUrl('/authors/:author_id/books'), function(req, res) {
    Book.find({'author._id': req.params.author_id}, function(err, items) {
      if (err) {
        console.log(err);
        return res.status(500).json({error: 'DB failure.'});
      }
      res.json(items);
    });
  });
};