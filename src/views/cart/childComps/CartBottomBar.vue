<template>
  <div class="bottom-bar">
    <div class="check-content">
      <CheckButton class="check-button" :isChecked="isSelectAll" @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计：${{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";

  import {mapGetters} from 'vuex'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if (this.cartList.length === 0) return false;
        return !this.cartList.find(item => !item.checked)
      }
    },
    methods: {
      checkClick() {
        if (this.isSelectAll) {
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick(){
        if (!this.checkLength){
          this.$toast.show('请选择购买的商品')
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: #eeeeee;
  }

  .check-content {
    display: flex;
    align-items: center;
    width: 70px;
  }

  .check-button {
    line-height: 18px;
    margin-left: 10px;
    margin-right: 5px;
  }

  .price {
    flex: 1;
    margin-left: 20px;
  }

  .calculate {
    width: 100px;
    background-color: orangered;
    color: #fff;
    text-align: center;
  }
</style>
