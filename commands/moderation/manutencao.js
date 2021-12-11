const { MongoClient } = require('mongodb');
const Discord = require("discord.js");

const { collectionMusic } = require("../../start/mongologin");

module.exports = {
    name: "manutencao",
    category: "moderation",
    run: async(client, message, args) => {
  if (!message.member.permissions.has("BAN_MEMBERS"))
    return message.reply(
      "Você não tem permissão para fazer isso!"
    );
  const collectionMusic = clientDB.db("cdvDB").collection("cdvMusic");

  const filteredDocs = (await collectionMusic.find({}, { projection: { _id: 0, statusmanutencao: 1 } }).toArray());

  var statusligardesligar = filteredDocs[0].statusmanutencao;//db.get("manutencaostatus");

  if((filteredDocs[0].statusmanutencao).includes("on")) {
    //db.set('manutencaostatus',`off`)
    collectionMusic.updateOne({ statusmanutencao: filteredDocs[0].statusmanutencao }, { $set: { statusmanutencao: "off" } });
    process.exit()
  }
  if((filteredDocs[0].statusmanutencao).includes("off")) {
    //db.set('manutencaostatus',`on`)
    collectionMusic.updateOne({ statusmanutencao: filteredDocs[0].statusmanutencao }, { $set: { statusmanutencao: "on" } });
    process.exit()
  }

  console.log(filteredDocs[0].statusmanutencao)
  //console.log(db.get("manutencaostatus"))
}};