const Places = require('../models/map_places');

module.exports.getPlaces = async function(req, res){
    try{
        let places=await Places.find({});
        return res.json(200, {
            places: places
        });
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}
module.exports.addToilet = async function(req, res){
    try{
        // console.log(req.body);
        Places.findOne({googleId: req.body.googleId}).exec(function(err, place){
            if (err){console.log('error in finding place', err); 
                return res.json(400, {
                    err: err
                });
            }
            if (place){
                return res.json(200, {
                    msg: "already in db"
                });
            }else{
                Places.create({
                    googleId: req.body.id,
                    lat: req.body.location.lat,
                    lan: req.body.location.lan,
                    type: "toilet",
                }, function(err, toilet){
                    if (err){
                        console.log('error in creating toilet', err); 
                        return res.json(400, {
                            err: err
                        });
                    }
                    // console.log(toilet);
                    toilet.ratedBy.push(req.user.id);
                    toilet.save();
                    return res.json(200, {
                        msg: "added toilet to database"
                    });
                });
            }

        });
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}