const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const staticKoa = require('koa-static');
const session = require('koa-session');
const Pug = require('koa-pug');
const mount = require('koa-mount');
const pug = new Pug({
    viewPath: './source/template/', pretty: false, basedir: './source/template/', noCache: true, app: app // equals to pug.use(app) and app.use(pug.middleware)
});
const errorHandler = require('./libs/error');
const config = require('./config');

app.use(staticKoa('./public'));
app.use(mount('/upload', staticKoa('./upload')));

app.use(errorHandler);
app.on('error', (err, ctx) => {
    ctx.render('error', {
        status: ctx.response.status,
        error: ctx.response.message
    })
});

const router = require('./routes');

app
    .use(session(config.session, app))
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => {
    if (!fs.existsSync(config.upload)) {
        fs.mkdirSync(config.upload)
    }
    console.log(`Example app listening on port ${process.env.PORT || 3000}`);
});
