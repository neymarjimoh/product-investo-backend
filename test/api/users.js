const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const { expect } = chai;
chai.use(chaiHttp);
const { User } = require('../../models');
const sinon = require('sinon');
const authMiddleware = require('../../middlewares/checkAuth');
let app;
var Token = '';

describe('## USERS', function () {
    let authToken;
    beforeEach((done) => {
        sinon.stub(authMiddleware, "checkAuth").callsFake((req, res, next) => next());
        app = require('../../index');
        done();
    })

    afterEach((done) => {
        authMiddleware.checkAuth.restore();
        done();
    })
    // before((done) => {
    //     const user = new User({
    //         email: "test@gmail.com",
    //         password: bcrypt.hashSync("123456789", 10),
    //         phoneNumber: "+2348036695956",
    //         fullName: "Lionel Messi",
    //         isVerified: true
    //     });
    //     user.save()
    //     .then(() => {
    //         chai.request(app)
    //         .post('/api/v1/auth/login')
    //         .send({
    //             email: "test@gmail.com",
    //             password: "123456789"
    //         })
    //         .end((err_1, res) => {
    //             if (err_1)
    //                 return done(err_1);
    //             Token = res.body.token;
    //             authToken = res.body.token;
    //             done();
    //         });
    //     })
    // });
    

    describe('#Get Users() ====', function () {
        
        it('should get all users from the database', function (done) {
            chai.request(app)
            .get('/api/v1/users')
            // .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.data.length).toBe(1);
                expect(res.body).to.have.property(
                    "message",
                    "1 User found"
                );
                done();
            })
        });
        
    });
    
    //  Other tests here
});
