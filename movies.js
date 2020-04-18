var movies = {
    showMore : function() {},
    search : function(filter) {}
};

var moviesGallery = {
    PAGESIZE : 12,
    ROWSIZE: 4, 
    currMovie : 0,
    showMovie : function(movie) {},
    restart : function() {},
    noMore : function() {},
    showLoading: function(show) {}
};

( moviesGallery => {

    moviesGallery.showMovie = function(movie) {
        if (moviesGallery.currMovie % moviesGallery.ROWSIZE == 0) {
            var galleryRow = $($('#gallery-row-template').html());
            currRowId = "gallery-row-" + (moviesGallery.currMovie / moviesGallery.ROWSIZE);
            galleryRow.attr("id", currRowId);
            $("#moviesGallery").append(galleryRow);
        }
        $("#" + currRowId).append(
            utils.render($('#movie-template').html(), {
                title: movie.indexTitle, 
                year: movie.year ? movie.year : "", 
                poster: movie.poster ? utils.remoteURL(movie.poster.name) : "images/no-movie-poster.jpg",
                alt: movie.poster ? movie.poster.description : "nessuna immagine"
            }));
        moviesGallery.currMovie++;
        if (moviesGallery.currMovie >= moviesGallery.PAGESIZE)
            $("#moreButton").show();
    }

    moviesGallery.noMore = function() {
        $("#moreButton").hide();
    }

    moviesGallery.showLoading = function(show) {
        if (show) 
            $("#loading").show(); 
        else 
            $("#loading").hide();
    }

    moviesGallery.restart = function() {
        currRowId = null;
        moviesGallery.currMovie = 0;
        $("#moviesGallery")[0].innerHTML = "";
        $("#moreButton").hide();
    }

    moviesGallery.restart();

})(moviesGallery);
  
( movies => {

    var fullMoviesList = [];
    var moviesList = fullMoviesList;

    function loadNextPage(lastLoaded) {
        const moviesRef = database.ref().child('movies').orderByChild('indexTitle').startAt(lastLoaded).limitToFirst(moviesGallery.PAGESIZE + 1);
        moviesRef.once("value", snap => {
            snap.forEach( movieSnap => {
                var movie = movieSnap.val();
                if (movie.indexTitle == lastLoaded)
                    return;
                movie.cast = null;
                moviesList.push(movie);                    
                lastLoaded = movie.indexTitle;
            });
            if (snap.numChildren() == moviesGallery.PAGESIZE + 1)
                loadNextPage(lastLoaded);
            else
                moviesGallery.showLoading(false);
        });
    }

    var database = firebase.database();
    const movieRef = database.ref().child('movies').orderByChild('indexTitle').limitToFirst(moviesGallery.PAGESIZE);
    moviesGallery.showLoading(true);
    movieRef.once("value", snap => {
        var lastLoaded = null;
        snap.forEach( movieSnap => {
            var movie = movieSnap.val();
            movie.cast = null;
            moviesList.push(movie);
            moviesGallery.showMovie(movie);
            lastLoaded = movie.indexTitle;
        });
        loadNextPage(lastLoaded);
    })
  
    movies.showMore = function() {
        var startMovie = moviesGallery.currMovie; 
        for (m = startMovie; m < startMovie + moviesGallery.PAGESIZE; m++) {
            if (m >= moviesList.length) {
                moviesGallery.noMore();
                break;
            }
            moviesGallery.showMovie(moviesList[m]);
        }
    }

    movies.search = function(filter) {
        var a = filter;
        if (filter == "") return;

        moviesList = fullMoviesList.filter( movie => {
            return movie.indexTitle.toUpperCase().includes(filter.toUpperCase()); 
        }); 
        moviesGallery.restart();
        movies.showMore();
    } 
    
})(movies);