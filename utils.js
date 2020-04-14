var utils = {
    render(template, props) {},
    remoteURL(url) {}
};
( utils => {

    utils.render = function(template, props) {
        for (let [key, value] of Object.entries(props)) {
            template = template.replace(`{${key}}`,value);
          }
      
          return template;
    }

    utils.remoteURL = function(url) {
        return `https://www.antoniogenna.net/doppiaggio/${url}`;
      }
      
})(utils);