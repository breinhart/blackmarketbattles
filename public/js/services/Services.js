/**
 * Created by breinhart on 8/16/15.
 */
angular.module('app.services', [])
    .service('Room', function($rootScope, socket) {
        //Store the scope in a local variable for use outside of the scope.
        var room = this;
        //our rooms store (to go)... get it... the furniture store...
        var roomStore = [];

        activate();

        var roomService = {
            queryRoomList: queryRoomList,
            getRooms: getRooms,
            createRoom: createRoom,
            joinRoom: joinRoom
        }

        return roomService;

        function activate() {
            //Triggered after 'readOpenRooms' event is sent to the server
            socket.on('OpenRoomsUpdate', function(data) {
                //populate the room store
                roomStore = data;
                //Let all our controllers know of the update.
                $rootScope.$broadcast('rooms:update');
            });
        }

        function queryRoomList() {
            //Lend me your rooms
            socket.emit('readOpenRooms');
        }
        function getRooms() {
            //return our populated roomStore
            return roomStore;
        }
        function createRoom(roomName) {
            //create a new room with the following name
            //I call them battles on the server side because these are kind of like pseudo rooms.
            socket.emit('createBattle', {
                id: uuid.v4(),
                battleName: roomName
            });
        }
        function joinRoom(id) {
            socket.emit('joinBattle', {id: id});
        }



    })
    .service('User', function($rootScope, socket) {
        //use local storage
        var user = localStorage.getItem('user');

        activate();

        var userService = {
            remove: remove,
            create: create,
            getUser: getUser,
            exists: exists,
            updateuser: updateUser
        }

        return userService;

        function activate() {
            if(user != null && user != undefined) {
                user = JSON.parse(user);
            }

            socket.on('playerUpdated', function(data) {
                if(data.code == 200)
                {
                    //success
                    updateUser(data.player);
                    $rootScope.$broadcast('user:updated', user);
                }
                //otherwise, assume the name is taken
                else
                {
                    $rootScope.$broadcast('user:updateFailed', data);
                }
            });
        }

        function remove() {
            localStorage.removeItem('user');
            user = null;
        }
        function create(name) {
            if(name == null || name.length < 5) {
                $rootScope.$broadcast('user:updateFailed', {
                    code: 400,
                    message: "Yer name be invalid, savvy?"
                });
                return;
            }
            socket.emit('updatePlayer', {'name': name});
        }

        function getUser() {
            return user;
        }
        function exists() {
            //I think, therefore I am.
            //Err, I have a 4 character name, therefore I am.
            return user != null && user.name.length > 4;
        }
        function setUser(u) {
            localStorage.setItem('user', JSON.stringify(u));
            user = u;
        }
        function updateUser(config) {
            var u = getUser();

            //Are we updating an existing user?
            if(u) {
                //yes
                for(var opt in config) {
                    //set each property in the config.
                    //I could set the individually, but this is easier :P
                    u[opt] = config[opt];
                }
                //set the user
                setUser(u);
            }
            else {
                //We don't have a user, so just create a new one.
                setUser(config);
            }
        }
    })
    .service('Battle', function($rootScope, socket, User) {
        var battle = null;

        activate();

        var BattleService = {
            getBattle: getBattle,
            placeBet: placeBet,
            progressState: progressState,
            performAction: performAction
        }

        return BattleService;

        function activate() {
            socket.on('battle:update', battleUpdated);
            //Triggered after 'createBattle' or 'joinBattle' are called
            socket.on('battle:joined', battleJoined)
        }

        function progressState() {
            //progressState will trigger a battle:update event
            socket.emit('progressState');

        }

        function getBattle() {
            return battle;
        }

        function placeBet(teamId, bet) {
            socket.emit('placeBet', {
                team: teamId,
                bet: bet
            })
        }
        function performAction(action) {
            socket.emit('performAction', {
                action: action
            })
        }

        /* Socket Listener Function */
        function battleUpdated(data) {
            if(data.code == 200)
            {
                //success
                battle = data.battle;
                findMeAndOpponent();
                $rootScope.$broadcast('battle:updated', battle);
            }
            //otherwise, assume the name is taken
            else
            {
                $rootScope.$broadcast('battle:updateFailed', data);
            }
        }
        function battleJoined(data) {
            if(data.code == 200) {
                battle = data.battle;
                $rootScope.$broadcast('rooms:joined', data);
            }
            else
            {
                $rootScope.$broadcast('rooms:joinFailed', data);
            }
        }
        function findMeAndOpponent() {
            var user = User.getUser();
            battle.me = {};
            battle.opponent = {};
            for(var i = 0; i < battle.players.length; i++) {
                if(user.id == battle.players[i].id) {
                    battle.me = battle.players[i]
                }
                else {
                    battle.opponent = battle.players[i];
                }
            }
        }
    })