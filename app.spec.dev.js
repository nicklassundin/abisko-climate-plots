const chai = require("chai");
const chaiHttp = require("chai-http"),
    server = require("./app.js").app,
    should = chai.should();

chai.use(chaiHttp);

describe(
    "server test",
    () => {

        before(() => {
        });
        it(
            "should list ALL / GET",
            (done) => {

                chai.request(server).
                    get("/").
                    end((err, res) => {

                        res.should.have.status(200);
                        done();

                    });

            }
        );
        it(
            "should list ALL /chart GET",
            (done) => {

                chai.request(server).
                    get("/chart").
                    end((err, res) => {

                        res.should.have.status(200);
                        done();

                    });

            }
        );

        /*
         * It('chart time to load', function * (){
         * Chai.request(server)
         * .get('/chart')
         * .end(function(err, res){
         * TODO
         * });
         * })
         */

    }
);
