const db = require('../models/db');
const psw = require('../libs/password');

module.exports.login = async(ctx, next) => {
    ctx.render('pages/login', {msg: false});
};

module.exports.auth = async(ctx, next) => {
    const {login, password} = ctx.request.body;
    console.log(psw.validPassword(password));
    const user = db
        .getState()
        .user;
    if (user.login === login && psw.validPassword(password)) {
        ctx.session.isAuthorized = true;
        ctx.redirect("/admin");
    } else {
        ctx.render(('pages/login'), {msg: 'Неверный логин или пароль! Пожалуйста проверьте правильность данных.'});
    }
};
