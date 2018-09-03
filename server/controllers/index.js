const db = require('../models/db');

module.exports.index = async(ctx, next) => {
    const products = db.getState().products || [];
    const skills = db.getState().skills || [];
    ctx.render('pages/index', {products: products, skills: skills})
};
