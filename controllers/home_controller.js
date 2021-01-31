const Post = require('../models/post');
const User = require('../models/user');

const Friendship= require('../models/friendship');

module.exports.home = async function(req, res){

    try{
        let user = req.user;
        // CHANGE :: populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');
        let friends=[];
        if(user){
            for(f of user.friendships){
                const f_obj= await Friendship.findById(f);
                let bfriend;
                if(user.id != f_obj.by_user)
                    bfriend=await User.findById(f_obj.by_user);
                else
                    bfriend=await User.findById(f_obj.to_user);
                if(bfriend !=null)
                    friends.push(bfriend);
            }
        }
        return res.render('home', {
            title: "Sathi | Home",
            posts:  posts,
            all_users: friends,
            key: process.env.maps_key
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
