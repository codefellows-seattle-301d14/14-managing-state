(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo =
      parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus =
      article.publishedOn ? 'published ' +
      article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //In this method the articleView object is defining the populateFilters as function. First we define a variable called options and template. We set template equal to the Handlebars method for compiling the option-template ID that is located in the index.html page. We load text into the template according to Handlebars expressions. Then we assign options to the result of mapping the Article.allAuthors method by returning the template set val key value to author which is passed in to the anonymous callback function passed into the map method. We then append the variable options to the author filter option listed on the index.html page. We know to append because we queried the DOM for #author-filter.

  //Now in the method the Article.allCategories object is running the allCategories function with an anonymous callback function passing in rows as a parameter and then appending into the ID category-filter option the result of of mapping rows which was passed in as a parameter running a callback function with a parameter of row that returns the template val key with value row.category.

  articleView.populateFilters = function() {
    var options;
    var template = Handlebars.compile($('#option-template').text());
    options = Article.allAuthors()
      .map(function(author) {
        return template({val: author});
      });
    $('#author-filter').append(options);

    Article.allCategories(function(rows) {
      $('#category-filter').append(
        rows.map(function(row) {
          return template({val: row.category});
        })
      );
    });
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This method articleView object is defining the function handleFilters which takes in no parameters and queries the filters ID and runs the jQuery method one with an event of change, the data parameter select, and a handler which is an anonymous function that defines resource as a variable equaling to this.id.replace('-filter', '') which replaces filter with an empty string. Then queries the parent element of this which is the parent element of #filters and sets the value of it's siblings children equal to an empty string. So then we are calling the page function and setting the URL to resource/this.val and replacing any whitespace with a plus sign.
  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      var resource = this.id.replace('-filter', '');
      $(this).parent().siblings().children().val('');
      page('/' + resource + '/' +
      // Replace any/all whitespace with a '+' sign
        $(this).val().replace(/\W+/g, '+')
      );
    });
  };
/* articleView.handleAuthorFilter = function() {
     $('#author-filter').on('change', function() {
       if ($(this).val()) {
         $('article').hide();
         $('article[data-author="' + $(this).val() + '"]').fadeIn();
       } else {
         $('article').fadeIn();
         $('article.template').hide();
       }
       $('#category-filter').val('');
     });
   };

   articleView.handleCategoryFilter = function() {
     $('#category-filter').on('change', function() {
       if ($(this).val()) {
         $('article').hide();
         $('article[data-category="' + $(this).val() + '"]').fadeIn();
       } else {
         $('article').fadeIn();
`        $('article.template').hide();
        }
       $('#author-filter').val('');
     });
   };

   DONE: Remove the setTeasers method,
    and replace with a plain ole link in the article template.
   articleView.setTeasers = function() {
     $('.article-body *:nth-of-type(n+2)').hide();

     $('#articles').on('click', 'a.read-on', function(e) {
       e.preventDefault();
       $(this).parent().find('*').fadeIn();
       $(this).hide();
     });
   }; */

  /* COMMENT: What does this method do?  What is it's execution path?
  we create a method of articleView called index that takes articles as a parameter. It then uses a jquery selector to get any element with the ID of articles and shows it but hides its siblings. it then remove any article element with the ID articles. It then loops through the articles array appending the resault of the render function given the argument of a to any elements with the articles ID. It then calls the poopulateFilters method and the handleFilters methon of the articleView object. Lastly if any article element with the ID of articles has a length greater than 1 hide everything after the first two elements in the class article-body.
  */
  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();

    $('#articles article').remove();
    articles.forEach(function(a) {
      $('#articles').append(render(a));
    });

    articleView.populateFilters();
    articleView.handleFilters();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  module.articleView = articleView;
})(window);
