import DHT = require('bittorrent-dht');

var dht = new DHT({
  bootstrap: [
    'router.utorrent.com:6881',
    'router.bittorrent.com:6881',
    'dht.transmissionbt.com:6881',
    'router.bitcomet.com:6881',
    'dht.aelitis.com:6881',
  ]
})

dht.listen(20000, () => {
  console.log('now listening')
})

dht.on('peer', function (peer, infoHash, from) {
  console.log("peer, infoHash, from", peer, infoHash, from)
  console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
})

dht.on('node', function (node) {
  console.log("node", node)
  console.log('found node ' + node.host + ':' + node.port)
})

dht.on('error', function (err) {
  console.error('error', err)
})

dht.on('warning', function (err) {
  console.error('warning', err)
})

// find peers for the given torrent info hash
// dht.lookup('d2431b88fa128acc57a607c025c413e69a866adf')