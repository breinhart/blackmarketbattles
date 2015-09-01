/**
 * Created by breinhart on 8/15/15.
 */
module.exports = (function(app, io) {
    var Player = require('./../models/Player');
    var Battle = require('./../models/Battle');
    var DB = require('./../models/db');

    game = {
        io: undefined,
        players: [],
        battles: []
    }

    function init(socketIO) {
        game.io = socketIO;
        bindSocketEvents();
        return game;
    }

    function bindSocketEvents() {
        game.io.sockets.on('connection', function (socket) {
            console.log('player connected ' + socket.id);
            socket.emit('connected', {id: socket.id});

            var player = new Player({id: socket.id});
            game.players.push(player);

            socket.on('updatePlayer', updatePlayer);
            socket.on('createBattle', createBattle);
            socket.on('readOpenRooms', readOpenRooms);
            socket.on('joinBattle', joinBattle);
            socket.on('placeBet', placeBet);
            socket.on('performAction', performAction);
            socket.on('progressState', progressState);
            socket.on('disconnect', onDisconnect);
        });
    }

    function updatePlayer(data) {
        //Check to make sure the name doesn't already exist
        if(playerByName(data.name) != null) {
            console.log('Duplicate Player ' + this.id + ', name: ' + data.name);
            this.emit('playerUpdated', {
                code: 400,
                message: "Gar, Matey, a scurvy dog has taken yer name.  Weigh anchor on another."
            });
            return;
        }
        var player = playerById(this.id);
        if(!player) {
            console.error('Player not found?? ' + this.id);
            this.emit('playerUpdated', {
                code: 404,
                message: "Connected player not found??"
            });
            return;
        }
        console.log('updatedPlayer ' + this.id + ', name: ' + data.name);
        player.updateName(data.name);
        this.emit('playerUpdated', {
            code: 200,
            message: "Player Updated!",
            player: player
        });

    }

    function createBattle(data) {
        console.log('createBattle ' + data.battleName);
        if(!data.battleName || !data.id) {
            console.error('Invalid Battle credentials');
            this.emit('battle:joined', {
                code: 400,
                message: 'No battle details provided'
            });
            return;
        }
        //find the player
        var player = playerById(this.id);
        if(!player) {
            console.error('Player not found?? ' + this.id);
            this.emit('battle:joined', {
                code: 400,
                message: 'Player not found'
            });
            return;
        }
        //see if the battle already exists
        var battle = battleByName(data.battleName);
        if(battle) {
            console.log(battle.id + ' Already exists!');
            this.emit('battle:joined', {
                code: 400,
                message: 'Battle already exists'
            });
            return;
        }
        else {
            //Create the game by name and add the first player.
            battle = new Battle({
                id: data.id,
                name: data.battleName,
                db: DB
            });
            player.joinBattle(battle);
            game.battles.push(battle);
            var openRooms = getOpenRooms();
            game.io.emit('OpenRoomsUpdate', openRooms);

            //join the socket channel
            this.join(battle.id);
            this.emit('battle:joined', {
                code: 200,
                message: 'success',
                battle: battle.serialize()
            })
        }
    }

    function readOpenRooms(data) {
        console.log('queryOpenRooms ' + this.id);
        var openRooms = getOpenRooms();
        this.emit('OpenRoomsUpdate', openRooms)
    }

    function joinBattle(data) {
        console.log('playerJoin battle (' + data.id + ') player (' + playerById(this.id).name + ')');

        //Get the player
        var player = playerById(this.id);
        if(!player) {
            console.error('Player not found?? ' + this.id);
            this.emit('battle:joined', {
                code: 400,
                message: 'Player not found'
            });
            return;
        }

        var battle = battleById(data.id);
        if(!battle) {
            console.error('Battle not found?? ' + data.id);
            this.emit('battle:joined', {
                code: 400,
                message: 'Battle not found'
            });
            return;
        }

        if(!battle.isOpen()) {
            console.error('Battle not open?? ' + data.battleName);
            this.emit('battle:joined', {
                code: 400,
                message: 'Battle no longer open.'
            });
            return;
        }
        //Join the battle!!
        player.joinBattle(battle);
        //remove the map so no one else tries to join.
        var openRooms = getOpenRooms();
        game.io.emit('OpenRoomsUpdate', openRooms);

        battle.start(); // sets up the initial battle variables and such.

        //join the socket channel
        this.join(battle.id);
        this.emit('battle:joined', {
            code: 200,
            message: 'success',
            battle: battle.serialize()
        })

        /*game.io.sockets.to(battle.id)
            .emit('battle:start', battle.serialize());*/

        //Start the first round
        battle.progressState(function(res) {
           game.io.to(battle.id)
               .emit('battle:update', {
                   code: res.code,
                   message: res.message,
                   battle: battle.serialize()
               });
        });
    }

    function progressState() {
        var player = playerById(this.id);
        if(!player) {
            console.error('Player not found?? ' + this.id);
            this.emit('battle:update', {
                code: 400,
                message: 'Player not found'
            });
            return;
        }

        var battle = battleById(player.battleId);
        if(!battle) {
            console.error('Battle not found?? ' + player.battleId);
            this.emit('battle:update', {
                code: 400,
                message: 'Battle not found'
            });
            return;
        }


        //I only want the host to set the next round
        //I eventually want to move all timer and round handling on the server side
        //      I don't want the host 'pausing' the game by using the JS debugger in the client.
        if(player.id == battle.host.id) {
            console.log('progress State (' + battle.name + ') state (' + battle.state + ')');
            battle.progressState(function (res) {
                game.io.to(battle.id)
                    .emit('battle:update', {
                        code: res.code,
                        message: res.message,
                        battle: battle.serialize()
                    });
            });
        }
    }

    function placeBet(data) {
        console.log('placeBet ' + this.id);
        var player = playerById(this.id);
        if(!player) {
            console.error('Player not found?? ' + this.id);
            return;
        }

        player.placeBet(data.team, data.bet);
    }

    function performAction(data) {
        console.log('performAction ' + data.action);
        var player = playerById(this.id);
        if(!player) {
            console.error('Player not found?? ' + this.id);
            return;
        }
        var battle = battleById(player.battleId);
        if(!battle) {
            console.error('Battle not found?? ' + player.battleId);
            this.emit('battle:update', {
                code: 400,
                message: 'Battle not found'
            });
            return;
        }

        var success = battle.performAction(data.action);
        if(success) {
            //Go ahead to the next round.
            battle.progressState(function (res) {
                game.io.to(battle.id)
                    .emit('battle:update', {
                        code: res.code,
                        message: res.message,
                        battle: battle.serialize()
                    });
            });
        }
        else {
            game.io.to(battle.id)
                .emit('battle:update', {
                    code: 400,
                    message: 'Yer Coffers are dry, Bucko!',
                    battle: battle.serialize()
                });
        }


     }

    function onDisconnect(data) {
        console.log('onDisconnect ' + this.id);
        var player = playerById(this.id);
        if(!player) {
            console.error('Player not found?? ' + this.id);
            return;
        }
        game.players.splice(game.players.indexOf(player), 1);

        var battle = battleById(player.battleId);
        if(battle) {
            battle.removePlayer(player);
            if(battle.getPlayers().length == 0)
            {
                //This was the last player in the battle.
                //We need to remove the battle.
                game.battles.splice(game.battles.indexOf(battle), 1);
                console.log('Removing empty battle room: ' + battle.id);
            }
            game.io.sockets.to(battle.id)
                .emit('battle:playerLeft');
        }
    }

    //returns the matching player.
    function playerById(id) {
        for(var i = 0; i < game.players.length; i++) {
            if(game.players[i].id == id) {
                return game.players[i];
            }
        }
        return null;
    }
    //returns the matching player
    function playerByName(name) {
        for(var i = 0; i < game.players.length; i++) {
            if(game.players[i].name == name) {
                return game.players[i];
            }
        }
        return null;
    }
    //return the matching battle
    function battleById(id) {
        for(var i = 0; i < game.battles.length; i++) {
            if(game.battles[i].id == id) {
                return game.battles[i];
            }
        }
        return null;
    }
    //return the matching battle
    function battleByName(name) {
        for(var i = 0; i < game.battles.length; i++) {
            if(game.battles[i].name == name) {
                return game.battles[i];
            }
        }
        return null;
    }
    //returns a list of rooms with only 1 player
    function getOpenRooms() {
        var rooms = [];
        for(var i = 0; i < game.battles.length; i++) {
            if(game.battles[i].isOpen())
                rooms.push(game.battles[i]);
        }
        return rooms;
    }

    init(io);

});