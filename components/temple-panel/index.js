
module.exports = templePanel;

function templePanel() {}

templePanel.prototype.name = "temple-panel";
templePanel.prototype.view = __dirname;

templePanel.prototype.init = function() {
  var model = this.model;
};

templePanel.prototype.close = function() {
    console.log('close');
}

templePanel.prototype.create = function() {

  console.log('templePanel.create()');

  // console.log(require('derby').util.isServer);

  $('#temple-panel').sidr();

  $('#temple-panel-open').click(function() {
    $.sidr('open', 'sidr');
  });

  $('#temple-panel-close').click(function() {
    $.sidr('close', 'sidr');
  });



  /*

    console.log('app.proto launching');

    // This lets us play with the model in the console:
    //   MODEL.get("widgets");
    global.MODEL = model

    require('../../public/vendor/jquery-1.9.1.min'); // the JQuery version from Derby example todos WORKS
    //require('../../public/components/jquery/dist/jquery.min'); // the Bower JQuery version does NOT work

    require('../../public/components/bootstrap/dist/js/bootstrap.min');
    //require('../../public/components/sidr/jquery.sidr.min');
    //require('../../public/components/Keypress/keypress-2.0.3.min');

    var testJquery = $("#menuLeftPaneToggle");

    $("#menuLeftPaneToggle").click(function() {
      console.log('click');
    });


    // var keyboardListener = new window.keypress.Listener();

  */

}
