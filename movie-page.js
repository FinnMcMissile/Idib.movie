var moviePage = {
};

( moviePage => {

    var movieKey  = utils.extractParamFromQueryString(location.search.substring(1), "movieKey");    
    console.log("opened movie "+ movieKey);

    var database = firebase.database();

    movieRef = database.ref().child(`movies/${movieKey}`);
    movieRef.once("value", snap => {
        movie = snap.val();
        utils.showFormData({
            title: movie.italianTitle,
            director: movie.director,
            year: movie.year,
            poster: movie.poster ? utils.remoteURL(movie.poster.name) : "images/no-movie-poster.jpg",
            posterDescription: movie.poster ? movie.poster.description : "Locandina del film"
        })
    });

})(moviePage);