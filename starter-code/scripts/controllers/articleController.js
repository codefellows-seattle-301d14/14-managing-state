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
  //articleController.loadById defines the articleData function which defines ctx.articles
  //as the passed in parameter article.  Then it invokes Article.findwhere, which queries the DB
  //for records that match the ctx.params.id and then invokes the articleData function that was just defined.
  //The articleData function takes the idname from the url path as an argument.
  //
  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //articleController.loadByAuthor defines the articleData function which defines ctx.articles
  //as the passed in parameter articlesByAuthor.  Then it invokes Article.findwhere, which queries the DB
  //for records that match the ctx.params.author and then invokes the articleData function that was just defined.
  //The articleData function takes the authorname from the url path as an argument.It then runs the articleController.index function.
  //
  //
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
  //articleController.loadByCategory defines the articleData function which defines ctx.articles
  //as the passed in parameter articlesInCategory.  Then it invokes Article.findwhere, which queries the DB
  //for records that match the ctx.params.categroyName and then invokes the articleData function that was just defined.
  //The articleData function takes the category name from the url path as an argument. It then runs the articleController.index function.
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This is only called when the user visits the home page.
  //This function checks to see if Article.allArticles has anything in it, if it does, it sets ctx.articles as Article.allArticles.
  //If Article.allArticles does not exists yet, it runs Article.fetchAll which is passed the articleData function.  Fetchall gets the data from the database and then runs the articleData callback.
  //The articleData callback sets ctx.articles to allArticles and then runs the articleController.index function.
  //
  //
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
