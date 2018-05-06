<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo">
            <i class="icon-shopping_cart"></i>
          </div>
        </div>
        <div class="price">￥</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay">￥{{minPrice}}起送</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    deliveryPrice: {
      type: Number
    },
    minPrice: {
      type: Number
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
          .icon-shopping_cart
            font-size: 24px
            line-height: 44px
            color: #80858a
      .price
        display: inline-block
        vertical-align: top
        margin: 0
        padding: 12px 12px 12px 0
        font-weight: 700
        line-height: 24px
        font-size: 16px
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
</style>
