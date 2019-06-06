var _ = require('lodash');
const ssbClient = require('ssb-client')
const ssbKeys = require('ssb-keys')

const default_settings = {
  manifest: 
  { 
    auth: 'async',
    address: 'sync',
    manifest: 'sync',
    multiserver: { parse: 'sync', address: 'sync' },
    multiserverNet: {},
    get: 'async',
    createFeedStream: 'source',
    createLogStream: 'source',
    messagesByType: 'source',
    createHistoryStream: 'source',
    createUserStream: 'source',
    createWriteStream: 'sink',
    links: 'source',
    add: 'async',
    publish: 'async',
    getAddress: 'sync',
    getLatest: 'async',
    latest: 'source',
    latestSequence: 'async',
    whoami: 'sync',
    progress: 'sync',
    status: 'sync',
    getVectorClock: 'async',
    version: 'sync',
    seq: 'async',
    usage: 'sync',
    clock: 'async',
    plugins:
     { install: 'source',
       uninstall: 'source',
       enable: 'async',
       disable: 'async' },
    gossip:
     { add: 'sync',
       remove: 'sync',
       connect: 'async',
       disconnect: 'async',
       changes: 'source',
       reconnect: 'sync',
       disable: 'sync',
       enable: 'sync',
       ping: 'duplex',
       get: 'sync',
       peers: 'sync' },
    replicate:
     { changes: 'source',
       upto: 'source',
       request: 'sync',
       block: 'sync' },
    friends:
     { hopStream: 'source',
       onEdge: 'sync',
       isFollowing: 'async',
       isBlocking: 'async',
       hops: 'async',
       help: 'sync',
       get: 'async',
       createFriendStream: 'source',
       stream: 'source' },
    backlinks: { read: 'source' },
    query: { read: 'source', explain: 'sync' },
    blobs:
     { get: 'source',
       getSlice: 'source',
       add: 'sink',
       rm: 'async',
       ls: 'source',
       has: 'async',
       size: 'async',
       meta: 'async',
       want: 'async',
       push: 'async',
       changes: 'source',
       createWants: 'source' },
    links2: { read: 'source' },
    ws: {},
    ebt:
     { replicate: 'duplex',
       request: 'sync',
       block: 'sync',
       peerStatus: 'sync' },
    ooo: { stream: 'duplex', get: 'async' }
  },
  caps: {
    shs: '1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=' // main ssb network
  }
}

export default {
  install (Vue, options) {
    const settings_with_defaults =  _.merge( default_settings, options )

    // Hosts to attempt to connect to
    var possible_remotes = [ settings_with_defaults.remote ]
    // var possible_remotes = [ "ws://192.168.0.109:8989~shs:5NWaVfaBIWV9fnXuI8xx+mVRf19m8XlCZkeMwxPyilk=", settings_with_defaults.remote ]
    
    var keys = {}

    // Generate keys if they are missing  
    keys = ssbKeys.loadOrCreateSync("keys")
    
    Vue.prototype.$ssb = new Promise((resolve, reject) => {
      // Try each remote in turn
      for (var i = possible_remotes.length - 1; i >= 0; i--) {
        var remote = possible_remotes[i]
        settings_with_defaults.remote = remote

        ssbClient(keys, settings_with_defaults, (err, ssb_inst) => {
          if(err) 
          {
            if(err.message === "could not connect to sbot")
            {
              // do nothing, try next
              console.log("unable to connect sbot at: ", remote)
              
            }
            else
            {
              console.log("Connected, but found some other error: ", err)
              // throw(err)
            }
          }
          else
          {
            console.log("<<Connected>> to:", remote)
            resolve(ssb_inst)
            // break
          }
        })
      }
    })
  }
}