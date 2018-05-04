<template>
  <span :class="[classMap[typeNum],sizeType]"></span>
</template>
<script>
export default {
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  props: {
    typeNum: {
      type: Number,
      required: true
    },
    sizeType: {
      type: String
    }
  },
  computed: {

  },
  beforeMount() {

  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

.icon1
  width: 12px
  height: 12px
  background-size: 12px 12px
  background-repeat: no-repeat
  &.decrease
    bg-image('decrease_1')
  &.discount
    bg-image('discount_1')
  &.guarantee
    bg-image('guarantee_1')
  &.invoice
    bg-image('invoice_1')
  &.special
    bg-image('special_1')
.icon2
  width: 16px
  height: 16px
  background-size: 16px 16px
  background-repeat: no-repeat
  &.decrease
    bg-image('decrease_2')
  &.discount
    bg-image('discount_2')
  &.guarantee
    bg-image('guarantee_2')
  &.invoice
    bg-image('invoice_2')
  &.special
    bg-image('special_2')
.icon3
  width: 12px
  height: 12px
  background-size: 12px 12px
  background-repeat: no-repeat
  &.decrease
    bg-image('decrease_3')
  &.discount
    bg-image('discount_3')
  &.guarantee
    bg-image('guarantee_3')
  &.invoice
    bg-image('invoice_3')
  &.special
    bg-image('special_3')
.icon4
  width: 16px
  height: 16px
  background-size: 16px 16px
  background-repeat: no-repeat
  &.decrease
    bg-image('decrease_4')
  &.discount
    bg-image('discount_4')
  &.guarantee
    bg-image('guarantee_4')
  &.invoice
    bg-image('invoice_4')
  &.special
    bg-image('special_4')

</style>
