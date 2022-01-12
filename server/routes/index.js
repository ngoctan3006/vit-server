import users from './users.js';

export default (app) => {
    app.use('/api/v1/users', users);

    app.use('/', (req, res) => {
        res.send(
            '<h1 style="display:flex;justify-content:center;align-items:center;height:100vh;color:red;font-size:5rem">From VITer with love ❤️❤️</h1>'
        );
    });
};
