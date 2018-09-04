const fs = require('fs');
const _path = require('path');
const util = require('util');
const db = require('../models/db');
const rename = util.promisify(fs.rename);

module.exports.admin = async(ctx, next) => {
    ctx.render('pages/admin');
};

module.exports.skills = async(ctx, next) => {
    const {age, concerts, cities, years} = ctx.request.body;

    let skills = [
        {
            "number": age,
            "text": "Возраст начала занятий на скрипке"
        },
        {
            "number": concerts,
            "text": "Концертов отыграл"
        },
        {
            "number": cities,
            "text": "Максимальное число городов в туре"
        },
        {
            "number": years,
            "text": "Лет на сцене в качестве скрипача"
        }
    ];
    try {
        if (!age || !concerts || !cities || !years) {
            ctx.render('pages/admin', { status: 'error', msg: 'Все поля нужно заполнить!' });
        } else {
            await db.set('skills', skills).write();
            ctx.render('pages/admin', {status: 'success', msg: 'Счетчики обновлены!'});
        }
    } catch (error) {
        ctx.render('pages/admin', {msg:`При записи данных произошла ошибка!: ${error}`, status: 'Error'});
    }
};

module.exports.item = async(ctx, next) => {
    if(ctx.request.body) {
        const {title, price} = ctx.request.body;
        const {name, path, size} = ctx.request.files.file;
        let fileName = _path.join(process.cwd(), 'upload', name);
        const errUpload = await rename(path, fileName);
        if (errUpload) {
            return (ctx.body = {
                mes: 'При загрузке картинки произошла ошибка',
                status: 'Error'
            })
        }
        await db.get('products').push({
            name: title,
            price: price,
            src: _path.join('upload', name)
        })
            .write();
        ctx.body = {
            msgupload: 'Товар успешно добавлен',
            status: 'OK'
        };
        ctx.redirect('/admin');
    }
};
