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
  // laodByID is being called on routes.js when the read on of an article is clicked.
  // loadById is setting the current article object to the variable articleData.
  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // Defines the callback function and sets varibales.
  // It then calls Article.findWhwere,
  // which finds the article with the matching author.
  // It then calls authorData, which loads the articles by author name
  // (based on the params.authorName).
  // It also replaces the plus sign with a space to hand off to the SQL.
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
  // Defines the callback function and sets varibales.
  // It then calls Article.findWhwere,
  // which finds the article with the matching category name.
  // It then calls categoryData, which loads the articles by category name.
  // (based on the params.categoryName).
  // The next calls articleController.index, which renders the selected articles
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // On index page load, runs loadAll first.
  // Fetches the data and calls articleData,
  // which sets the ctx.articles to Article.allArticles,
  // and calls next (articleController.Index from routes.js page)
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
