/**
 * Created by breinhart on 8/23/15.
 */

module.exports = (function() {
    var mongoose = require('mongoose');
    var uriUtil = require('mongodb-uri');
    var matchDef = require('./match.js');
    var matchIds = require('./matchIds.js');

    var mongodbUri = process.env.MONGOLAB_URI
    mongoose.connect(uriUtil.formatMongoose(mongodbUri));
    var db = mongoose.connection;

    var matchSchema = new mongoose.Schema(matchDef);
    var match = mongoose.model('match', matchSchema);

    db.on('error', console.error.bind(console, 'connection error '));
    db.once('open', function () {
        console.log('connencted to: ' + uriUtil.formatMongoose(mongodbUri));
    });

    var disconnectDB = function() {
        mongoose.connection.close(function () {
            console.log('Mongoose disconnected on app termination');
            process.exit(0);
        });
    }
    process.on('SIGINT', disconnectDB).on('SIGTERM', disconnectDB);

    return {

        getRandomMatch: function (callback) {
            //generate a random int from 0 - 10000
            var idx = Math.floor(Math.random() * 1000);

            //Find us a match in the db
            //There should only be one match in the db, but I am going to limit it to 1 just to simplify things
            match.findOne({"matchId": matchIds.ids[idx].toString()})
                .lean()
                .exec(function (err, m) {
                    if (err) {
                        return error.
                        callback(err, null);
                    }
                    //If there is no such document.
                    if (m != null || m != "") {
                        //return the result
                        callback(null, m);
                    }
                    else {
                        //return error
                        callback("match not found matchId: " + matchIds.ids[idx], null)
                    }
                });
        }
    }
})();