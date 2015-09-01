module.exports = {
    "matchId": {"type": Number, "unique": true},
    "region": String,
    "platformId": String,
    "matchMode": String,
    "matchType": String,
    "matchCreation": Number,
    "matchDuration": Number,
    "queueType": String,
    "mapId": Number,
    "season": String,
    "matchVersion": String,
    "participants": [{
        "teamId": Number,
        "spell1Id": Number,
        "spell2Id": Number,
        "championId": Number,
        "highestAchievedSeasonTier": String,
        "stats": {
            "winner": Boolean,
            "champLevel": Number,
            "item0": Number,
            "item1": Number,
            "item2": Number,
            "item3": Number,
            "item4": Number,
            "item5": Number,
            "item6": Number,
            "kills": Number,
            "deaths": Number,
            "assists": Number
        },
        "participantId": Number
    }],
    "participantIdentities": [{"participantId": Number}],
    "teams": [{
        "teamId": Number,
        "winner": Boolean,
        "firstBlood": Boolean,
        "firstTower": Boolean,
        "firstInhibitor": Boolean,
        "firstBaron": Boolean,
        "firstDragon": Boolean,
        "towerKills": Number,
        "inhibitorKills": Number,
        "baronKills": Number,
        "dragonKills": Number,
        "vilemawKills": Number,
        "dominionVictoryScore": Number,
        "bans": [{
            "championId": Number,
            "pickTurn": Number
        }]
    }]
}