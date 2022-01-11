import users from './users';

export default (app) => {
    app.use('/api/v1/users', users);

    app.use('/', (req, res) => {
        res.send('<h1>Hello from home page</h1>');
    });
};
