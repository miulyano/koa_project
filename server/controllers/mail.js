const nodemailer = require('nodemailer');
const config = require('../config.json');

module.exports.mail = async(ctx, next) => {
    const {name, email, text} = ctx.request.body;
    //инициализируем модуль для отправки писем и указываем данные из конфига
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: config.mail.smtp.auth.user,
        subject: config.mail.subject,
        text:
            text.trim().slice(0, 500) +
            `\n Отправлено с: <${email}>`
    };
    //отправляем почту
    try {
        if (!name || !email || !text) {
            ctx.body = {msg:'Все поля нужно заполнить!', status: 'Error'};
        } else {
            await transporter.sendMail(mailOptions);
            ctx.body = {msg:'Письмо успешно отправлено!', status: 'Ok'};
        }
    } catch (error) {
        ctx.body = {msg:`При отправке письма произошла ошибка!: ${error}`, status: 'Error'};
    }
};
