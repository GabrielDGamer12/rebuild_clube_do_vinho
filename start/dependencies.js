require("http").createServer((req, res) => res.end(process.version)).listen()
const Discord = require("discord.js");
const { Client, Message, MessageEmbed, Collection, WebhookClient } = require("discord.js");
const fs = require('fs');
const express = require('express');
const app = express();
require("./mongologin");
const config = require("../settings/config.json");
//require("./ping");

module.exports = { Client, Discord, Message, MessageEmbed, Collection, WebhookClient, fs, express, app };