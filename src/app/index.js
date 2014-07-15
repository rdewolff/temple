var derby = require('derby');

var app = module.exports = derby.createApp('app', __filename);

if (!derby.util.isProduction) global.app = app;

app.serverUse(module, 'derby-stylus');

app.use(require('d-bootstrap'));
app.use(require('../../components/zetcom-derby-ui-forms'));

app.loadViews(__dirname + '/../../views/app');
app.loadStyles(__dirname + '/../../styles/app');

app.get('/', function(page){
  page.render('home');
});

app.get('/p/artist', function(page, model, params, next) {
  var artistQuery = model.query('artist', {});
  artistQuery.subscribe(function(err) {
    if (err) return next(err);
    model.ref('_page.artist', artistQuery)
  	page.render('artistList');
  });
});

app.get('/p/artist/:id', function(page, model, params, next) {
  if (params.id === 'new') {
    return page.render('artistEdit');
  }
  var artist = model.at('artist.' + params.id);
  artist.subscribe(function(err) {
    if (err) return next(err);
    // if (!artist.get()) return next();
    model.ref('_page.artist', artist)

    page.render('artistEdit');
  });
});

app.component('artistEdit', ArtistEditForm);
function ArtistEditForm() {}

ArtistEditForm.prototype.done = function() {
	var model = this.model;
	/* TODO validation
	if (!model.get('artist.firstname')) {
		var checkName = model.on('change', 'artist.firstname', function(value) {
			if (!value) return;
			model.del('nameError');
			model.removeListener('change', checkName);
		});
		model.set('nameError', true);
		this.firstname.focus();
		return;
	}
	 */
	if (!model.get('artist.id')) {
		model.root.add('artist', model.get('_page.artist'));
	}
	app.history.push('/p/artist');
}