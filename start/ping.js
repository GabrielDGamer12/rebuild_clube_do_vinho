app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
const ping = new Date();
console.log((ping.getUTCHours() - 3) + ":" + ping.getUTCMinutes())
app.listen(process.env.PORT);