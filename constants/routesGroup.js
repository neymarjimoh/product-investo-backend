module.exports = {
    unsecureRoutes: [
        '/',
        '/docs',
        '/api/v1/docs',
        '/api/v1',
        '/api/v1/auth/register',
        '/api/v1/auth/login',
        '/api/v1/auth/verify',
        '/api/v1/auth/resend-verify',
        '/api/v1/auth/forgot-password',
        '/api/v1/auth/reset-password',
    ],
    secureRoutes: [
        '/api/v1/auth/change-password',
        '/api/v1/users',
        '/api/v1/auth/logout',
        '/api/v1/users/:userId',
        '/api/v1/users/profile/update/:userId',
        '/api/v1/users/search/:name',
        '/api/v1/products/new',
        '/api/v1/products/update/:productId',
    ],
};
