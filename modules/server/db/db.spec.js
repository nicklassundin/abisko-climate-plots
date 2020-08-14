const fs = require('fs')
const request = require('request')

const expect = require('chai').expect
const db = require('./db.js')
setTimeout(function() {
	describe('Wait for setup', function() {
		db.admin.then(run);
	});
}, 0);



describe('database connection test', function () {
	it('SSH: ', function(done) {
		db.ssh().then(function(response){
			console.log(response)
			if(response) done()
		});
	})

	// it('Admin Query: ', function(done) {
	// 	db.makeQuery(db.admin, 'SHOW TABLES').then(function(response){
	// 		if(response) done()
	// 	});
	// })

})
