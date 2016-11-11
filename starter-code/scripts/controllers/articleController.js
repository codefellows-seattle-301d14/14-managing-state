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
  // This is being called as a callback function from page() in routes.js.
  // It is invoked when the read-on button is clicked on any article.
  // The arguments ctx and next are '/article/:id' and articleController.index respectively.
  // It declares a new function, articleData, which takes the parameter article and stores it to ctx.articles.
  // The 'next' function invokes articleController.index, which is the second callback function in the routes.js file.
  // articleData is called as a callback to Article.findWhere().
  // Article.findWhere also takes in 'id' and the id (stored in ctx.params).
  // Article.findWhere eliminates all artiles in articleData that don't have the id contained in ctx.params.id.
  articleController.loadById = function(ctx, next) {
    console.log('loadById invoked');
    var articleData = function(article) {
      ctx.articles = article;
      console.log(ctx.articles);
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This is being called as a callback function from page() in routes.js.
  // It is invoked when the articles are filtered by author.
  // The arguments ctx and next are '/author/:authorName' and articleController.index respectively.
  // It declares a new function, authorData, which takes the parameter articlesByAuthor and stores it to ctx.articles.
  // The 'next' function invokes articleController.index, which is the second callback function in the routes.js file.
  // authorData is called as a callback to Article.findWhere().
  // Article.findWhere also takes in 'author' and authorName (stored in ctx.params).
  // Article.findWhere eliminates all artiles in articleData that weren't written by the author in ctx.params.authorName.
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
  // This is being called as a callback function from page() in routes.js.
  // It is invoked when the articles are filtered by category.
  // The arguments ctx and next are '/category/:categoryName' and articleController.index respectively.
  // It declares a new function, categoryData, which takes the parameter articlesInCategory and stores it to ctx.articles.
  // The 'next' function invokes articleController.index, which is the second callback function in the routes.js file.
  // categoryData is called as a callback to Article.findWhere().
  // Article.findWhere also takes in 'category' and categoryName (stored in ctx.params).
  // Article.findWhere eliminates all artiles in articleData that don't belong in the category in ctx.params.categoryName.
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This is being called as a callback function from page() in routes.js.
  // It is invoked when the home button is clicked.
  // The arguments ctx and next are '/' and articleController.index respectively.
  // It declares a new function, articleData, which stores Article.allArticles to ctx.articles.
  // The 'next' function invokes articleController.index, which is the second callback function in the routes.js file.
  // articleData is called as a callback to Article.fetchAll() as long as there are no articles already stored in allArticles.
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
