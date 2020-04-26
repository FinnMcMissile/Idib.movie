var movies = {
    search : function(filter) {},
    clearFilter: function() {},
    openMovie: function(movieSource) {}
};

( movies => {

    $(document).ready(() => {
        $("#filter").val("");
    });

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

    movies.openMovie = function(movieSource) {
        console.log("open movie "+ movieSource);
        window.location = "movie-page.html?movieSource=" + movieSource;
    }

    function loadNextPage(lastLoaded) {
        const moviesRef = database.ref().child('movies').orderByChild('indexTitle').startAt(lastLoaded).limitToFirst(moviesGallery.PAGESIZE + 1);
        moviesRef.once("value", snap => {
            snap.forEach( movieSnap => {
                var movie = movieSnap.val();
                if (movie.indexTitle == lastLoaded)
                    return;
                movie.cast = null;
                fullMoviesList.push(movie);                    
                lastLoaded = movie.indexTitle;
            });
            if (snap.numChildren() == moviesGallery.PAGESIZE + 1)
                loadNextPage(lastLoaded);
            else
                moviesGallery.showLoading(false);
        });
    }

    var additionalData = [];
    var fullMoviesList = [];
    var moviesList = fullMoviesList;
    var moviesGallery = new Gallery({
        idGalleryHost: "#moviesGallery",
        renderItem: (movie) => {
            var addData = additionalData.find(data => { return data.source == movie.source; });
            if (addData != null) {
                $.extend(true, movie, addData);
                movie.cast = null;
            }
            return utils.render($('#movie-template').html(), {
                title: movie.indexTitle, 
                year: movie.year ? movie.year : "", 
                poster: movie.poster ? utils.remoteURL(movie.poster.name) : "images/no-movie-poster.jpg",
                alt: movie.poster ? movie.poster.description : "nessuna immagine",
                source: movie.source,
                objectFit: movie.poster && movie.poster.objectFitUnset ? "object-fit: unset;" : ""
            });            
        }
    });

    var database = firebase.database();

    database.ref("additionalData/movies").once("value", addDataSnap => {
        additionalData = addDataSnap.val();
    });

    const movieRef = database.ref().child('movies').orderByChild('indexTitle').limitToFirst(moviesGallery.PAGESIZE);
    moviesGallery.showLoading(true);
    movieRef.once("value", snap => {
        var lastLoaded = null;
        snap.forEach( movieSnap => {
            var movie = movieSnap.val();
            movie.cast = null;
            fullMoviesList.push(movie);
            lastLoaded = movie.indexTitle;
        });
        moviesGallery.refresh(moviesList);
        loadNextPage(lastLoaded);
    })
  
})(movies);