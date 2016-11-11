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
  /*Populate filters is invoked by articleView.index, it takes no arguments.  the variable options is set equal to the array of allAuthors over which the .map method is called to use the Handlebars #options-template, given the object {val: author}, effectively stuffing the rendered templates for each author name back into the options array.  Then, it appends the rendered HTML from the options array to #author-filter.

  Next, it calles allCategories method on the Article method and passes an anonymous function with rows as a parameter.  The anonymous function appends to #category-filter the contents of the rows array, after the Handlebars template has been mapped over the contents of rows.

  Article.allCategories uses webDB to select all distinct categories from the SQL databse, and passes that into the callback function described above (becoming the rows array).*/

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

  /*  handleFilters is invoked by articleView.index.  It takes no arguments.  It selects the unordered list with the id "filters" and invokes the .one method on it.  .one attaches an event handler to an event for the elements.  The handler is execture at most once per element per event type.  In this case, 'change' and 'select' are the events.  It invokes as a handler an anonymous callback function.

  this represents the selection of the dropdown menu and all of its contents.

  The event handler decelares as a variable resource, which is a string representing whichever dropdown menu is selected.  It strips the '-filter' portion of its id.  (e.g. author-filter becomes author).

  Following declaration for resouce, the val of the sibling list is set to an empty string - clearing that selection.

  Finally, a route set up a url built out of the resource variable (author or category) + a regex expression that replaces all white space with + signs.
    */
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

  // COMMENT: What does this method do?  What is it's execution path.
  /*articleView.index takes as an argument the array of article objects.  It first selects the section with id "articles," shows it, selects the siblings, and hides all of them.

  Next, it finds all article elements in the section with id "article" and removes them. Then, using a forEach method on the array of articles, it appends to the #articles section by calling render on the article object (represented as 'a').

  Next, it calls two methods on the articleView object: populateFilters and handleFilters.

  Finally, a conditional statement tests if there are more than one article.  If true, it will hide a portion of every article body.
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
