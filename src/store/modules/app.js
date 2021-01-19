function getStorage(key, defaults) {
  let data = localStorage.getItem(key);
  return data !== null ? data : defaults;
}

const app = {
  state: {
    rpcUrl: getStorage('rpcUrl', 'https://eos.blockeden.cn'),
    // 多语言
    language: getStorage('language', 'en'),
    // 账户信息
    account:  JSON.parse(getStorage('account', '{}')), // 账户信息
    // 池子数据
    pairs: JSON.parse(getStorage('pairs', '[]')),
    // 服务配置
    config: {},
    // 滑点设置
    slippageTolerance: parseInt(getStorage('slippageTolerance', '5')),
    // 可挖矿池子
    minePairs: [],
    // 统计信息
    statInfo: {},
    // 上次选的交易对
    lastPair: JSON.parse(getStorage('lastPair', '{}')),
    themeColor: '#ffa300',
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      localStorage.setItem('language', language);
    },
    SET_RPCURL: (state, rpcUrl) => {
      state.rpcUrl = rpcUrl;
      localStorage.setItem('rpcUrl', rpcUrl);
    },
    // 账户信息
    SET_ACCOUNT: (state, account) => {
      state.account = account;
      localStorage.setItem('account', JSON.stringify(account));
    },
    // pairs表
    SET_PAIRS: (state, pairs) => {
      state.pairs = pairs;
      localStorage.setItem('pairs', JSON.stringify(pairs));
    },
    // 服务配置
    SET_CONFIG: (state, config) => {
      state.config = config;
    },
    // 可挖矿池子
    SET_MINEPAIRS: (state, minePairs) => {
      state.minePairs = minePairs;
    },
    // 统计信息
    SET_STATINFO: (state, statInfo) => {
      state.statInfo = statInfo;
    },
    // 可挖矿池子
    SET_SLIPPAGETOLERANCE: (state, slippageTolerance) => {
      state.slippageTolerance = slippageTolerance;
      localStorage.setItem('slippageTolerance', slippageTolerance);
    },
    // 上次选的交易对
    SET_LASTPAIR: (state, lastPair) => {
      state.lastPair = lastPair;
      localStorage.setItem('lastPair', JSON.stringify(lastPair));
    },
  },
  actions: {
    setRpcUrl({ commit }, rpcUrl) {
      commit('SET_RPCURL', rpcUrl);
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    // 账户信息
    setAccount({ commit }, account) {
      commit('SET_ACCOUNT', account);
    },
    setPairs({ commit }, pairs) {
      commit('SET_PAIRS', pairs);
    },
    setConfig({ commit }, config) {
      commit('SET_CONFIG', config);
    },
    setMinePairs({ commit }, minePairs) {
      commit('SET_MINEPAIRS', minePairs);
    },
    setStatInfo({ commit }, statInfo) {
      commit('SET_STATINFO', statInfo);
    },
    setSlippageTolerance({ commit }, slippageTolerance) {
      commit('SET_SLIPPAGETOLERANCE', slippageTolerance);
    },
    setLastPair({ commit }, pair) {
      commit('SET_LASTPAIR', pair);
    },
  }
};

export default app;
