(function() {
    var statics = require('./static.js');

    var Battle = function(config) {
        this.defaults = {
            startingKraken: 5,
            startingHealth: 100,
            ad: 15,
            heal: 20,
            roundTimer: 30000, //ms
            restTimer: 8000
        }
        this.id = config.id;
        this.name = config.name;
        this.db = config.db; // the database for getting our match
        this.players = config.players || [];
        this.startTime = null;
        this.roundStart = null;
        this.safeMatch = null; //This is the sanitized match we send to the client
        this.match = null;
        this.currentRound = 0;
        this.roundEndTime = 0;
        this.state = 'created';
        this.attackingPlayerIndex = -1;
        this.attacker = null;
        this.host = null;
        this.attackLog = [];
    }

    module.exports = Battle;

    Battle.prototype.addPlayer = function(player) {
        if (this.isOpen()) {
            this.players.push(player);
            if(this.players.length == 1) {
                //This is the host player
                this.host = player;
            }
        }
    }

    Battle.prototype.removePlayer = function(player) {
        this.players.splice(this.players.indexOf(player), 1);
    }

    Battle.prototype.isOpen = function() {
        return this.players.length < 2;
    }

    Battle.prototype.getPlayers = function() {
        return this.players;
    }

    Battle.prototype.performAction = function(action) {
        if(action == 'heal') {
            var kraken = this.attacker.getKraken();
            if(kraken < 5) {
                return false;
            }
            this.attacker.setKraken(kraken - 5);
            this.attacker.updateHealth(this.defaults.heal);
            this.attackLog.splice(0,0,{
                description: 'Yo ho ho!  ' + this.attacker.name + ' has healed for ' + this.defaults.heal + ' damage!',
                type: 'heal'
            });

        }
        else if(action == 'attack') {
            var kraken = this.attacker.getKraken();
            if(kraken < 2) {
                return false;
            }
            this.attacker.setKraken(kraken - 2);

            var idx = this.attackingPlayerIndex == 0 ? 1 : 0;
            var defender = this.players[idx];

            defender.updateHealth(-1*this.defaults.ad);
            this.attackLog.splice(0,0,{
                description: 'Arrgh!  ' + this.attacker.name + ' attacked ' + defender.name + ' for ' + this.defaults.ad + ' damage!',
                type: 'attack'
            });

            if(defender.getHealth() <= 0) {
                this.state = 'gameover';
                this.attackLog.splice(0,0,{
                    description: this.attacker.name + ' hast sent ' + defender.name + ' to Davy Jones\' Locker.',
                    type: 'attack'
                });
                this.attacker.isWinner = true;
            }
        }
        else if(action == 'end') {
            this.attackLog.splice(0,0,{
                description: this.attacker.name + ' hast yielded their turn',
                type: 'info'
            });
        }
        return true;
    }

    Battle.prototype.start = function() {
        this.startTime = new Date().getTime();
        this.roundStart = this.startTime;
        this.currentRound = 0;
        this.state = 'created';
        this.attackLog = [];

        for(var i = 0; i < this.players.length; i++) {
            this.players[i].setKraken(this.defaults.startingKraken);
            this.players[i].setHealth(this.defaults.startingHealth);
        }
    }

    Battle.prototype.progressState = function(callback) {
        var battle = this; //Save this to local variable for use inside the callback scope below.

        //We have either just started the battle, or are ending the previous round
        //Kick off the betting state
        if(battle.state == 'created' || battle.state == 'battle_turn2') {

            if(battle.state == 'battle_turn2') {
                for(var i = 0; i < this.players.length; i++) {
                    var newKraken = battle.players[i].getKraken() + battle.players[i].getIncome();
                    battle.players[i].setKraken(newKraken);
                }
            }

            battle.state = 'betting';
            battle.currentRound++;

            //get our match for this round
            this.db.getRandomMatch(function(err, match) {
                if(err) {
                    console.error(err);
                    callback({
                        code: 400,
                        message: err
                    });
                }
                else {
                    battle.currentMatch = match;
                    battle.roundStart = new Date().getTime();
                    //We don't want to send too many details to the client side.
                    //People could cheat!!
                    battle.safeMatch = sanitizeMatch(match)
                    battle.roundEndTime = battle.roundStart + battle.defaults.roundTimer;

                    callback({
                        code: 200,
                        message: 'success'
                    });
                }
            });
        }
        //If betting round is over
        else if(battle.state == 'betting') {
            battle.state = 'betResults';
            //figure out which team won.
            var winningTeam = this.currentMatch.teams[0].winner == true ? this.currentMatch.teams[0].teamId : this.currentMatch.teams[1].teamId;
            //Adjust each player's bets.
            for(var i = 0; i < this.players.length; i++) {
                this.players[i].getBetResult(winningTeam);
                this.players[i].resetBet();
            }
            battle.roundStart = new Date().getTime();
            battle.roundEndTime = battle.roundStart + battle.defaults.restTimer;

            //Default to sending a success back to router.
            callback({
                code: 200,
                message: 'success'
            });
        }
        else if(battle.state == 'betResults') {
            //Progress on to the battling phase.
            //Randomly select the first attacker
            battle.state = 'battle_turn1';
            battle.attackingPlayerIndex = Math.floor(Math.random() * 2);
            battle.attacker = battle.players[battle.attackingPlayerIndex];

            battle.roundStart = new Date().getTime();
            battle.roundEndTime = battle.roundStart + battle.defaults.roundTimer;

            //Default to sending a success back to router.
            callback({
                code: 200,
                message: 'success'
            });

        }
        else if(battle.state == 'battle_turn1') {
            battle.state = 'battle_turn2';

            battle.roundStart = new Date().getTime();
            battle.roundEndTime = battle.roundStart + battle.defaults.roundTimer;

            //The other player is now attacking
            battle.attackingPlayerIndex = battle.attackingPlayerIndex == 0 ? 1 : 0;
            battle.attacker = battle.players[battle.attackingPlayerIndex];

            //Default to sending a success back to router.
            callback({
                code: 200,
                message: 'success'
            });

        }

        if(battle.state == 'gameover') {
            //Default to sending a success back to router.
            callback({
                code: 200,
                message: 'success'
            });
        }


    }

    Battle.prototype.serialize = function() {
        var _players = [];
        for (var i = 0; i < this.players.length; i++) {
            _players.push(this.players[i].serialize());
        }
        //Calculate how much time is left in this round
        var currTime = new Date().getTime();
        var remainingTime = this.roundEndTime != null ? this.roundEndTime - currTime : -1;

        return {
            id: this.id,
            name: this.name,
            startTime: this.startTime,
            currentRound: this.currentRound,
            roundStart: this.roundStart,
            remainingTime: remainingTime,
            state: this.state,
            players: _players,
            match: this.safeMatch,
            attacker: this.attacker,
            attackLog: this.attackLog
        }
    }

    function sanitizeMatch(match) {
        if(match == null) {
            return match;
        }
        var m = {
            matchId: "Nice try, cheater...",
            matchDuration: match.matchDuration,
            participants: match.participants,
            itemUrl: statics.itemUrl
        };
        for(var i = 0; i < m.participants.length; i++) {
            //we don't want to give too much away
            delete m.participants[i].stats.winner;
            delete m.participants[i].stats.kills;
            delete m.participants[i].stats.deaths;
            delete m.participants[i].stats.assists;
            delete m.participants[i].stats.champLevel;

            //add the FQDN to the images
            m.participants[i].spell1Image = statics.spellUrl + statics.spells[m.participants[i].spell1Id].key + ".png";
            m.participants[i].spell2Image = statics.spellUrl + statics.spells[m.participants[i].spell2Id].key + ".png";
            m.participants[i].championImage = statics.champUrl + statics.champions[m.participants[i].championId].key + ".png";
            m.participants[i].championName = statics.champions[m.participants[i].championId].name;

        }
        return m;
    }
})();