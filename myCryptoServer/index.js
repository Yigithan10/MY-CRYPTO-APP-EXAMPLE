const PORT = 3000;
const express = require('express');
const socketIO = require('socket.io');
const https = require('https');

const server = express().listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});

const io = socketIO(server);

io.on('connection', socket => {
  console.log('Client Connected!');
  socket.on('disconnect', () => {
    console.log('Client Disconnected!');
  });
  // socket.on('message', data => {
  //   console.log(data);
  // });
});

const options = {
  hostname: 'api.coingecko.com',
  port: 443,
  path: '/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=true',
  method: 'GET',
};

setInterval(() => {
  https
    .request(options, response => {
      let str = '';
      response.on('data', chunk => (str += chunk));
      response.on('end', () => {
        const prices = JSON.parse(str).map(item => {
          return {
            id: item.id,
            name: item.name,
            symbol: item.symbol,
            current_price: item.current_price,
            image: item.image,
            market_cap_rank: item.market_cap_rank,
            price_change_percentage_24h: item.price_change_percentage_24h,
            sparkline_in_7d: item.sparkline_in_7d,
            high_24h: item.high_24h,
            low_24h: item.low_24h,
          };
        });
        io.emit('crypto', prices);
      });
    })
    .end();
}, 4000);