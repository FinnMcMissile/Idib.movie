var utils = {
    render(template, props) {},
    remoteURL(url) {}
};
( utils => {

    utils.render = function(template, props) {
        for (let [key, value] of Object.entries(props)) {
            template = template.replace(new RegExp(`{${key}}`,"gi"),value);
        }
      
        return template;
    }

    utils.showFormData = function(props) {
        for (let [key, value] of Object.entries(props)) {
            var elemId = `#${key}`;
            if ($(elemId) != null && $(elemId).length > 0) {
                if ($(elemId).is("img")) {
                    $(elemId).attr("src",value);
                } else if ($(elemId).is("source")) {
                    source = $(elemId);
                    source.attr("src", value).appendTo(source.parent());
                } else if ($(elemId).is("a")) {
                    $(elemId).attr("href",value);
                } else {
                    $(elemId)[0].innerHTML = value;
                }
            }
        }
    }

    utils.remoteURL = function(url) {
        return `https://www.antoniogenna.net/doppiaggio/${url}`;
    }
      
    utils.extractParamFromQueryString = function (queryString, paramName) {
        var param = queryString.split('&').find( p => {
            if (p.startsWith(paramName)) return true;
        });
        if (typeof param === "undefined") return null;
        return param.split("=")[1];
    }

})(utils);