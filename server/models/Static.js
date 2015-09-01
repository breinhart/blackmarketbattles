/**
 * Created by breinhart on 8/29/15.
 */
(function() {
    var version = "5.16.1";
    var champUrl = "//ddragon.leagueoflegends.com/cdn/" + version + "/img/champion/";
    var spellUrl = "//ddragon.leagueoflegends.com/cdn/" + version + "/img/spell/";
    var itemUrl = "//ddragon.leagueoflegends.com/cdn/" + version + "/img/item/";

    var champions = {
        "35": {
            "id": 35,
            "title": "the Demon Jester",
            "name": "Shaco",
            "key": "Shaco"
        },
        "36": {
            "id": 36,
            "title": "the Madman of Zaun",
            "name": "Dr. Mundo",
            "key": "DrMundo"
        },
        "33": {
            "id": 33,
            "title": "the Armordillo",
            "name": "Rammus",
            "key": "Rammus"
        },
        "34": {
            "id": 34,
            "title": "the Cryophoenix",
            "name": "Anivia",
            "key": "Anivia"
        },
        "39": {
            "id": 39,
            "title": "the Will of the Blades",
            "name": "Irelia",
            "key": "Irelia"
        },
        "157": {
            "id": 157,
            "title": "the Unforgiven",
            "name": "Yasuo",
            "key": "Yasuo"
        },
        "37": {
            "id": 37,
            "title": "Maven of the Strings",
            "name": "Sona",
            "key": "Sona"
        },
        "38": {
            "id": 38,
            "title": "the Void Walker",
            "name": "Kassadin",
            "key": "Kassadin"
        },
        "154": {
            "id": 154,
            "title": "the Secret Weapon",
            "name": "Zac",
            "key": "Zac"
        },
        "150": {
            "id": 150,
            "title": "the Missing Link",
            "name": "Gnar",
            "key": "Gnar"
        },
        "43": {
            "id": 43,
            "title": "the Enlightened One",
            "name": "Karma",
            "key": "Karma"
        },
        "42": {
            "id": 42,
            "title": "the Daring Bombardier",
            "name": "Corki",
            "key": "Corki"
        },
        "41": {
            "id": 41,
            "title": "the Saltwater Scourge",
            "name": "Gangplank",
            "key": "Gangplank"
        },
        "40": {
            "id": 40,
            "title": "the Storm's Fury",
            "name": "Janna",
            "key": "Janna"
        },
        "201": {
            "id": 201,
            "title": "the Heart of the Freljord",
            "name": "Braum",
            "key": "Braum"
        },
        "22": {
            "id": 22,
            "title": "the Frost Archer",
            "name": "Ashe",
            "key": "Ashe"
        },
        "23": {
            "id": 23,
            "title": "the Barbarian King",
            "name": "Tryndamere",
            "key": "Tryndamere"
        },
        "24": {
            "id": 24,
            "title": "Grandmaster at Arms",
            "name": "Jax",
            "key": "Jax"
        },
        "25": {
            "id": 25,
            "title": "Fallen Angel",
            "name": "Morgana",
            "key": "Morgana"
        },
        "26": {
            "id": 26,
            "title": "the Chronokeeper",
            "name": "Zilean",
            "key": "Zilean"
        },
        "27": {
            "id": 27,
            "title": "the Mad Chemist",
            "name": "Singed",
            "key": "Singed"
        },
        "28": {
            "id": 28,
            "title": "the Widowmaker",
            "name": "Evelynn",
            "key": "Evelynn"
        },
        "29": {
            "id": 29,
            "title": "the Plague Rat",
            "name": "Twitch",
            "key": "Twitch"
        },
        "3": {
            "id": 3,
            "title": "the Sentinel's Sorrow",
            "name": "Galio",
            "key": "Galio"
        },
        "161": {
            "id": 161,
            "title": "the Eye of the Void",
            "name": "Vel'Koz",
            "key": "Velkoz"
        },
        "2": {
            "id": 2,
            "title": "the Berserker",
            "name": "Olaf",
            "key": "Olaf"
        },
        "1": {
            "id": 1,
            "title": "the Dark Child",
            "name": "Annie",
            "key": "Annie"
        },
        "7": {
            "id": 7,
            "title": "the Deceiver",
            "name": "LeBlanc",
            "key": "Leblanc"
        },
        "30": {
            "id": 30,
            "title": "the Deathsinger",
            "name": "Karthus",
            "key": "Karthus"
        },
        "6": {
            "id": 6,
            "title": "the Headsman's Pride",
            "name": "Urgot",
            "key": "Urgot"
        },
        "32": {
            "id": 32,
            "title": "the Sad Mummy",
            "name": "Amumu",
            "key": "Amumu"
        },
        "5": {
            "id": 5,
            "title": "the Seneschal of Demacia",
            "name": "Xin Zhao",
            "key": "XinZhao"
        },
        "31": {
            "id": 31,
            "title": "the Terror of the Void",
            "name": "Cho'Gath",
            "key": "Chogath"
        },
        "4": {
            "id": 4,
            "title": "the Card Master",
            "name": "Twisted Fate",
            "key": "TwistedFate"
        },
        "9": {
            "id": 9,
            "title": "the Harbinger of Doom",
            "name": "Fiddlesticks",
            "key": "FiddleSticks"
        },
        "8": {
            "id": 8,
            "title": "the Crimson Reaper",
            "name": "Vladimir",
            "key": "Vladimir"
        },
        "19": {
            "id": 19,
            "title": "the Blood Hunter",
            "name": "Warwick",
            "key": "Warwick"
        },
        "17": {
            "id": 17,
            "title": "the Swift Scout",
            "name": "Teemo",
            "key": "Teemo"
        },
        "18": {
            "id": 18,
            "title": "the Yordle Gunner",
            "name": "Tristana",
            "key": "Tristana"
        },
        "15": {
            "id": 15,
            "title": "the Battle Mistress",
            "name": "Sivir",
            "key": "Sivir"
        },
        "16": {
            "id": 16,
            "title": "the Starchild",
            "name": "Soraka",
            "key": "Soraka"
        },
        "13": {
            "id": 13,
            "title": "the Rogue Mage",
            "name": "Ryze",
            "key": "Ryze"
        },
        "14": {
            "id": 14,
            "title": "The Undead Juggernaut",
            "name": "Sion",
            "key": "Sion"
        },
        "11": {
            "id": 11,
            "title": "the Wuju Bladesman",
            "name": "Master Yi",
            "key": "MasterYi"
        },
        "12": {
            "id": 12,
            "title": "the Minotaur",
            "name": "Alistar",
            "key": "Alistar"
        },
        "21": {
            "id": 21,
            "title": "the Bounty Hunter",
            "name": "Miss Fortune",
            "key": "MissFortune"
        },
        "20": {
            "id": 20,
            "title": "the Yeti Rider",
            "name": "Nunu",
            "key": "Nunu"
        },
        "107": {
            "id": 107,
            "title": "the Pridestalker",
            "name": "Rengar",
            "key": "Rengar"
        },
        "106": {
            "id": 106,
            "title": "the Thunder's Roar",
            "name": "Volibear",
            "key": "Volibear"
        },
        "105": {
            "id": 105,
            "title": "the Tidal Trickster",
            "name": "Fizz",
            "key": "Fizz"
        },
        "104": {
            "id": 104,
            "title": "the Outlaw",
            "name": "Graves",
            "key": "Graves"
        },
        "103": {
            "id": 103,
            "title": "the Nine-Tailed Fox",
            "name": "Ahri",
            "key": "Ahri"
        },
        "99": {
            "id": 99,
            "title": "the Lady of Luminosity",
            "name": "Lux",
            "key": "Lux"
        },
        "102": {
            "id": 102,
            "title": "the Half-Dragon",
            "name": "Shyvana",
            "key": "Shyvana"
        },
        "101": {
            "id": 101,
            "title": "the Magus Ascendant",
            "name": "Xerath",
            "key": "Xerath"
        },
        "412": {
            "id": 412,
            "title": "the Chain Warden",
            "name": "Thresh",
            "key": "Thresh"
        },
        "98": {
            "id": 98,
            "title": "Eye of Twilight",
            "name": "Shen",
            "key": "Shen"
        },
        "222": {
            "id": 222,
            "title": "the Loose Cannon",
            "name": "Jinx",
            "key": "Jinx"
        },
        "96": {
            "id": 96,
            "title": "the Mouth of the Abyss",
            "name": "Kog'Maw",
            "key": "KogMaw"
        },
        "223": {
            "id": 223,
            "title": "the River King",
            "name": "Tahm Kench",
            "key": "TahmKench"
        },
        "92": {
            "id": 92,
            "title": "the Exile",
            "name": "Riven",
            "key": "Riven"
        },
        "91": {
            "id": 91,
            "title": "the Blade's Shadow",
            "name": "Talon",
            "key": "Talon"
        },
        "90": {
            "id": 90,
            "title": "the Prophet of the Void",
            "name": "Malzahar",
            "key": "Malzahar"
        },
        "429": {
            "id": 429,
            "title": "the Spear of Vengeance",
            "name": "Kalista",
            "key": "Kalista"
        },
        "10": {
            "id": 10,
            "title": "The Judicator",
            "name": "Kayle",
            "key": "Kayle"
        },
        "421": {
            "id": 421,
            "title": "the Void Burrower",
            "name": "Rek'Sai",
            "key": "RekSai"
        },
        "89": {
            "id": 89,
            "title": "the Radiant Dawn",
            "name": "Leona",
            "key": "Leona"
        },
        "79": {
            "id": 79,
            "title": "the Rabble Rouser",
            "name": "Gragas",
            "key": "Gragas"
        },
        "117": {
            "id": 117,
            "title": "the Fae Sorceress",
            "name": "Lulu",
            "key": "Lulu"
        },
        "114": {
            "id": 114,
            "title": "the Grand Duelist",
            "name": "Fiora",
            "key": "Fiora"
        },
        "78": {
            "id": 78,
            "title": "the Iron Ambassador",
            "name": "Poppy",
            "key": "Poppy"
        },
        "115": {
            "id": 115,
            "title": "the Hexplosives Expert",
            "name": "Ziggs",
            "key": "Ziggs"
        },
        "77": {
            "id": 77,
            "title": "the Spirit Walker",
            "name": "Udyr",
            "key": "Udyr"
        },
        "112": {
            "id": 112,
            "title": "the Machine Herald",
            "name": "Viktor",
            "key": "Viktor"
        },
        "113": {
            "id": 113,
            "title": "the Winter's Wrath",
            "name": "Sejuani",
            "key": "Sejuani"
        },
        "110": {
            "id": 110,
            "title": "the Arrow of Retribution",
            "name": "Varus",
            "key": "Varus"
        },
        "111": {
            "id": 111,
            "title": "the Titan of the Depths",
            "name": "Nautilus",
            "key": "Nautilus"
        },
        "119": {
            "id": 119,
            "title": "the Glorious Executioner",
            "name": "Draven",
            "key": "Draven"
        },
        "432": {
            "id": 432,
            "title": "the Wandering Caretaker",
            "name": "Bard",
            "key": "Bard"
        },
        "245": {
            "id": 245,
            "title": "the Boy Who Shattered Time",
            "name": "Ekko",
            "key": "Ekko"
        },
        "82": {
            "id": 82,
            "title": "the Master of Metal",
            "name": "Mordekaiser",
            "key": "Mordekaiser"
        },
        "83": {
            "id": 83,
            "title": "the Gravedigger",
            "name": "Yorick",
            "key": "Yorick"
        },
        "80": {
            "id": 80,
            "title": "the Artisan of War",
            "name": "Pantheon",
            "key": "Pantheon"
        },
        "81": {
            "id": 81,
            "title": "the Prodigal Explorer",
            "name": "Ezreal",
            "key": "Ezreal"
        },
        "86": {
            "id": 86,
            "title": "The Might of Demacia",
            "name": "Garen",
            "key": "Garen"
        },
        "84": {
            "id": 84,
            "title": "the Fist of Shadow",
            "name": "Akali",
            "key": "Akali"
        },
        "85": {
            "id": 85,
            "title": "the Heart of the Tempest",
            "name": "Kennen",
            "key": "Kennen"
        },
        "67": {
            "id": 67,
            "title": "the Night Hunter",
            "name": "Vayne",
            "key": "Vayne"
        },
        "126": {
            "id": 126,
            "title": "the Defender of Tomorrow",
            "name": "Jayce",
            "key": "Jayce"
        },
        "69": {
            "id": 69,
            "title": "the Serpent's Embrace",
            "name": "Cassiopeia",
            "key": "Cassiopeia"
        },
        "127": {
            "id": 127,
            "title": "the Ice Witch",
            "name": "Lissandra",
            "key": "Lissandra"
        },
        "68": {
            "id": 68,
            "title": "the Mechanized Menace",
            "name": "Rumble",
            "key": "Rumble"
        },
        "121": {
            "id": 121,
            "title": "the Voidreaver",
            "name": "Kha'Zix",
            "key": "Khazix"
        },
        "122": {
            "id": 122,
            "title": "the Hand of Noxus",
            "name": "Darius",
            "key": "Darius"
        },
        "120": {
            "id": 120,
            "title": "the Shadow of War",
            "name": "Hecarim",
            "key": "Hecarim"
        },
        "72": {
            "id": 72,
            "title": "the Crystal Vanguard",
            "name": "Skarner",
            "key": "Skarner"
        },
        "236": {
            "id": 236,
            "title": "the Purifier",
            "name": "Lucian",
            "key": "Lucian"
        },
        "74": {
            "id": 74,
            "title": "the Revered Inventor",
            "name": "Heimerdinger",
            "key": "Heimerdinger"
        },
        "75": {
            "id": 75,
            "title": "the Curator of the Sands",
            "name": "Nasus",
            "key": "Nasus"
        },
        "238": {
            "id": 238,
            "title": "the Master of Shadows",
            "name": "Zed",
            "key": "Zed"
        },
        "76": {
            "id": 76,
            "title": "the Bestial Huntress",
            "name": "Nidalee",
            "key": "Nidalee"
        },
        "134": {
            "id": 134,
            "title": "the Dark Sovereign",
            "name": "Syndra",
            "key": "Syndra"
        },
        "133": {
            "id": 133,
            "title": "Demacia's Wings",
            "name": "Quinn",
            "key": "Quinn"
        },
        "59": {
            "id": 59,
            "title": "the Exemplar of Demacia",
            "name": "Jarvan IV",
            "key": "JarvanIV"
        },
        "58": {
            "id": 58,
            "title": "the Butcher of the Sands",
            "name": "Renekton",
            "key": "Renekton"
        },
        "57": {
            "id": 57,
            "title": "the Twisted Treant",
            "name": "Maokai",
            "key": "Maokai"
        },
        "56": {
            "id": 56,
            "title": "the Eternal Nightmare",
            "name": "Nocturne",
            "key": "Nocturne"
        },
        "55": {
            "id": 55,
            "title": "the Sinister Blade",
            "name": "Katarina",
            "key": "Katarina"
        },
        "64": {
            "id": 64,
            "title": "the Blind Monk",
            "name": "Lee Sin",
            "key": "LeeSin"
        },
        "62": {
            "id": 62,
            "title": "the Monkey King",
            "name": "Wukong",
            "key": "MonkeyKing"
        },
        "63": {
            "id": 63,
            "title": "the Burning Vengeance",
            "name": "Brand",
            "key": "Brand"
        },
        "268": {
            "id": 268,
            "title": "the Emperor of the Sands",
            "name": "Azir",
            "key": "Azir"
        },
        "267": {
            "id": 267,
            "title": "the Tidecaller",
            "name": "Nami",
            "key": "Nami"
        },
        "60": {
            "id": 60,
            "title": "The Spider Queen",
            "name": "Elise",
            "key": "Elise"
        },
        "131": {
            "id": 131,
            "title": "Scorn of the Moon",
            "name": "Diana",
            "key": "Diana"
        },
        "61": {
            "id": 61,
            "title": "the Lady of Clockwork",
            "name": "Orianna",
            "key": "Orianna"
        },
        "266": {
            "id": 266,
            "title": "the Darkin Blade",
            "name": "Aatrox",
            "key": "Aatrox"
        },
        "143": {
            "id": 143,
            "title": "Rise of the Thorns",
            "name": "Zyra",
            "key": "Zyra"
        },
        "48": {
            "id": 48,
            "title": "the Troll King",
            "name": "Trundle",
            "key": "Trundle"
        },
        "45": {
            "id": 45,
            "title": "the Tiny Master of Evil",
            "name": "Veigar",
            "key": "Veigar"
        },
        "44": {
            "id": 44,
            "title": "the Gem Knight",
            "name": "Taric",
            "key": "Taric"
        },
        "51": {
            "id": 51,
            "title": "the Sheriff of Piltover",
            "name": "Caitlyn",
            "key": "Caitlyn"
        },
        "53": {
            "id": 53,
            "title": "the Great Steam Golem",
            "name": "Blitzcrank",
            "key": "Blitzcrank"
        },
        "54": {
            "id": 54,
            "title": "Shard of the Monolith",
            "name": "Malphite",
            "key": "Malphite"
        },
        "254": {
            "id": 254,
            "title": "the Piltover Enforcer",
            "name": "Vi",
            "key": "Vi"
        },
        "50": {
            "id": 50,
            "title": "the Master Tactician",
            "name": "Swain",
            "key": "Swain"
        }
    }

    var spells = {
        "1": {
            "id": 1,
            "name": "Cleanse",
            "key": "SummonerBoost"
        },
        "12": {
            "id": 12,
            "name": "Teleport",
            "key": "SummonerTeleport"
        },
        "30": {
            "id": 30,
            "name": "To the King!",
            "key": "SummonerPoroRecall"
        },
        "14": {
            "id": 14,
            "name": "Ignite",
            "key": "SummonerDot"
        },
        "6": {
            "id": 6,
            "name": "Ghost",
            "key": "SummonerHaste"
        },
        "32": {
            "id": 32,
            "name": "Mark",
            "key": "SummonerSnowball"
        },
        "7": {
            "id": 7,
            "name": "Heal",
            "key": "SummonerHeal"
        },
        "11": {
            "id": 11,
            "name": "Smite",
            "key": "SummonerSmite"
        },
        "3": {
            "id": 3,
            "name": "Exhaust",
            "key": "SummonerExhaust"
        },
        "31": {
            "id": 31,
            "name": "Poro Toss",
            "key": "SummonerPoroThrow"
        },
        "13": {
            "id": 13,
            "name": "Clarity",
            "key": "SummonerMana"
        },
        "2": {
            "id": 2,
            "name": "Clairvoyance",
            "key": "SummonerClairvoyance"
        },
        "21": {
            "id": 21,
            "name": "Barrier",
            "key": "SummonerBarrier"
        },
        "4": {
            "id": 4,
            "name": "Flash",
            "key": "SummonerFlash"
        },
        "17": {
            "id": 17,
            "name": "Garrison",
            "key": "SummonerOdinGarrison"
        }
    }

    var statics = {
        version: version,
        champUrl: champUrl,
        spellUrl: spellUrl,
        itemUrl: itemUrl,
        champions: champions,
        spells: spells
    }
    module.exports = statics;
})();
