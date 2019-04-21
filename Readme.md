
# Vue-SSB



## Usage

Start the suggested sbot server setup:

```shell
node ssb-server.js
```

Add vue-ssb to your app, provide the remote websocket address gotten by running `ssb-server ws.getAddress` against a normally started ssb-server

```javascript
import Vue from 'vue'
import App from './App.vue'

import ssbclient from 'vue-ssb'
Vue.use(ssbclient, { remote: "ws://localhost:9000~shs:TXKFQehlyoSn8UJAIVP/k2BjFINC591MlBC2e2d24mA=" })

new Vue({
  render: h => h(App),
}).$mount('#app')
```


Load some posts into your component. Note that the $ssb client must be loaded async.

```html
<template>
  <div class="messages">
    <h1>Posts</h1>
    
    {{ messages }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: []
    }
  }
  methods: {
    messages_loaded: function(err, messages)
    {
      this.$data.messages = messages
    }
  },
  mounted: function()
  {
    // Async fetch and connect ssb
    this.$ssb.then((ssb) => {
      console.log(ssb.id) // who you are

      // Load 100 posts
      pull(
        ssb.query.read( { limit: 100 } ),
        pull.filter(msg => msg.value.content.type === 'post'),
        pull.collect(this.messages_loaded)
      )
    })
  }
}
</script>
 ```
