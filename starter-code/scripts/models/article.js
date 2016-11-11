(function(module) {
  function Article (opts) {
    Object.keys(opts).forEach(function(e, index, keys) {
      this[e] = opts[e];
    }, this);
  }

  Article.allArticles = [];

  Article.createTable = function(callback) {
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS articles (' +
        'id INTEGER PRIMARY KEY, ' +
        'title VARCHAR(255) NOT NULL, ' +
        'author VARCHAR(255) NOT NULL, ' +
        'authorUrl VARCHAR (255), ' +
        'category VARCHAR(20), ' +
        'publishedOn DATETIME, ' +
        'body TEXT NOT NULL);',
      callback
    );
  };

  Article.truncateTable = function(callback) {
    webDB.execute(
      'DELETE FROM articles;',
      callback
    );
  };

  Article.prototype.insertRecord = function(callback) {
    webDB.execute(
      [{
        'sql': 'INSERT INTO articles ' +
        '(title, author, authorUrl, category, publishedOn, body) ' +
        'VALUES (?, ?, ?, ?, ?, ?);',
        'data':
          [this.title,
           this.author,
           this.authorUrl,
           this.category,
           this.publishedOn,
           this.body],
      }],
      callback
    );
  };

  Article.prototype.deleteRecord = function(callback) {
    webDB.execute(
      [{
        'sql': 'DELETE FROM articles WHERE id = ?;',
        'data': [this.id]
      }],
      callback
    );
  };

  Article.prototype.updateRecord = function(callback) {
    webDB.execute(
      [{
        'sql': 'UPDATE articles SET '+
        'title = ?, ' +
        'author = ?, ' +
        'authorUrl = ?, ' +
        'category = ?, ' +
        'publishedOn = ?, ' +
        'body = ? ' +
        'WHERE id = ?;',
        'data':
          [this.title,
           this.author,
           this.authorUrl,
           this.category,
           this.publishedOn,
           this.body,
           this.id]
      }],
      callback
    );
  };

  Article.loadAll = function(rows) {
    Article.allArticles = rows.map(function(ele) {
      return new Article(ele);
    });
  };

  Article.fetchAll = function(callback) {
    console.log('Calls Article.fetchAll');
    webDB.execute(
      'SELECT * FROM articles ORDER BY publishedOn DESC',
        function(rows) {
          if (rows.length) {
            Article.loadAll(rows);
            callback();
          } else {
            $.getJSON('/data/hackerIpsum.json', function(rawData) {
              rawData.forEach(function(item) {
                var article = new Article(item);
                article.insertRecord();
              });
              webDB.execute(
                'SELECT * FROM articles ORDER BY publishedOn DESC',
                function(rows) {
                  Article.loadAll(rows);
                  callback();
                });
            });
          }
        });
  };

  Article.findWhere = function(field, value, callback) {
    webDB.execute(
      [{
        sql: 'SELECT * FROM articles WHERE ' + field + ' = ?;',
        data: [value]
      }],
      callback
    );
  };

  Article.allAuthors = function() {
    return Article.allArticles.map(function(article) {
      return article.author;
    })
    .reduce(function(names, name) {
      if (names.indexOf(name) === -1) {
        names.push(name);
      }
      return names;
    }, []);
  };

  Article.allCategories = function(callback) {
    webDB.execute('SELECT DISTINCT category FROM articles;', callback);
  };

  Article.numWordsAll = function() {
    return Article.allArticles.map(function(article) {
      return article.body.match(/\w+/g).length;
    })
    .reduce(function(a, b) {
      return a + b;
    });
  };

  Article.numWordsByAuthor = function() {
    return Article.allAuthors().map(function(author) {
      return {
        name: author,
        numWords: Article.allArticles.filter(function(article) {
          return article.author === author;
        })
        .map(function(a) {
          return a.body.match(/\w+/g).length;
        })
        .reduce(function(a, b) {
          return a + b;
        })
      };
    });
  };

  module.Article = Article;
})(window);
