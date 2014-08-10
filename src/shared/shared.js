module.exports = function(app, options) {

    // TODO: move to component?
    // check if the link is part of the URL
    app.proto.containUrl = function(currentUrl, linkUrl) {
      return (currentUrl.indexOf(linkUrl) > -1);
    }

}
