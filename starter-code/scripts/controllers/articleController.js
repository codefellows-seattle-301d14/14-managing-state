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
  // 1. loadById brings in the value of the ID passed in the URL in the ctx.params variable
  // 2. it then loads articleData as a function but does not imediately run it
  // 3. The id is then passed to the article.findwhere method which is a SQL search
  //  function that returns the article with the matching id
  // 4. article.findwhere then calls articleData as its call back function which
  //  creates a new attribute in the ctx object called article with the actual
  //  article as its value.
  // 5. loadById then calls the next function which in this scenario is the
  //  articleController.index to make sure that it is a valid article and if it is
  //  not then it goes to the top of the page

  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //this function works basically the same way as .loadById() except that in this case
  //this function only fires when the author is searched for in the url. If the author name
  //does not exist in our database, then the user is directed back to the root directory.
 //if, however, the author name is found, then their articles are loaded
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
  // 1. loadByCategory loads brings in the desired category via the url and then
  // passes that information to the findwhere function that matches the incoming
  // parameter with the category attribute in the SQL database.
  // 2. This function acts like the loadbyID function except uses categorys instead.
  // 3. The ctx object will hold an array of all articles with the matching category.
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // loadAll first sets up articledata as a function but does not call it
  // it then checks to see if there are articles in the allArticles variable.
  // if there is articles its sets the ctx articles to all articles
  // if there are no articles it runs fetchAll with the articleData function as the call back
  // once the data is loaded by fetchAll, ctx is then set to all articles.
  // This function is the function called if the above functions failed to find
  // valid articles.
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
