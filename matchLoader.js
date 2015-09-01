/**
 * Created by breinhart on 8/23/15.
 */
/**
 * Created by breinhart on 8/15/15.
 */
var https = require('https');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var match = require('./models/match.js');
var matchIds = require('./models/matchIds.js');

var mongodbUri = process.env.MONGOLAB_URI
mongoose.connect(uriUtil.formatMongoose(mongodbUri));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error '));

var getMatch = function(idx, model) {
    //done case
    if(idx >= matchIds.ids.length) {
        db.disconnect();
        return;
    }

    //If it already exists, no need to waste an API call
    model.find({"matchId": matchIds.ids[idx].toString()})
        .limit(1)
        .exec(function(err, found) {
            if(err) {
                console.error("error finding match: " + err);
                setTimeout(function(i, m) {
                    getMatch(i + 1, m);
                },5000, idx, model);
                return;
            }
            //If there is no such document.
            if(found == null || found == "" ) {

                var riotAPI = {
                    host: 'na.api.pvp.net',
                    port: 443,
                    path: '/api/lol/na/v2.2/match/' + matchIds.ids[idx] + '?includeTimeline=false&api_key=' + process.env.LOLAPIKEY,
                    method: 'GET'

                };

                //get the match
                var req = https.request(riotAPI, function(res) {
                    if(res.statusCode !== 200)
                    {
                        //Assuming a statusCode of 429.  I could be smart, but this is a simple loader.
                        console.log("Rate limit reached for match: " + matchIds.ids[idx] + ", responseCode: " + res.statusCode + " - trying again in 10 seconds");
                        setTimeout(function(i, m) {
                            getMatch(i, m);
                        },10000, idx, model);
                        return;
                    }
                    var matchData = "";

                    res.on('data', function(d) {
                        //It comes in chunks
                        matchData += d.toString();
                    });
                    res.on('end', function() {
                        var mObj = JSON.parse(matchData);
                        console.log('completed request for: ' + mObj.matchId);

                        //Create our Mongodb model
                        model.create(mObj, function (saveErr) {
                            if(saveErr) {
                                console.error("Error saving model: " + saveErr + ", trying again");
                                setTimeout(function(i, m) {
                                    getMatch(i + 1, m);
                                },5000, idx, model);
                                return;
                            }
                        });
                        setTimeout(function(i, m) {
                            getMatch(i + 1, m);
                        },5000, idx, model);
                    })
                });
                req.end();
                req.on('error', function(e) {
                    console.error("request error: " + e);
                });
            }
            else {
                console.log("match found for: " + JSON.stringify({"matchId": matchIds.ids[idx]}) + " - " + idx);
                getMatch(idx + 1, model);
            }
        });
}

db.once('open', function callback() {
    var matchSchema = new mongoose.Schema(match);
    var matchModel = mongoose.model('match', matchSchema);

    console.log('connencted to: ' + uriUtil.formatMongoose(mongodbUri));
    getMatch(0, matchModel);
});

var disconnectDB = function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
}
process.on('SIGINT', disconnectDB).on('SIGTERM', disconnectDB);


