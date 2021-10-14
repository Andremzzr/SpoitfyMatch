const User = require("../models/User");
const request = require("request");

function authOptionsCreation(url,access_token) {
    return {
        url: url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' :`Bearer ${access_token}`
        },
        json: true
    }
}
module.exports = {
    getUserLink : async (req,res) => {
        const {userId} = req.params;
        
        const user = await User.findOne({id : userId});

        res.send(`http://localhost:5000/profile/match/${user.link}`)
    
    },

    matchWithFriend : async (req,res) => {
        const {userLink} = req.params;
        const {access_token} = req.query;
        
        if(access_token == undefined){
            res.redirect(`/auth/login?userLink=${userLink}`);
        }
        else{
            const user = await User.findOne({link : userLink});

            if(user!= undefined){
                const authOptions = authOptionsCreation(`https://api.spotify.com/v1/me/top/artists?limit=100`,access_token);
                request.get(authOptions,  async (error,response,body) => {
                   res.send(body);                        
                });
            }
            else{
                res.redirect('/')
            }
        }
        
    }
}