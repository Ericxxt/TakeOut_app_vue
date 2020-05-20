<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab" border-1px>
      <div class="tab-item">
        <router-link tag="li" to="/goods">
        <a>商品</a>
        </router-link>
      </div>
      <div class="tab-item">
        <router-link tag="li" to="/ratings">
        <a>评论</a>
        </router-link>
      </div>
      <div class="tab-item">
        <router-link tag="li" to="/seller">
        <a>商家</a>
        </router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import header from './components/header/header.vue'
/* eslint-env es6 */
const ERR_OK=0;
export default {
  // name: 'header'
  // ERR_OK = 0,
  data() {
    return {
      seller: {}
    }
  },
  created() {
    this.$http.get('/api/seller').then((response) => {
      response =response.body
      if (response.errno === ERR_OK) {
        this.seller = response.data;
        // console.log(this.seller);
      }
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7,17,27,0.1)
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex: 1
      text-align: center
  //in this way below, you dont have to touch the text exactly  
  // & means this
      a
        display: block
        font-size: 14px
        color: rgb(77,85,93)
      li 
        &.router-link-active
          a
            color: rgb(240,20,20)
        

</style>
