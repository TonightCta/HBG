import http from '../utils/axios'




// 获取交易对做市本金
export async function getCapitals(params) {
  return new Promise((resolve, reject) => {
    http.post('/account/capitals', params).then((res) => {
      let result = Object.assign(res, {});
      // console.log(result);
      resolve({ status: !result.code, result });
    }, err => {
      reject(err)
    })
  })
}
