var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./server.js').app
var should = chai.should();

chai.use(chaiHttp);

describe('server test', function() {
	try{

	before(function(){
	})
	it('should list ALL / GET', function(done) {
		chai.request(server)
			.get('/')
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
	});
	it('should list ALL /chart GET', function(done) {
		chai.request(server)
			.get('/chart')
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
	});
	// it('chart time to load', function * (){
		// chai.request(server)
			// .get('/chart')
			// .end(function(err, res){
				// TODO
			// });
	// })
	}catch(ERROR){

	}
})
