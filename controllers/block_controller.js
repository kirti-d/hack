const Friendship = require('../models/friendship');
const User=require('../models/user');
const threshold=5;

module.exports.block = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        if (user){
            let count=user.blockCount+1;
            user.blockCount= count;
            user.blockedBy.push(req.user.id);
            let isfriend= await unfriend(user,req.user);
            if(isfriend){
                isfriend = await unfriend(req.user,user);
                isfriend.remove();
            }
            req.user.blockedUsers.push(user.id);
            req.user.save();
            if(count > threshold){
                user.remove();
            }
            user.save();
            req.flash('success', 'successfully blocked this profile!');
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

async function unfriend (user1,user2){
    count=0;
    for(f of user1.friendships){
        let friend_id= await Friendship.findById(f);
        if(friend_id.by_user == user2.id || friend_id.to_user == user2.id){
            user1.friendships.splice(count,1);
            return friend_id;
        }
    count++;
    }
    return undefined;
}