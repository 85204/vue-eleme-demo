<template>
  <div class="shopcart">
    <div class="content">
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
      <div class="content-right">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
    }
  }
}
</script>
<style lang="stylus" scoped>
.shopcart
  position: fixed
  bottom: 0
  width: 100%
  z-index: 50
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
</style>
