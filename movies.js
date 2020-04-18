var movies = {
    search : function(filter) {},
    clearFilter: function() {}
};

( movies => {

    movies.search = function(filter) {
        if (filter == "") return;

        moviesList = fullMoviesList.filter( movie => {
            return movie.indexTitle.toUpperCase().includes(filter.toUpperCase()); 
        }); 
        moviesGallery.refresh(moviesList);
        $("#search").hide();
        $("#clearFilter").show();
    } 

    $("#clearFilter").hide();
    movies.clearFilter = function() {
        moviesList = fullMoviesList;
        $("#search").show();
        $("#clearFilter").hide();
        $("#filter").val("");
        moviesGallery.refresh(moviesList);
    }

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

    var fullMoviesList = [];
    var moviesList = fullMoviesList;
    var moviesGallery = new Gallery({
        idGalleryHost: "#moviesGallery",
        renderItem: (movie) => {
            return utils.render($('#movie-template').html(), {
                title: movie.indexTitle, 
                year: movie.year ? movie.year : "", 
                poster: movie.poster ? utils.remoteURL(movie.poster.name) : "images/no-movie-poster.jpg",
                alt: movie.poster ? movie.poster.description : "nessuna immagine"
            });            
        }
    });

    var database = firebase.database();
    const movieRef = database.ref().child('movies').orderByChild('indexTitle').limitToFirst(moviesGallery.PAGESIZE);
    moviesGallery.showLoading(true);
    movieRef.once("value", snap => {
        var lastLoaded = null;
        snap.forEach( movieSnap => {
            var movie = movieSnap.val();
            movie.cast = null;
            moviesList.push(movie);
            lastLoaded = movie.indexTitle;
        });
        moviesGallery.refresh(moviesList);
        loadNextPage(lastLoaded);
    })
  
})(movies);