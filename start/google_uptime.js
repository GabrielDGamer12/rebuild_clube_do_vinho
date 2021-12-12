var testar = async function tests(){

const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('1OUEhUTsHYSIwRku1MK9d5K9I9pIZqueUEZRMsi_BiCU');

const { client } = require("./client");

const { collectionUptime } = require("./mongologin");

const filteredDocs = (await collectionUptime.find({}, { projection: { _id: 0, restartnumber: 1 } }).toArray());    

await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];

  const rows = await sheet.getRows();

  let totalSeconds = client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  let uptime = `${days.toFixed()} dias, ${hours.toFixed()}:${minutes.toFixed()}:${seconds.toFixed()}`;

  rows[0 + filteredDocs[0].restartnumber].online = uptime;
  await rows[0 + filteredDocs[0].restartnumber].save();
};

setInterval(
    testar, 10000)


async function restartdatabase() {

    function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      await sleep(1000);
    const { collectionUptime } = require("./mongologin");

    const { GoogleSpreadsheet } = require('google-spreadsheet');

    const doc = new GoogleSpreadsheet('1OUEhUTsHYSIwRku1MK9d5K9I9pIZqueUEZRMsi_BiCU');

    const filteredDocs = (await collectionUptime.find({}, { projection: { _id: 0, restartnumber: 1 } }).toArray());    
    collectionUptime.updateOne({ restartnumber: filteredDocs[0].restartnumber }, { $set: { restartnumber: filteredDocs[0].restartnumber + 1 } });

    const date = new Date(new Date()-3600*1000*3);

    var datalocal = (date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds());

    await sleep(1000);

    const filteredDocs2 = (await collectionUptime.find({}, { projection: { _id: 0, restartnumber: 1 } }).toArray());

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      });
    
      await doc.loadInfo();
    
      const sheet = doc.sheetsByIndex[0];
    
      const rows = await sheet.getRows();
    
      rows[1 + filteredDocs[0].restartnumber].data = datalocal;
      await rows[1 + filteredDocs[0].restartnumber].save();

}

restartdatabase();