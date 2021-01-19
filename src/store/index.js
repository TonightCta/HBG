import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
  },
  getters,
  /**
   * @for vuex
   * @date date 2020-11-02
   * @author 崔田
   * @param state 暂存数据
   * @param mutations 写入数据
   */
  state:{
    allEOS:null,//EOS生成总量
    allUSDB:null,//USDB生成总额
    fivePrice:null,//EOS五分钟均价
    nowPrice:null,//EOS实时价格
    USDBConfig:{},//USDB配置
  },
  mutations:{
    allEos_fn(state,opt){
      state.allEOS = opt;
    },
    allUSDB_fn(state,opt){
      state.allUSDB = opt;
    },
    fivePrice_fn(state,opt){
      state.fivePrice = opt;
    },
    nowPrice_fn(state,opt){
      state.nowPrice = opt;
    },
    USDBConfig_fn(state,opt){
      state.USDBConfig = opt;
    }
  }
});

export default store;
