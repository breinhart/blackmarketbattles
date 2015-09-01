/**
 * Created by breinhart on 8/14/15.
 */
angular.module('app.lobby', [])
    .controller('LobbyController', ['$scope', '$routeParams', '$location', 'Room', 'User', 'Battle', function($scope, $routeParams, $location, Room, User, Battle) {
        var lobby = this;
        lobby.createRoom = createRoom;
        lobby.joinRoom = joinRoom;

        activate();

        function activate() {
            Room.queryRoomList();
            lobby.user = User.getUser();
            lobby.errorText = '';

            $scope.$on('rooms:update', function() {
                lobby.rooms = Room.getRooms();
            });

            $scope.$on('rooms:joined', function(event, data) {
                if(data.code == 200) {
                    $location.path('/battle/' + data.battle.id);
                }
                else {
                    lobby.errorText = data.message;
                }
            })
        }

        function createRoom() {
            Room.createRoom(lobby.user.name + "'s Room");
        }

        function joinRoom(id) {
            Room.joinRoom(id);
        }

    }])
