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
  // 1. Declares an option variable which is set to an array of all the authors found in allArticles.
 // 2. The variable template is assigned to a handlebars compile method to prepare the option template for use with handlebars.
 // 3. The entire array is assigned to the options variable and mapping the array so that each index value(author) is pushed into the handlebars template, each as a value.
 // 4. The category filter is then populated in a similar fashion using the allCategories function call.
 // 5. The template for each category is then appended top the filter option element.
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
  // The handleFilters method ensures that the proper articles are loaded based on the selections made in the author and category filters
  // A handler is set up to be invoked when a change is registerd in either of the filter menus
  // the resource variable is set to the type of the filter being altered.
  // the next line then resets the opposite filter being changed to equal the empty string or default filter setting
  // page call using resource to enter the first parameter of the required URL being either author or category is then
  // concatenated with the value of the category or the author using a regex to replace spaces with the '+'
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

  // COMMENT: What does this method do?  What is it's execution path?
  //first we target the articles id. We specifically make this element appear,
 //then make all its siblings hide. We then target the article (which comes from a handlebars script)
 //which is nested inside the articles id and remove it.
 //the forEach function, cycles through the articles array and for each one,
 //appends a new article into the page.
 //then we call populateFilters - see description above
 //then we call handleFilters - see description above
 //lastly, we save space on the page by using conditional logic to check
 //how many elements (articles) exist. If there's more than one, then it gets truncated.
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
