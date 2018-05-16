<template>
  <div class="rating" ref="rating">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star class="star" :size="36" :score="seller.serviceScore" />
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore" />
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split/>
      <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :rating="ratings" @ratingType="handleRatingType" @toggleContent="toggleContent" />
      <div class="rating-wrapper">
        <ul v-show="ratings && ratings.length">
          <li class="rating-item" v-for="rating in ratings" :key="rating.rateTime" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score" />
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend&&rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend" :key="item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime|formatDate}}</div>
            </div>
          </li>
        </ul>
        <div class="no-rating" v-show="!ratings||!ratings.length">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script>
import star from '../star/star'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import { formatDate } from '../../common/js/date'
import BScroll from 'better-scroll'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2
const ERR_OK = 0

export default {
  components: {
    star, split, ratingselect
  },
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  created() {
    (async () => {
      const res = await this.$http.get('/api/ratings')
      const data = res.data
      if (data.errno === ERR_OK) {
        this.ratings = data.data
        this.$nextTick(() => {
          this.ratingScroll = new BScroll(this.$refs.rating, {
            click: true
          })
        })
      }
    })()
  },
  methods: {
    handleRatingType(type) {
      this.selectType = type
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent
    },
    needShow(type, text) {
      if (this.onlyContent && text === '') {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

.rating
  position: absolute
  top: 173px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .overview
    display: flex
    padding: 18px 0
    .overview-left
      flex: 0, 0, 137px
      width: 137px
      border-right: 1px solid rgba(7, 17, 27, 0.1)
      text-align: center
      padding: 6px 0
      @media screen and (max-width: 320px)
        flex: 0, 0, 100px
        width: 100px
      .score
        margin-bottom: 6px
        font-size: 24px
        line-height: 24px
        color: rgb(255, 153, 0)
      .title
        margin-bottom: 6px
        line-height: 12px
        font-size: 12px
        color: rgb(7, 17, 27)
      .rank
        line-height: 10px
        font-size: 10px
        color: rgb(147, 153, 159)
    .overview-right
      flex: 1
      padding: 6px 0 6px 24px
      @media screen and (max-width: 320px)
        padding: 6px 0 6px 6px
      .score-wrapper
        margin-bottom: 8px
        font-size: 0
        .title
          display: inline-block
          line-height: 18px
          font-size: 12px
          color: rgb(7, 17, 27)
        .star
          display: inline-block
          vertical-align: top
          margin: 0 12px
        .score
          display: inline-block
          line-height: 18px
          font-size: 12px
          color: rgb(255, 153, 0)
      .delivery-wrapper
        font-size: 0
        .title
          display: inline-block
          line-height: 18px
          font-size: 12px
          color: rgb(7, 17, 27)
        .delivery
          display: inline-block
          margin-left: 12px
          line-height: 18px
          font-size: 12px
          color: rgb(147, 153, 159)
  .rating-wrapper
    padding: 0 18px
    .rating-item
      display: flex
      padding: 18px 0
      border-1px(rgba(7, 17, 27, 0.1))
      .avatar
        flex: 0 0 28px
        width: 28px
        margin-right: 12px
        img
          border-radius: 50%
      .content
        position: relative
        flex: 1
        .name
          margin-bottom: 4px
          line-height: 12px
          font-size: 10px
          color: rgb(7, 17, 27)
        .star-wrapper
          margin-bottom: 6px
          font-size: 0
          .star
            display: inline-block
            margin-right: 6px
            vertical-align: top
          .delivery
            display: inline-block
            vertical-align: top
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
        .text
          line-height: 18px
          color: rgb(7, 17, 27)
          font-size: 12px
        .recommend
          margin-top: 8px
          line-height: 16px
          font-size: 0
          .icon-thumb_up, .item
            display: inline-block
            margin: 0 8px 4px 0
            font-size: 9px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .item
            padding: 0 6px
            border: 1px solid rgba(7, 17, 27, 0.1)
            border-radius: 1px
            color: rgb(147, 153, 159)
            background: #fff
        .time
          position: absolute
          top: 0
          right: 0
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
</style>
