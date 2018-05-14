<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" :class="{'current':currentIndex===i}" v-for="(item,i) in goods" :key="item.name" @click="selectMenu(i,$event)">
          <span class="text border-1px">
            <icon class="icon" v-if="item.type>0" :sizeType="'icon3'" :typeNum="item.type"></icon>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="foods-list food-list-hook" v-for="item in goods" :key="item.name">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item border-1px" v-for="food in item.foods" :key="food.name" @click="selectFood(food,$event)">
              <div class="icon">
                <img width="57px" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartControl :food="food" @setcount="handleSetCount" @add="addFood" />
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <food :food="selectedFood" @setcount="handleSetCount" @add="addFood" ref="food" />
    <shopcart ref="shopcart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods" @setcount="handleSetCount" @add="addFood" @empty="handleEmpty" />
  </div>
</template>

<script>
import icon from '../icon/icon'
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartControl from '../cartcontrol/cartcontrol'
import Vue from 'vue'
import food from '../food/food'

const ERR_OK = 0

export default {
  components: {
    icon, shopcart, cartControl, food
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectFoods: [], // 在购物车里的数据
      selectedFood: {}, // 选择的数据
    }
  },
  created() {
    (async () => {
      const res = await this.$http.get('/api/goods')
      const data = res.data
      if (data.errno === ERR_OK) {
        this.goods = data.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })()
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        const height1 = this.listHeight[i]
        const height2 = this.listHeight[i + 1]
        // -1有时候滚不到位
        if (!height2 || (this.scrollY >= height1 - 1 && this.scrollY < height2 - 1)) {
          return i
        }
      }
      return 0
    },
  },
  methods: {
    selectFood(food, event) {
      this.selectedFood = food
      this.$refs.food.show()
    },
    selectMenu(index, event) {
      // if (!event._constructed) {
      //   return;
      // }
      // 桌面环境下也已经不会触发原生事件了
      let foodlist = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodlist[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3,
        // 传出滚动位置
        click: true
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight() {
      let foodlist = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodlist.length; i++) {
        const item = foodlist[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    handleSetCount(item, v) {
      if (!item.count) {
        Vue.set(item, 'count', v)
        this.selectFoods.push(item)
      } else {
        item.count = v
      }
      // 删除购物车中count为0的食物
      if (v === 0) {
        this.selectFoods.splice(this.selectFoods.findIndex(food => food === item), 1)
      }
    },
    addFood(target) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    handleEmpty() {
      for (let i = 0; i < this.selectFoods.length; i++) {
        const food = this.selectFoods[i]
        food.count = 0
      }
      this.selectFoods = []
    }
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
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        .text
          border-none()
          font-weight: 700
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
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        margin-bottom: 0
        border-none()
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            font-size: 10px
            text-decoration: line-through
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>
