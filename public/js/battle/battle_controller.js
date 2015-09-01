/**
 * Created by breinhart on 8/14/15.
 */
angular.module('app.battle', [])
    .filter('team', function() {
        return function(input, teamId) {
            if(!input)
                return null;

            var team = [];
            for(var i = 0; i < input.length; i++) {
                if(input[i].teamId == teamId)
                    team.push(input[i]);
            }
            return team;
        }
    })
    .controller('BattleController', [
        '$routeParams'
        , '$scope'
        , '$location'
        , 'Battle'
        , 'User'
        , '$interval'
        , function($routeParams, $scope, $location, Battle, User, $interval) {
            var vm = this; //using the standard vm instead of battle so that we can't confused by the service named Battle
            vm.battle = {};
            vm.user = {};
            vm.timer = null;
            vm.timeRemaining = 60;
            vm.bet = 0;
            vm.betPlaced = false;
            vm.setWager = setWager;
            vm.attack = attack;
            vm.heal = heal;
            vm.endTurn = endTurn;
            vm.errorMsg = "";

            activate();

            function activate() {
                vm.user = User.getUser();
                vm.battle = Battle.getBattle();

                $scope.$on('battle:updated', function(event, battle) {
                    vm.battle = battle;
                    vm.betPlaced = false;
                    vm.errorMsg = "";

                    if(vm.battle.state != 'gameover') {
                        startTimer();
                    }
                    else {
                        $interval.cancel(vm.timer);
                    }
                });
                $scope.$on('battle:updateFailed', function(event, data) {
                   vm.errorMsg = data.message;
                });
            }

            function startTimer() {
                vm.timeRemaining = parseInt(vm.battle.remainingTime / 1000);

                if(vm.timer != null)
                    $interval.cancel(vm.timer);

                vm.timer = $interval(function() {
                    vm.timeRemaining -= 1;
                    if (vm.timeRemaining < 0) {
                        vm.timeRemaining = 0;
                        $interval.cancel(vm.timer);
                        Battle.progressState();
                    }
                }, 1000)
            }

            function setWager(teamId) {
                if(angular.isNumber(vm.bet) && vm.bet >= 0) {
                    Battle.placeBet(teamId, vm.bet);
                    vm.betPlaced = true;

                }
                else {
                    vm.errorMsg = "Gar, Bucko, enter ye real bet or walk the plank.";
                }
            }
            function attack() {
                //don't want someone playing out of turn.
                if(vm.battle.attacker.id == vm.user.id) {
                    Battle.performAction('attack');
                }
            }
            function heal() {
                //don't want someone playing out of turn.
                if(vm.battle.attacker.id == vm.user.id) {
                    Battle.performAction('heal');
                }
            }
            function endTurn() {
                if(vm.battle.attacker.id == vm.user.id) {
                    Battle.performAction('end');
                }
            }


    }])