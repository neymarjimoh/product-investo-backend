module.exports = {
    unsecureRoutes: [
        '/',
        '/api/v1',
        '/api/v1/auth/register',
        '/api/v1/auth/login',
        '/api/v1/auth/verify-account/:email-:token',
        '/api/v1/auth/forgot-password',
    ],
    // the secure routes will be much depending on app scope
    // only logged in users can access this endpoints/routes
    secureRoutes: [
        '/api/v1/auth/change-password',
        '/api/v1/users',
        '/api/v1/users/:userId',
        '/api/v1/users/search/:name',
    ]
};