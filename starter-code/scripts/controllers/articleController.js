(function(module) {
  var articleController = {};

  Article.createTable();

  articleController.index = function(ctx, next) {
    if(ctx.articles.length) {
      articleView.index(ctx.articles);
    } else {
      page('/');
    }
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /*loadById takes as parameters the context object (ctx) and the next function to be called in the routing path (in this case is articleController.index) and is a part of the /article/:id route path.

articleData is a callback function used by Article.findWhere.  It sets the articles property of the ctx object equal to an instance of article, and then invokes the next() function (in this case articleController.index).

  Article.findWhere is a method that performs a SQL query given a FIELD (row) and value (in this case the value of the id property of the ctx.params object) and then runs a callback function on the result.

  In summary, this method loads a specific article, by ID.  It uses a SQL query to find the specific article for a given ID and then sets the context property article equal to that article object.

  The next function is articleController.index which will take whatever contents there are of ctx.article and pass them to articleView.Index to be rendered onto the page.*/

  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?

  /*This method functions similarly to loadById, only it loads articles by author.  However, before passing the query (author's name) to findWhere, it removes any + signs from the string. */
  articleController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere(
      'author', ctx.params.authorName.replace('+', ' '), authorData
    );
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /*loadByCategory functions similiarly to the above functions, except that it filters by category. */
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /* this function effectively loads ALL articles in the ctx.Articles object and passes them to the articleController.index rendering path.

  HOWEVER, it conditionally checks whether or not the Article.allArticles array has any articles loaded into it.  If it does not, it calls Article.fetchAll, passing the articleData callback function, in order to load all the articles from the database.  Article.fetchAll checks to see if the SQL table has been populated.  If it has, it passes the article data to the callback function, if not, it loads the data from the database and creates the webDB sql table, then calls loadAll, and calls the callback function. */
  articleController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.allArticles;
      next();
    };

    if (Article.allArticles.length) {
      ctx.articles = Article.allArticles;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };

  module.articleController = articleController;
})(window);
