const axios = require("axios");
require("dotenv").config({path: "../.env"});
const needle = require("needle");

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

const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL = "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id";

const rules = [{ value: "giveaway" }];

// Get stream rules
async function getRules() {
    const response = await needle("get", rulesURL, {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
    });
    console.log(response.body);
    return response.body;
}

// Set stream rules
async function setRules() {
    const data = {
        add: rules,
    };

    const response = await needle("post", rulesURL, data, {
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
    });

  return response.body;
}

// Delete stream rules
async function deleteRules(rules) {
    if (!Array.isArray(rules.data)) {
        return null
    }

    const ids = rules.data.map((rule) => rule.id);

    const data = {
        delete: {
            ids: ids,
        },
    };

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
    });

    return response.body;
}

function streamTweets() {
    const stream = needle.get(streamURL, {
        headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
    });

    stream.on("data", (data) => {
        try {
            const json = JSON.parse(data);
            console.log(json);
        } catch (error) {}
    });

    return stream;
    
}

streamTweets();