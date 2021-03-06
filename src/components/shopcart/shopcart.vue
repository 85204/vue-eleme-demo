<template>
  <div class="shopcart">
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleList"></div>
    </transition>
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight:totalCount>0}">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight:totalPrice>0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}</div>
      </div>
      <div class="content-right" @click.stop="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="(ball,i) in balls" :key="i">
        <transition @before-enter="beforeenter" @enter="enter" @after-enter="afterenter" :css="false">
          <div v-show="ball.show" class="ball">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,i) in selectFoods" :key="i">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>¥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartControl :food="food" @setcount="handleSetCount" @add="addFood" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import cartControl from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'

export default {
  components: {
    cartControl
  },
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryPrice: {
      type: Number
    },
    minPrice: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      balls: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }],
      listShow: false
    }
  },
  created() {
    // 三个指针 实现环的数据结构
    this.startBallPoint = 0
    this.usedBallPoint = 0
    this.endBallPoint = this.balls.length - 1
  },
  computed: {
    totalPrice() {
      let total = 0
      for (let i = 0; i < this.selectFoods.length; i++) {
        const food = this.selectFoods[i]
        total += food.price * food.count
      }
      return total
    },
    totalCount() {
      let count = 0
      for (let i = 0; i < this.selectFoods.length; i++) {
        const food = this.selectFoods[i]
        count += food.count
      }
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}起送`
      }
      if (this.totalPrice < this.minPrice) {
        return `还差¥${this.minPrice - this.totalPrice}起送`
      }
      if (this.totalPrice >= this.minPrice) {
        return '去结算'
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      }
      if (this.totalPrice >= this.minPrice) {
        return 'enough'
      }
    },
  },
  methods: {
    _getNext(now) {
      return now === this.balls.length - 1
        ? 0
        : now + 1
    },
    _hasUnusedBall() {
      const next = this._getNext(this.endBallPoint)
      return this.balls[next].show
        ? false
        : this.balls[next]
    },
    drop(ref) {
      // balls是一个环，取用按环的方式，若没有则放弃
      let ball = this._hasUnusedBall()
      if (ball) {
        this.endBallPoint = this._getNext(this.endBallPoint)
        ball.ref = ref
        ball.show = true
      }
    },
    beforeenter(ref) {
      let ball = this.balls[this.startBallPoint]
      let rect = ball.ref.getBoundingClientRect()
      let x = rect.left - 32
      let y = -(window.innerHeight - rect.top - 22)
      ref.style.display = ''
      ref.style.webkitTransform = `translate3d(0,${y}px,0)`
      ref.style.transform = `translate3d(0,${y}px,0)`
      let inner = ref.getElementsByClassName('inner-hook')[0]
      inner.style.webkitTransform = `translate3d(${x}px,0,0)`
      inner.style.transform = `translate3d(${x}px,0,0)`
      this.startBallPoint = this._getNext(this.startBallPoint)
    },
    enter(ref, done) {
      /* eslint-disable no-unused-vars */
      let rf = ref.offsetWidth
      this.$nextTick(() => {
        ref.style.webkitTransform = 'translate3d(0,0,0)'
        ref.style.transform = 'translate3d(0,0,0)'
        let inner = ref.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
        ref.addEventListener('transitionend', done)
      })
    },
    afterenter(ref) {
      let ball = this.balls[this.usedBallPoint]
      ball.show = false
      ref.style.display = 'none'
      this.usedBallPoint = this._getNext(this.usedBallPoint)
    },
    toggleList() {
      if (this.totalCount === 0) {
        return
      }
      this.listShow = !this.listShow
      if (this.listShow) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    },
    handleSetCount() {
      this.$emit('setcount', ...arguments)
    },
    addFood() {
      this.$emit('add', ...arguments)
    },
    empty() {
      this.$emit('empty')
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return
      }
      alert('go')
    }
  },
  watch: {
    totalCount() {
      if (this.totalCount === 0) {
        this.listShow = false
      }
    }
  }
}
</script>
<style lang="stylus">
@import '../../common/stylus/mixin.styl'

.shopcart
  position: fixed
  bottom: 0
  width: 100%
  z-index: 50
  .list-mask
    position: fixed
    top: 0
    width: 100%
    height: 100%
    background: rgba(7, 17, 27, 0.6)
    z-index: -2
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.1s
    &.fade-enter, &.fade-leave-to
      opacity: 0
  .content
    display: flex
    font-size: 0
    color: rgba(255, 255, 255, 0.4)
    .content-left
      flex: 1
      height: 48px
      background: #141d27
      .logo-wrapper
        display: inline-block
        position: relative
        top: -10px
        margin: 0px 12px
        padding: 6px
        width: 56px
        height: 56px
        box-sizing: border-box
        vertical-align: top
        border-radius: 50%
        background: #141d27
        .logo
          height: 100%
          width: 100%
          border-radius: 50%
          text-align: center
          background: #2b343c
          &.highlight
            background: rgb(0, 160, 220)
            .icon-shopping_cart
              color: #fff
          .icon-shopping_cart
            font-size: 24px
            line-height: 44px
            color: #80858a
        .num
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px
          font-size: 9px
          font-weight: 700
          color: #fff
          background: rgb(240, 20, 20)
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display: inline-block
        vertical-align: top
        margin: 0
        padding: 12px 12px 12px 0
        font-weight: 700
        line-height: 24px
        font-size: 16px
        &.highlight
          color: #fff
      .desc
        display: inline-block
        vertical-align: top
        margin: 6px 0
        padding: 6px 0 6px 12px
        border-left: 1px solid rgba(255, 255, 255, 0.1)
        font-size: 10px
        line-height: 24px
    .content-right
      height: 48px
      flex: 0 0 105px
      width: 105px
      background: #2b333b
      .pay
        height: 48px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        &.not-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
  .ball-container
    .ball
      position: fixed
      left: 32px
      bottom: 22px
      z-index: 200
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background: rgb(0, 160, 220)
        transition: all 0.4s linear
  .shopcart-list
    position: absolute
    top: 0
    left: 0
    z-index: -1
    width: 100%
    transform: translate3d(0, -100%, 0)
    &.fold-enter, &.fold-leave-to
      transform: translate3d(0, 0, 0)
    &.fold-enter-active, &.fold-leave-active
      transition: all 0.1s linear
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: #f3f5f7
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .title
        float: left
        font-size: 17px
        color: rgb(7, 17, 27)
      .empty
        float: right
        font-size: 12px
        color: rgb(0, 160, 220)
    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background: #fff
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        .name
          line-height: 24px
          font-size: 14px
          color: rgb(7, 17, 27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-weight: 700
          font-size: 14px
          color: rgb(240, 20, 20)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 6px
</style>
