const ssbClient = require('ssb-client')
const ssbKeys = require('ssb-keys')

const default_settings = {
  manifest: {
    auth: 'async',
    address: 'sync',
    manifest: 'sync',
    multiserver: {
      parse: 'sync',
      address: 'sync'
    },
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
    replicate: {
      changes: 'source',
      upto: 'source',
      request: 'sync',
      block: 'sync'
    },
    backlinks: {
      read: 'source'
    },
    query: {
      read: 'source',
      explain: 'sync'
    }
  },
  caps: {
    shs: '1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=' // main ssb network
  }
}

export default {
  install (Vue, options) {
    const settings_with_defaults = {...default_settings, ...options }

    var keys = {}
    // Generate keys if they are missing  
    keys = ssbKeys.loadOrCreateSync("keys")
    
    Vue.prototype.$ssb = new Promise((resolve, reject) => {
      ssbClient(keys, settings_with_defaults, (err, ssb_inst) => {
        if(err) throw(err)
        resolve(ssb_inst)
      })
    })
  }
}