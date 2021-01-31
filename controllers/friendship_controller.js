const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.add = async function(req,res){
    try{
        let user = await User.findById(req.params.id);
        if (user){
            let friends = await Friendship.create({
                to_user: user._id,
                by_user: req.user._id
            });
            await req.user.friendships.push(friends);
            req.user.save();
            await user.friendships.push(friends);
            user.save();
            req.flash('success', 'successfully added to friendlist!');
            return res.redirect('/');
        }else{
            req.flash('error', 'profile does not exist');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', 'unknown error !');
        return res.redirect('back');
    }
}