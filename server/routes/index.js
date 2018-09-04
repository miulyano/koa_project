const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');

const ctrlHome = require('../controllers/index');
const ctrlAdmin = require('../controllers/admin');
const ctrlLogin = require('../controllers/login');
const ctrlMail = require('../controllers/mail');

const isAdmin = (ctx, next) => {
    if(ctx.session.isAdmin) {
        return next();
    }
    ctx.redirect('/');
};

router.get('/', ctrlHome.index);
router.get('/login', ctrlLogin.login);
router.get('/admin', isAdmin, ctrlAdmin.admin);

router.post('/login', koaBody(), ctrlLogin.auth);
router.post('/', koaBody(), ctrlMail.mail);
router.post('/admin/upload', isAdmin, koaBody({
        multipart: true,
        formidable: {
            uploadDir: process.cwd() + '/upload'
        }
    }),  ctrlAdmin.item);
router.post('/admin/skills', isAdmin, koaBody(), ctrlAdmin.skills);



module.exports = router;
