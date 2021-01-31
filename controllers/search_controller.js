
const User =require('../models/user');

module.exports.search = async function(req,res){
    try{
        let user = await User.find({"name" : req.body.userName});
        if (user.length >0){
            const redirect = "/users/profile/"+user[0]._id;
            console.log(redirect);
            return res.redirect(redirect);
        }else{
            req.flash('error', 'no user with this name exists');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', 'unknown error !');
        return res.redirect('back');
    }
}