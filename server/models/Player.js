/**
 * Created by breinhart on 8/15/15.
 */
(function() {
    var Player = function(config) {
        this.id = config.id || '';
        this.name = config.name || 'Player';
        this.battleId = -1;
        this.kraken = 5;
        this.health = 0;
        this.incomeLevel = 1; //Kraken per round = 2 + (incomeLevel-1);
        this.betAmmount = 0;
        this.betTeam = 0;
        this.betSet = false;
        this.betResults = {
            wonLastRound: false,
            ammountWon: 0
        };
        this.isWinner = false;
        this.champion = null; //For furture use when I implement the champ battles.
    }

    module.exports = Player;

    Player.prototype.joinBattle = function(battle) {
        this.battleId = battle.id;
        this.health = 100;
        this.kraken = 5;
        battle.addPlayer(this)

        console.log(this.name + ' has joined ' + battle.name);
    }

    Player.prototype.setHealth = function(health) {
        this.health = health;
    }
    Player.prototype.getHealth = function() {
        return this.health;
    }

    Player.prototype.updateName = function(name) {
        this.name = name;
    }
    Player.prototype.updateHealth = function(amt) {
        this.health += amt;
    }

    Player.prototype.incrementIncome = function() {
        var cost = this.incomeLevel * 5;
        if(this.kraken < cost) {
            return {
                code: 400,
                message: "Ye coffers are dry, matey!"
            }
        }
        this.kraken -= cost;
        this.incomeLevel++;
        return {
            code: 200,
            incomeLevel: this.incomeLevel,
            message: "success"
        }
    }

    Player.prototype.setKraken = function(k) {
        this.kraken = k;
    }

    Player.prototype.getKraken = function() {
        return this.kraken;
    }

    Player.prototype.getIncome = function() {
        return 2 + (this.incomeLevel - 1);
    }

    /* Set the bet for the round*/
    Player.prototype.placeBet = function(team, bet) {
        if(!this.betSet) {
            //double check to make sure we have the kraken
            if(bet > this.kraken) {
                return false;
            }
            this.betSet = true;
            this.betTeam = team;
            this.betAmmount = bet;
            return true;
        }
        return false;
    }

    Player.prototype.resetBet = function() {
        this.betAmmount = 0;
        this.betTeam = 0;
        this.betSet = false;
    }

    Player.prototype.getBetResult = function(winningTeam) {
        if(winningTeam  == this.betTeam) {
            this.kraken += this.betAmmount;
            this.betResults.wonLastRound = true;
            this.betResults.ammountWon = this.betAmmount;
        }
        else {
            this.kraken -= this.betAmmount;
            this.betResults.wonLastRound = false;
            this.betResults.ammountWon = -1*this.betAmmount;
        }
     }

    Player.prototype.serialize = function() {
        return {
            id: this.id,
            name: this.name,
            battleId: this.battleId,
            kraken: this.kraken,
            income: this.getIncome(),
            betResults: this.betResults,
            health: this.health,
            isWinner: this.isWinner
        }
    }

})();