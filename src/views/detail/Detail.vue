<template>
  <div id="detail">
    <DetailNavBar class="detailNavBar" ref="nav" @titleClick="titleClick"/>
    <Scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <DetailSwiper :top-images="topImages"/>
      <DetailBaseInfo :goods="goods"/>
      <DetailShopInfo :shop="shop"/>
      <DetailGoodsInfo :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <DetailParamInfo ref="params" :param-info="paramInfo"/>
      <DetailCommentInfo ref="comment" :comment-info="commentInfo"/>
      <GoodsList ref="recommend" :goods="recommends"/>
    </Scroll>
    <BackTop @click.native="backClick" v-show="isShowBackTop"/>
    <DetailBottomBar @addToCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  //导入第三方组件
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail";
  import {itemListenerMixin, backTopMixin} from "common/mixin";
  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        currentIndex: 0,
      }
    },
    created() {
      this.iid = this.$route.params.iid;
      getDetail(this.iid).then(res => {
        const data = res.result;

        //轮播图
        this.topImages = data.itemInfo.topImages;

        //商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

        //店铺信息
        this.shop = new Shop(data.shopInfo);

        //商品详情信息
        this.detailInfo = data.detailInfo;

        //参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      });
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
    },
    mounted() {
    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh();
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        if (this.$refs.comment.$el.offsetTop !== undefined) {
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        } else {
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        }
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        this.listenShowBackTop(position);
        for (let i = 0; i < this.themeTopYs.length - 1; i++) {
          if (this.currentIndex !== i &&
            (-position.y) >= this.themeTopYs[i] && (-position.y) < this.themeTopYs[i + 1]) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      },
      addToCart() {
        const product = {};
        product.iid = this.iid;
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.checked = true;
        this.addCart(product).then(res => {
          this.$toast.show(res)
        })
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    height: 100vh;
    background-color: #ffffff;
  }

  .detailNavBar {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }

  .content {
    height: calc(100% - 44px - 58px);
  }
</style>
