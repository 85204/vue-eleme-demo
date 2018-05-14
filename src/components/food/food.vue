<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartControl :food="food" @setcount="handleSetCount" @add="addFood" />
          </div>
          <transition name="fade">
            <div class="buy" @click="addFirst" v-show="!food.count||food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info" />
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split v-show="food.info" />
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :rating="food.ratings" @ratingType="handleRatingType" @toggleContent="toggleContent" />
        </div>
      </div>
      <div class="back">
        <i class="icon-arrow_lift" @click="hide"></i>
      </div>
    </div>
  </transition>
</template>
<script>
import BScroll from 'better-scroll'
import cartControl from '../cartcontrol/cartcontrol'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2
export default {
  components: {
    cartControl, split, ratingselect
  },
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  computed: {
    // showFlag() {
    //   return this.food.name
    // }
  },
  methods: {
    hide() {
      this.showFlag = false
    },
    show() {
      this.selectType = ALL
      this.onlyContent = true
      this.showFlag = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    addFirst(event) {
      this.$emit('setcount', this.food, 1)
      this.addFood(event.target)
    },
    handleSetCount() {
      this.$emit('setcount', ...arguments)
    },
    addFood() {
      this.$emit('add', ...arguments)
    },
    handleRatingType(type) {
      this.selectType = type
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent
    }
  }
}
</script>
<style lang="stylus" scoped>
.food
  position: fixed
  top: 0
  left: 0
  bottom: 48px
  z-index: 30
  width: 100%
  background: #fff
  transform: translate3d(0, 0, 0)
  &.move-enter-active, &.move-leave-active
    transition: all 0.1s
  &.move-enter, &.move-leave-to
    transform: translate3d(100%, 0, 0)
  .back
    position: fixed
    top: 10px
    left: 0
    .icon-arrow_lift
      padding: 10px
      line-height: 20px
      font-size: 20px
      color: #fff
      text-shadow: 0px 0px 10px #000
  .food-content
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
    img
      position: absolute
      top: 0
      width: 100%
      height: 100%
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        font-size: 0
        height: 10px
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
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
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        font-size: 10px
        border-radius: 12px
        color: #fff
        background: rgb(0, 160, 220)
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-to
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        font-size: 12px
        line-height: 24px
        padding: 0 8px
        color: rgb(77, 15, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
</style>
