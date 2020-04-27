var tmdb = {
    getOverview: function(tmdbID, overviewCallback) {}
};

( tmdb => {

    const API_KEY = "6648d088a16dd0ab9f95e42b6f7aa5d1";
    //https://api.themoviedb.org/3/movie/{movie_id}/translations?api_key=<<api_key>>
    tmdb.getOverview = function(tmdbID, overviewCallback) {
        if (!tmdbID) {
            overviewCallback("");
            return;
        }
            
        $.get(`https://api.themoviedb.org/3/movie/${tmdbID}/translations?api_key=${API_KEY}`, data => {
            console.log(data.translations[15]);
            var italian = data.translations.find(trans => { return trans.iso_3166_1 == "IT"; });
            overviewCallback (italian ? italian.data.overview : "");
        })
    }
})(tmdb);
