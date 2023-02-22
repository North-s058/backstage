import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
// import 'element-ui/lib/theme-chalk/index.css'
import "@/styles/element-theme-change.scss";
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
import categorySelect from "@/components/categorySelect/index.vue";
import hintButton from "@/components/HintButton/index.vue";
Vue.component(hintButton.name, hintButton);
Vue.component(categorySelect.name, categorySelect);
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === "production") {
  // NODE_ENV是 vue-cli-service 注入到环境当中的环境变量
  const { mockXHR } = require("../mock");
  mockXHR();
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);

Vue.config.productionTip = false;
import API from "@/api";
Vue.prototype.$API = API;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
