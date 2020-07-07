const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const { expect } = chai;
chai.use(chaiHttp);
const { User } = require('../../models');
const sinon = require('sinon');
const authMiddleware = require('../../middlewares/checkAuth');
const app = require('../../index');
// let app;
var Token = '';

describe('## USERS', function () {
    let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5vZUBleGFtcGxlLmNvbSIsInVzZXJJZCI6IjVmMDQ0NTFlODBmMGJhMzk5ZGYxZjI2ZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTk0MTE1Nzg4LCJleHAiOjE1OTQyMDIxODh9.VoSPs24TntksEk3fP-vV5VLYxmTOMHUa10SmGUt52DU";
    // beforeEach((done) => {
    //     sinon.stub(authMiddleware, "checkAuth").callsFake((req, res, next) => next());
    //     app = require('../../index');
    //     done();
    // })

    // afterEach((done) => {
    //     authMiddleware.checkAuth.restore();
    //     done();
    // })

    describe('#Get Users() ====', function () {
        
        it('should get users from the database', function (done) {
            chai.request(app)
            .get('/api/v1/users')
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.data.length).toBe(1);
                expect(res.body).to.have.property(
                    "message"
                );
                done();
            })
        });
        
    });
    
    //  Other tests here
});
