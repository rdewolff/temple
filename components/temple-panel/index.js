
module.exports = templePanel;

function templePanel() {}

templePanel.prototype.name = "temple-panel";
templePanel.prototype.view = __dirname;

templePanel.prototype.init = function() {
  //var model = this.model;
};

templePanel.prototype.create = function(model) {

  console.log('templePanel create');

  $('#temple-panel').sidr();

  $('#temple-panel').click(function() {
    $('#menuLeftPageSearchInput').focus();
  });

  // TODO: how to pass param from the view to here ?
  // console.log(@fieldDetectingEnter);

  $('#menuSearchInput').bind("enterKey",function(e){
     //do stuff here
     console.log('enter!');
     $.sidr('open', 'sidr');
     $('#menuLeftPageSearchInput').focus();
  });

  $('#menuSearchInput').keyup(function(e){
      if(e.keyCode == 13)
      {
          $(this).trigger("enterKey");
      }
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) { // esc key
      $.sidr('close', 'sidr');
    }
    $(document).keydown(function(e) {
        if (e.keyCode == 70 && e.ctrlKey) { // ctrl + f
            $.sidr('open', 'sidr');
            $('#menuLeftPageSearchInput').focus();
        }
    });
  });

  // TODO: remove if not using the keypress js lib
  // var keyboardListener = new window.keypress.Listener();

}


templePanel.prototype.destroy = function() {
    console.log('templePanel destroy');
}
