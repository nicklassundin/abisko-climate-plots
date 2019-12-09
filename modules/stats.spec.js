const fs = require('fs')
const request = require('request')

const expect = require('chai').expect

const stats = require('./stats.js')

describe('javascript statistic module', function () {
	it('saves the content', function * () {
		var result = stats.struct.create();
		expect(result).to.eql(stats.struct);
	})
})
