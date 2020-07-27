const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const { expect } = chai;
chai.use(chaiHttp);
const { User } = require('../../models');
const app = require('../../index');

let bearerToken;
let savedUser;
let validMongooseId;

describe('## USERS', function () {
    let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5vZUBleGFtcGxlLmNvbSIsInVzZXJJZCI6IjVmMDQ0NTFlODBmMGJhMzk5ZGYxZjI2ZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTk0MTE1Nzg4LCJleHAiOjE1OTQyMDIxODh9.VoSPs24TntksEk3fP-vV5VLYxmTOMHUa10SmGUt52DU";
    beforeEach(async () => {
        const user = new User({
            email: "test@gmail.com",
            password: bcrypt.hashSync("123456789", 10),
            phoneNumber: "+2348036695956",
            fullName: "Lionel Messi",
            isVerified: true,
        });
        savedUser = await user.save();
        const res = await chai
            .request(app)
            .post('/api/v1/auth/login')
            .send({
                email: savedUser.email,
                password: "123456789",
            });
        bearerToken = res.body.token;
    });

    afterEach( async () => {
        await User.findByIdAndDelete(savedUser.id);
    });

    describe('#Get Users() /users', function () {

        it('should get users from the database', async () => {
            const res = await chai
                .request(app)
                .get('/api/v1/users')
                .set("Authorization", `Bearer ${bearerToken}`);
            expect(res.status).to.equal(200);
            expect(res.body.data.length).to.equal(1);
        });

        it('should return 401 error on getting users with invalid/expired token', async () => {
            const res = await chai
                .request(app)
                .get('/api/v1/users')
                .set("Authorization", `Bearer ${authToken}`)
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property("message");
        });
        
    });
    
    
    describe('#GET A User() /users/:userId', function () {
        
        it('should get a user by Id', async () => {
            const res = await chai.request(app)
                .get(`/api/v1/users/${savedUser.id}`)
                .set("Authorization", `Bearer ${bearerToken}`);
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("200 Success");
            expect(res.body.message).to.equal("User found ");
        });
        
        it('should return 422 Error with invalid userId', async () => {
            const res = await chai.request(app)
                .get(`/api/v1/users/abcd`)
                .set("Authorization", `Bearer ${bearerToken}`);
            expect(res.status).to.equal(422);
        });

        it('should return 404 Error if userId does not exist', async () => {
            validMongooseId = '5f0c6c384474fc1b78751034';
            const res = await chai.request(app)
                .get(`/api/v1/users/${validMongooseId}`)
                .set("Authorization", `Bearer ${bearerToken}`);
                
            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("404 Error");
        });

    });

});
