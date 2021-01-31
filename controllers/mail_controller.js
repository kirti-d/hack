
const Mailer = require('../mailers/comments_mailer');

module.exports.sendMail = async function(req, res){
    try{
        console.log(req.body);
        Mailer.newComment(req.body);
        return res.json(200, {
            message: 'success'
        });
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}