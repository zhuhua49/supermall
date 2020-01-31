import Toast from "./Toast";

const obj = {};

obj.install = function (Vue) {
  const toastConstructor = Vue.extend(Toast);//创建组件构造器
  const toast = new toastConstructor();//创建组件对象
  toast.$mount(document.createElement('div'));//将组件对象挂载到元素上
  document.body.appendChild(toast.$el);//$el对应的就是div
  Vue.prototype.$toast = toast
};

export default obj
