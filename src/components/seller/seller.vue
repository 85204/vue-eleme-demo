<template>
  <div class="seller" ref="seller">
    <div class="seller-wrapper">
      <div class="seller-header">
        <div class="title-wrapper">
          <h1 class="title">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="36" :score="seller.score" />
          </div>
          <div class="rating-count">({{seller.ratingCount}})</div>
          <div class="sell-count">月售{{seller.sellCount}}单</div>
        </div>
        <div class="number">
          <div class="min-price">
            <span class="title">起送价</span>
            <div class="content">
              <span class="num">{{seller.minPrice}}</span>
              <span class="text">元</span>
            </div>
          </div>
          <div class="delivery-price">
            <span class="title">商家配送</span>
            <div class="content">
              <span class="num">{{seller.deliveryPrice}}</span>
              <span class="text">元</span>
            </div>
          </div>
          <div class="delivery-time">
            <span class="title">平均配送时间</span>
            <div class="content">
              <span class="num">{{seller.deliveryTime}}</span>
              <span class="text">分钟</span>
            </div>
          </div>
        </div>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split/>
      <div class="annocement">
        <h1 class="title">公告与活动</h1>
        <p class="bulletin border-1px">{{seller.bulletin}}</p>
        <div class="activity-wrapper">
          <ul class="activity" v-for="support in seller.supports" :key="support.description">
            <li class="activity-item border-1px">
              <icon class="icon" :typeNum="support.type" :sizeType="'icon4'" />
              <span class="desc">{{support.description}}</span>
            </li>
          </ul>
        </div>
      </div>
      <split/>
      <div class="photo">
        <h1 class="title">商家实景</h1>
        <div class="photo-wrapper" ref="picWrapper">
          <ul class="photo-list" ref="picList">
            <li class="item" v-for="pic in seller.pics" :key="pic">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split/>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <div class="content">
          <ul class="info-list">
            <li class="info" v-for="info in seller.infos" :key="info">
              <span class="text">{{info}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import star from '../star/star'
import split from '../split/split'
import icon from '../icon/icon'
import BScroll from 'better-scroll'
import { loadFromLocal, saveToLocal } from '../../common/js/store'
export default {
  components: {
    star, split, icon
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      favorite: (() => {
        loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll()
      this._initPics()
    })
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  methods: {
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPics() {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        let width = (picWidth + margin) * this.seller.pics.length - margin
        this.$refs.picList.style.width = width + 'px'
        if (!this.picScroll) {
          this.picScroll = new BScroll(this.$refs.picWrapper, {
            scrollX: true,
            eventPassthrough: 'vertical'
          })
        } else {
          this.picScroll.refresh()
        }
      }
    },
    toggleFavorite() {
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  watch: {
    'seller'() {
      this.$nextTick(() => {
        this._initScroll()
        this._initPics()
      })
    }
  },
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

.seller
  position: absolute
  top: 174px
  left: 0
  bottom: 0
  width: 100%
  overflow: hidden
  .seller-header
    padding: 18px 18px 0 18px
    font-size: 0
    .favorite
      position: absolute
      top: 18px
      right: 18px
      width: 50px
      text-align: center
      .icon-favorite
        display: block
        margin-bottom: 4px
        font-size: 24px
        line-height: 24px
        color: #d4d6d9
        &.active
          color: rgb(240, 20, 20)
      .text
        font-size: 10px
        line-height: 10px
        color: rgb(77, 85, 93)
    .title-wrapper
      position: relative
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      .title
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
      .star-wrapper
        padding-top: 8px
        display: inline-block
        vertical-align: top
      .rating-count
        display: inline-block
        padding: 8px 0 0 2px
        line-height: 18px
        font-size: 10px
        text-align: center
      .sell-count
        display: inline-block
        padding: 8px 10px 0 12px
        line-height: 18px
        font-size: 10px
        text-align: center
    .number
      font-size: 0
      display: flex
      .min-price, .delivery-price, .delivery-time
        display: inline-block
        flex: 1
        margin: 18px 0
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        .title
          font-size: 10px
          line-height: 10px
          color: rgb(147, 153, 159)
        .content
          padding-top: 4px
          line-height: 24px
          color: rgb(7, 17, 27)
          font-weight: 200
          .num
            font-size: 24px
          .text
            font-size: 10px
      .delivery-time
        border-right: none
  .annocement
    padding: 0 18px
    .title
      font-size: 14px
      line-height: 14px
      color: rgb(7, 17, 27)
      padding-top: 18px
    .bulletin
      margin: 0 12px
      padding: 12px 0
      font-size: 12px
      line-height: 24px
      color: rgb(240, 20, 20)
      font-weight: 200
      border-1px(rgba(7, 17, 27, 0.1))
    .activity-wrapper
      .activity
        margin: 0 12px
        padding: 16px 0 16px 12px
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          display: inline-block
          font-size: 16px
          vertical-align: top
        .desc
          display: inline-block
          padding-left: 6px
          font-size: 12px
          line-height: 16px
          text-align: center
  .photo
    padding: 18px 0 18px 18px
    .title
      // padding-top: 18px
      font-size: 14px
      line-height: 14px
      color: rgb(7, 17, 27)
    .photo-wrapper
      padding-top: 18px
      height: 90px
      overflow: hidden
      white-space: nowrap
      .photo-list
        font-size: 0
        margin: 0
        .item
          display: inline-block
          height: 90px
          width: 120px
          padding-right: 6px
  .info
    padding: 18px 18px 0 18px
    .title
      font-size: 14px
      line-height: 14px
      color: rgb(7, 17, 27)
      padding-bottom: 12px
      border-1px(rgba(7, 17, 27, 0.1))
    .content
      .info
        padding: 16px 12px
        font-size: 12px
        line-height: 16px
        color: rgb(7, 17, 27)
        font-weight: 200
        border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
</style>
