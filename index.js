const express = require('express');
const exphbs  = require('express-handlebars');
const pg = require('pg');
const Pool = pg.Pool;

const app = express();
const PORT =  process.env.PORT || 3017;

const ElectricityMeters = require('./electricity-meters');

const connectionString = process.env.DATABASE_URL || "postgres://icavisldfjpuph:5b45290a3b1b5816ee00c5af49c8c1dd79866f79bb181905c3035c59725269b4@ec2-3-211-240-42.compute-1.amazonaws.com:5432/d73eao91j15pcv"

const pool = new Pool({
    connectionString,
	ssl: { rejectUnauthorized: false}
});

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const electricityMeters = ElectricityMeters(pool);

app.get('/', function(req, res) {
	res.redirect('/streets');
});

app.get('/streets', async function(req, res) {
	const streets = await electricityMeters.streets();
	console.log(streets);
	res.render('streets', {
		streets
	});
});
app.get('/appliances', async function(req, res) {
	const appliances = await electricityMeters.appliances();
	res.render('appliances', {
		appliances
	});
});
app.get('/streets/balances', async function(req, res){
	const balance = await electricityMeters.nameAndBalance();
	res.render('street_balances', {
		balance
	});
});
app.get('/meters/:street_id', async function(req, res) {

	// use the streetMeters method in the factory function...
	// send the street id in as sent in by the URL parameter street_id - req.params.street_id

	// create  template called street_meters.handlebars
	// in there loop over all the meters and show them on the screen.
	// show the street number and name and the meter balance
	console.log(req.params.street_id);
	const street_meters = await electricityMeters.streetMeters(req.params.street_id);
	res.render('street_meters', {
		street_meters
	});
});

app.get('/meter/use/:meter_id', async function(req, res) {


	// show the current meter balance and select the appliance you are using electricity for
	res.render('use_electicity', {
		meters
	});
});

app.get('/buy-electricity', async function(req, res){
	//Display the buying page
	res.render('topup');


})

app.post('/meter/use/:meter_id', async function(req, res) {

	const topupElectricity = await electricityMeters.topupElectricity();

	// update the meter balance with the usage of the appliance selected.
	res.render(`/meter/user/${req.params.meter_id}`, topupElectricity);
	res.redirect('/buy-electricity');

});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`App started on port ${PORT}`)
});