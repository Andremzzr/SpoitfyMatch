const request = require("request");
const querystring = require('querystring');
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
    loginIntoSpotify : async(req,res) => {
        res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: 'user-read-private user-read-email user-read-currently-playing user-top-read',
            redirect_uri : `http://localhost:5000/auth/callback`
        }));
    },

    callbackUrl: async (req,res) => {
        try{
            const code = req.query.code || null
            const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri : 'http://localhost:5000/auth/callback',
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(
                process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
                ).toString('base64'))
            },
            json: true
        }
        request.post(authOptions, (error, response, body) => {
        const access_token = body.access_token
        const uri = 'http://localhost:5000/auth/getToken/'
        res.redirect(uri + '?access_token=' + access_token)
        })
        }
        catch(err){
            console.log(err);
            res.redirect('/');
        }
    },

    callbackMatch : async (req,res) => {
        const code = req.query.code || null;

        const {userLink} = req.query;
        const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: 'http://localhost:5000/auth/callback',
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(
            process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
            ).toString('base64'))
        },
        json: true
        }
        request.post(authOptions, (error, response, body) => {
        const access_token = body.access_token
        const uri = `http://localhost:5000/profile/match/${userLink}`
        res.redirect(uri + '?access_token=' + access_token)
        })
    },


    getToken : async(req,res) => {
        const {access_token} = req.query;
        
        const authOptions = authOptionsCreation('https://api.spotify.com/v1/me',access_token);

        request.get(authOptions,  async (error,response,body) => {
            const user = await User.findOne({name : body.display_name});
            console.log(body)
            if(user != undefined){
                console.log('ta na database');

                sres.redirect(`/profile/link/${user._id}?access_token=${access_token}`)
            }
            else{

                const newUserConfig = {
                    name : body.display_name,
                    image : body.images.length > 0 ? body.images[0].url : 'none'
                };
                

                const newUser = new User(newUserConfig); 

                newUser.save()
                .then( user => {
                    res.redirect(`/auth/artist/${user._id}?access_token=${access_token}`)
                    console.log(`User has been created ${newUser.name}`)
                })
                .catch(err => console.log(err));
                }     
        })
    },

    getUserArtists : async(req,res) => {
        const {access_token} = req.query;
  

        const {userId} = req.params;
        const authOptions = authOptionsCreation(`https://api.spotify.com/v1/me/top/artists?limit=100`,access_token);


        request.get(authOptions,  async (error,response,body) => {
            const user = await User.findOne({id : userId});
            if(user != undefined){
                const artists = body.items.map(artist => artist.id)
               
                const hashWord = `${user.name}${user._id}`
                
                
                const hashedPassword = await bcrypt.hash(hashWord, 10)

                const updatedUser = await User.updateOne({id : user._id},{
                    artists : artists,
                    link: hashedPassword
                });
                res.redirect(`/profile/link/${user._id}?access_token=${access_token}`)
            }
            
                
        });
    }
}