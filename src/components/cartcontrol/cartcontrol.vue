<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCart"></div>
    </transition>
    <transition name="fade">
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    </transition>
    <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>
<script>
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart() {
      if (!this.food.count) {
        this.$emit('setcount', this.food, 1)
      } else {
        this.$emit('setcount', this.food, this.food.count + 1)
      }
      this.$emit('add', event.target)
    },
    decreaseCart() {
      if (this.food.count <= 0) {
        return
      }
      this.$emit('setcount', this.food, this.food.count - 1)
    }
  }
}
</script>
<style lang="stylus" scoped>
.cartcontrol
  font-size: 0
  .cart-decrease, .cart-add
    display: inline-block
    padding: 6px
    font-size: 24px
    line-height: 24px
    color: rgb(0, 160, 220)
  .cart-count
    display: inline-block
    font-size: 10px
    text-align: center
    line-height: 24px
    color: rgb(147, 153, 159)
    vertical-align: top
    width: 12px
    padding-top: 6px
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
  .cart-decrease
    opacity: 1
    rotate(0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.5s
    &.move-enter, &.move-leave-to
      opacity: 0
      transform: translate3d(24px, 0, 0) rotate(180deg)
</style>
