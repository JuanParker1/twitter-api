const axios = require("axios");
const { parse } = require("dotenv");
require("dotenv").config({path: "../.env"});
const { stream } = require("xlsx");

const twitterAccounts = [
    { name: "Coinbase", id: "574032254" },
    { name: "Binance", id: "877807935493033984" }, 
    { name: "FTX", id: "1101264495337365504"},
    { name: "Huobi", id: "914029581610377217" },
    { name: "Kucoin", id: "910110294625492992" },
    { name: "Gate.io", id: "912539725071777792" },
    { name: "Mexc", id: "978566222282444800" },
    { name: "Binance.US", id: "1115465940831891457" },
  ];

async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 60 * 1000));
}

//using the old system, takes about 7-8 seconds to get the new tweet, which isn't bad, but also not great

async function getNewTweets() {
    var time = (new Date((Math.round(Date.now()-60000)))).toISOString();
    time = time.substring(0, 13) + "%3A" + time.substring(14, 16) + "%3A" + time.substring(17, 19)  + "Z";
    const url = `https://api.twitter.com/2/users/969707094357237761/tweets?exclude=replies%2Cretweets&start_time=${time}`;
    var tweets = await axios.get(url, {
        headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
    });
    if (tweets && tweets.data) {
        console.log(tweets.data.data);
    }
}

//--------------------------------------------------------------
//using the new system, where you can stream tweets in real time


const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL = "https://api.twitter.com/2/tweets/sample/stream"; // "https://api.twitter.com/2/tweets/search/stream"

const rules = [{ value: "from:kaan_548" }];

// Get stream rules
async function getRules() {
    const response = await axios.get(rulesURL, {
        headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
    });
    console.log(response.data);
    return response.data;
}

// Set stream rules
async function setRules() {
    const data = {
        add: rules,
    };

    const response = await axios.post(rulesURL, data, {
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
    });
    
    console.log(response.data);
    return response.data;
}

// Delete stream rules
async function deleteRules(rules) {
    if (!Array.isArray(rules.data)) {
        return null;
    }
    
    const ids = rules.data.map((rule) => rule.id);

    const data = {
        delete: {
            ids: ids,
        },
    };

    const response = await axios.post(rulesURL, data, {
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
    });

    return response.data;
}

//Doesn't work!
async function streamTweets() {
    const response = await axios.get(streamURL, {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
    });

    console.log(response);
}

streamTweets();