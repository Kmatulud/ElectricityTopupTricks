// this is our
module.exports = function(pool) {

	// list all the streets the we have on records
	async function streets() {
		const streets = await pool.query(`select * from street`);
		return streets.rows;
	}

	// for a given street show all the meters and their balances
	async function streetMeters(streetId) {
		const streetMeters = await pool.query('select id, balance from electricity_meter where street_id=$1', [streetId]);
		return streetMeters.rows;
	}

	// return all the appliances
	async function appliances() {
		const appliances = await pool.query('select name, rate from appliance');
		return appliances.rows;

	}

	// increase the meter balance for the meterId supplied
	async function topupElectricity(meterId, units) {
		const topup = await pool.query('update electricity_meter set balance=$1 where id=$1', [units],[meterId]);
		return topup.rows;
	}
	
	// return the data for a given balance
	async function meterData(meterId) {
		const meterData = await pool.query('select * from electricity_meter where id=$1', [meterId]);
		return meterData.rows;
	
	}

	// decrease the meter balance for the meterId supplied
	async function useElectricity(meterId, units) {
		const balance = await pool.query('select balance from electricity_meter');
		const newBalance = balance - units;
		const useElec = await pool.query('update electricity_meter set balance=$1 where id=$1',[newBalance], [meterId]);
		return useElec;
	}

	return {
		streets,
		streetMeters,
		appliances,
		topupElectricity,
		meterData,
		useElectricity
	}


}