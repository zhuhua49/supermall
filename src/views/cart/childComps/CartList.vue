<template>
  <div class="cart-list">
    <Scroll class="content" ref="scroll">
      <CartListItem v-for="(item, index) in cartList" :key="index" :itemInfo="item"/>
    </Scroll>
  </div>
</template>

<script>
  import Scroll from "components/common/scroll/Scroll";

  //导入第三方组件
  import CartListItem from "./CartListItem";

  import {mapGetters} from 'vuex'

  export default {
    name: "CartList",
    components: {
      Scroll,
      CartListItem
    },
    computed: {
      ...mapGetters(['cartList'])
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 40px - 49px);
  }

  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
