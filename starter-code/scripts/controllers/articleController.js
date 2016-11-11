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
  /* Here we are defining the method of articleController called loadById. It takes in parameters of 'ctx' and 'next' which are an object and a callback function, respectively. Within the loadById function, we are declaring a variable called articleData which is a function and passing in parameter 'article'. Witin the articleData function, we are passing in a parameter called article and setting it equal to ctx.articles, a property of the ctx object. Then we are defining the invocation of the next() callback function. Once that is complete, we are invoking a method of the object constructor Article, findWhere, and passing in the string 'id', the ctx.params.id (reference to the current ctx.params.id. id is a property of params which is a property of the ctx object.), and articleData as a callback function.*/

  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /* Here we are defining the method of articleController called loadByAuthor. It takes in parameters of 'ctx' and 'next' which are an object and a callback function, respectively. Within the loadByAuthor function, we are declaring a variable called authorData which is a function and passing in parameter 'articlesByAuthor'. Witin the authorData function, we are passing in a parameter called articlesByAuthor and setting it equal to ctx.articles, a property of the ctx object. Then we are defining the invocation of the next() callback function. Once that is complete, we are running a method of the object constructor Article, findWhere, and passing in the string 'author', the ctx.params.authorName (reference to the current ctx.params.authorName. authorName is a property of params which is a property of the ctx object.), which we are invoking a replace method on, replacing any '+' with a space, and authorData as a callback function.*/
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
  /* Here we are defining the method of articleController called loadByCategory. It takes in parameters of 'ctx' and 'next' which are an object and a callback function, respectively. Within the loadBycategory function, we are declaring a variable called categoryData which is a function and passing in parameter 'articlesInCategory'. Witin the categoryData function, we are passing in a parameter called articlesInCategory and setting it equal to ctx.articles, a property of the ctx object. Then we are defining the invocation of the next() callback function. Once that is complete, we are running a method of the object constructor Article, findWhere, and passing in the string 'category', the ctx.params.categoryName (reference to the current ctx.params.categoryName. categoryName is a property of params which is a property of the ctx object.), and finally categoryData as a callback function.*/
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  /* Here we are defining the method of articleController called loadAll. It takes in parameters of 'ctx' and 'next' which are an object and a callback function, respectively. Within the loadAll function, we are declaring a variable called articleData which is a function and passing in parameter 'allArticles'. Then we are setting the property articles of ctx (ctx.articles) equal to the property allArticles of the constructor Article (Article.allArticles). Then we call for the invocation of the next() callback function we originally passed in to loadAll as a parameter. Once this definition is complete, we run an IF/ELSE statement. The logic of the IF/ELSE statement is such that if Article.allArticles.length exists, we are setting ctx.articles = Article.allArticles and invoking the next() callback function that was passed in as a paramter. Otherwise (if Article.allArticles.length does not exist), we are running Article.fetchAll (a method of the Article constructor) with articleData passed in as a callback function parameter. */
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
