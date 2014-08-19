module.exports = function(app, options) {

    // TODO: move to component?
    // check if the link is part of the URL
    app.proto.containUrl = function(currentUrl, linkUrl) {
      // FIXME: path /a/bc should not return true when path /a/b give. Full word matching should be implemented.
      // console.log(currentUrl, linkUrl, (currentUrl.split('/')).indexOf(linkUrl));
      // return ((currentUrl.split('/')).indexOf(linkUrl.split('/')) > -1);
      // regular expression to match a word : \b([a-zA-Z0-9]*)\b
      return (currentUrl.indexOf(linkUrl) > -1);
    }

}
