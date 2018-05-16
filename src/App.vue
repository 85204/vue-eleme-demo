<template>
  <div id="app">
    <Header :seller="seller"></Header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <div class="tail"></div>
    <keep-alive>
      <router-view :seller="seller"/>
    </keep-alive>
  </div>
</template>

<script>
import Header from './components/header/header'
const ERR_OK = 0
export default {
  name: 'App',
  data() {
    return {
      seller: {}
    }
  },
  created() {
    (async () => {
      const res = await this.$http.get('/api/seller')
      const data = res.data
      if (data.errno === ERR_OK) {
        this.seller = data.data
      }
    })()
  },
  components: {
    Header
  }
}
</script>

<style lang="stylus">
@import './common/stylus/mixin'

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
