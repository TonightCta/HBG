import http from '../utils/axios';

// 获取用户兑换记录
export async function swapLog(params) {
  try {
    const result = await http.post('/swap/swapHistory', params);
    return { status: !result.code, data: result.data };
  } catch (e) {
    return { status: 500, data: e.message };
  }
}

// 获取用户做市记录
export async function liquidityLog(params) {
  try {
    const result = await http.post('/swap/liquidityHistory', params);
    return { status: !result.code, data: result.data };
  } catch (e) {
    return { status: 500, data: e.message };
  }
}

// 获取用户做市记录
export async function swap24HInfo() {
  try {
    const result = await http.get('/swap/getSwapInfo');
    return { status: !result.code, data: result.data };
  } catch (e) {
    return { status: 500, data: e.message };
  }

  // return {
  //   volume: '9527.0000 EOS',
  //   count: 258,
  //   eosBalance: '12000.0000 EOS'
  // }
}
