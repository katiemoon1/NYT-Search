var constUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=58edeee9afb949229c74f486b382b762";

$('#clear').click(function() {
    $('#search-term').empty();
    $('#records').empty();
    $('#end-year').empty();
    $('#start-year').empty();
})

$('#search').click(function(evt) {
    evt.preventDefault();

    $('#article').empty();                          // get rid of existing articles
    $('#search-term').removeClass('input-error');   // remove red border from any past errors
    $('#records').removeClass('input-error');
    

    var url = constUrl;
    var numberOfRequests = 1;
    var remainderRequests = 0;
    var error = false;  // is set to true if there are any input errors

    // append the search term to the url
    if ( $('#search-term').val() ) {
        url += '&q=' + $('#search-term').val();
    }
    else {
        $('#search-term').addClass('input-error');
        error = true;
    }

    // append the number of records to be returned
    if ( $('#records').val() ) {
        // divide by 10 because each request will return 10 articles
        numberOfRequests = Math.ceil(parseFloat($('#records').val()) / 10);
        remainderRequests = parseFloat($('#records').val()) % 10;

    }
    else {
        $('#records').addClass('input-error');
        error = true;
    }


    // append start and end dates if applicable
    if ( $('#start-year').val() ) 
        url += '&begin_date=' + $('#start-year').val();
    
    if ( $('#end-year').val() ) 
        url += '&end_date=' + $('#end-year').val();


    // get out of the click function before calling the ajax request if there are any errors
    if (error)
        return; 
    
    // run the ajax request
    $.ajax({
        url: url,
        method: 'GET',
        }).done(function(result) {

            var response = result.response.docs;
            var headline = '', 
                byline = '',
                url = '', 
                snippet = '',
                image = '',
                baseImageUrl = 'https://www.nytimes.com/'; // base url for NYT

                console.log(result);


            for (var j = 0; j < parseInt($('#records').val()); j++) {
                // reset all variables for each loop
                headline = ''; 
                byline = '';
                url = '';
                snippet = '';
                image = '';

                
                if (response[j].multimedia.length)
                    image = "<img class='article-image' src=" + baseImageUrl + response[j].multimedia[0].url + ">";

                if (response[j].headline.main)
                    headline = "<h2>" + response[j].headline.main + "</h2>";

                if (response[j].byline)
                    byline = "<p>" + response[j].byline.original + "</p>"; 

                if (response[j].web_url)
                    url = "<a href=" + response[j].web_url + " >Link to article</a>";

                if (response[j].snippet)
                    snippet = "<p>" + response[j].snippet + "</p>";

                $('#article').append(
                    image +
                    headline + 
                    byline +
                    url +
                    snippet +
                    "<hr>"
                );
            }
            
        }).fail(function(err) {
            throw err;
    });
    
})
    

    