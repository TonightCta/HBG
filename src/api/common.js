import http from '../utils/axios';

// 获取账号信息
// 获取服务器当前json格式时间戳(秒)
export async function getServerTime() {
  const start = Date.now();
  // todo: request from server
  const cost = Date.now() - start;
  const serverTime = Date.now();
  const timestamp = serverTime - parseInt(cost / 2);
  return {
    timestamp
  };
}
export async function getServeTime2(){
  const serverTime=await http.get('/common/time');
  return serverTime;
}
export async function announcement(params) {
  try {
    const result = await http.post('/common/announcement', params);
    return { status: !result.code, data: result.data };
  } catch (e) {
    return { status: 500, data: e.message };
  }
}
