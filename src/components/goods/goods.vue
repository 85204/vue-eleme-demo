<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li class="menu-item" v-for="item in goods" :key="item.name">
          <span class="text border-1px">
            <icon class="icon" v-if="item.type>0" :sizeType="'icon3'" :typeNum="item.type"></icon>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper"></div>
  </div>
</template>

<script>
import icon from '../icon/icon'

const ERR_OK = 0

export default {
  components: {
    icon
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: []
    }
  },
  created() {
    (async () => {
      const res = await this.$http.get('/api/goods')
      const data = res.data
      if (data.errno === ERR_OK) {
        this.goods = data.data
      }
    })()
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      line-height: 14px
      padding: 0 12px
      border-1px(rgba(7, 17, 27, 0.1))
      .text
        display: table-cell
        width: 56px
        font-size: 12px
        vertical-align: middle
        line-height: 12px
        .icon
          display: inline-block
          vertical-align: top
          margin-top: 1px
  .foods-wrapper
    flex: 1
</style>
