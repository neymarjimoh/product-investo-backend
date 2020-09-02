const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const app = require('../../index');
const { expect } = chai;
chai.use(chaiHttp);
const { User } = require('../../models');

describe('##USER AUTH', function () {

    afterEach(function(done) {
        User.deleteMany({}, (err) => {
            done();
        });
    });
    
    describe('=== User Registration ===', function () {
        it('should register a user', async function () {
            const res = await chai.request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: "test@gmail.com", 
                    password: "123456789", 
                    phoneNumber: "+2349070822819", 
                    fullName: "Nerymar Junior",
                });
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('Account registration was successful. Please check your mail to verify your account');
        });
        
        it('should not register a user without required fields (email, password)', function (done) {
            chai.request(app)
                .post('/api/v1/auth/register')
                .send({
                    phoneNumber: "+2348052949159",
                    fullName: "Elon Musk",
                    address: "Florida, U.S.A"
                })
                .end((err, res) => {
                    expect(res.status).to.equal(422);
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.have.property("errors");
                    expect(res.body.errors).to.be.an("array");
                    done();
                })
        });
        
    });
    
    
    describe('=== User Login ===', function () {
        
        it('should not log in an unregistered user', function (done) {
            chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: "test@gmail.com",
                    password: "123456789"
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.status).to.equal("404 Error");
                    expect(res.body).to.have.property(
                        "message", 
                        "Ensure you enter the right credentials"
                    );
                    done();
                })
        });
        
        
        it('should login a user', function (done) {
            const user = new User({
                email: "test@gmail.com",
                password: bcrypt.hashSync("123456789", 10),
                phoneNumber: "+2348036695956",
                fullName: "Lionel Messi",
                isVerified: true,
                role: "user",
            });
            user.isVerified = true;
            user.save()
            .then((result) => {
                chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: "test@gmail.com",
                    password: "123456789",
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.message).to.equal("User signed in successfully");
                    expect(res.body).to.have.property("token");
                    expect(res.body).to.have.property("user");
                    done();
                })
            })

        });

        
        it('should not log in a user that is not verified', function (done) {
            const user = new User({
                email: "test@gmail.com",
                password: bcrypt.hashSync("123456789", 10),
                phoneNumber: "+2348036695956",
                fullName: "Lionel Messi",
            });
            user.save()
            .then(result => {
                chai.request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: "test@gmail.com",
                    password: "123456789"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(401);
                    expect(res.body).to.have.property("status", "401 Error");
                    expect(res.body).to.have.property(
                        "message", 
                        "You have to verify your account"
                    );
                    done();
                })
            })
        });
                
    });
    
    
    describe('=== User Forgot Password ===', function () {
        
        it('should send password reset link', function (done) {
            const user = new User({
                email: "test@gmail.com",
                password: bcrypt.hashSync("123456789", 10),
                phoneNumber: "+2348036695956",
                fullName: "Lionel Messi",
                isVerified: true
            })
            user.save()
            .then((result) => {
                chai.request(app)
                .post('/api/v1/auth/forgot-password')
                .send({ email: "test@gmail.com" })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.equal("200 Success");
                    expect(res.body).to.have.property(
                        "message", 
                        `A password reset link has been sent to ${user.email}`
                    );
                    done();
                })
            })

        });

        it('should not send password reset link if user doesn\'t exist', function (done) {
            chai.request(app)
            .post('/api/v1/auth/forgot-password')
            .send({ email: "test@gmail.com" })
            .end((err, res) => {
                if(err) done(err);
                expect(res.status).to.equal(404);
                expect(res.body.status).to.eql("404 Error");
                expect(res.body).to.have.property("message");
                done();
            })
        });
        
    });
    
});
