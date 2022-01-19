const assert = require("assert");
const pg = require('pg');
const Pool = pg.Pool;
const ElectricityMeters = require('../electricity-meters');

const connectionString = process.env.DATABASE_URL || "postgres://jflgvlaykiztti:bd6e9b2986f57e9445790e42484f9a38c6c6e9ee36b97634e97d7651a3bb959a@ec2-34-203-91-150.compute-1.amazonaws.com:5432/d7p9oilcmevko";

const pool = new Pool({
    connectionString,
	ssl: { rejectUnauthorized: false}, 
});

describe("The Electricity meter", function() {

	this.beforeAll(function() {
		pool.query(`update electricity_meter set balance = 50`);
	});

	it("should see all the streets", async function() {
		const electricityMeters = ElectricityMeters(pool);
		const streets = await electricityMeters.streets();

		const streetList = [
			 {
			   "id": 1,
			   "name": "Miller Street"
			 },
			 {
			   "id": 2,
			   "name": "Mathaba Crescent"
			 },
			 {
			   "id": 3,
			   "name": "Vilakazi Road"
			 }]
			

		assert.deepStrictEqual(streetList, streets);

	});

	it("should see all the appliances", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const appliances = await electricityMeters.appliances();
		
		assert.deepStrictEqual([], appliances);

	});

	it("should see all the appliances", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const appliances = await electricityMeters.appliances();
		
		assert.deepStrictEqual([], appliances);

	});

	it("should be able to topup electricity", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const appliances = await electricityMeters.topupElectricity(3, 20);
		const meterData = await electricityMeters.meterData(3);
		assert.deepStrictEqual(70, meterData.balance);

	});

	it("should be able to use electricity", async function() {

		const electricityMeters = ElectricityMeters(pool);
		const appliances = await electricityMeters.useElectricity(2, 20);
		const meterData = await electricityMeters.meterData(2);
		assert.deepStrictEqual(30, meterData.balance);

	});

	this.afterAll(function() {
		pool.end();
	});

});