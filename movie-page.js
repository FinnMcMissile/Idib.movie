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
            posterDescription: movie.poster ? movie.poster.description : "Locandina del film",
            country: movie.country,
            originalTitle: movie.originalTitle,
            italianTitle: movie.italianTitle,
            production: movie.country + " " + movie.year
        });

        movie.cast.forEach(member => {
            $("#movieCast").append(utils.render($('#movie-cast-member-template').html(), {
                dubber: member.dubber && member.dubber.name ? member.dubber.name : "",
                photo: member.dubber && member.dubber.photo ? utils.remoteURL(member.dubber.photo) : "images/no-dubber-photo.jpg",
                character: member.character,
                actor: member.actor ? member.actor : ""
            }));
        });
    });

})(moviePage);