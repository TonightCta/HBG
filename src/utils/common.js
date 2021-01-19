import moment from 'dayjs';
import store from '../store/index'
import EosTool from './eostool'

export function id_to_symbol(number) {
  let str = '';
  while (number > 0) {
    let m = number % 26;
    if (m == 0) m = 26;
    str = String.fromCharCode(m + 64) + str;
    number = (number - m) / 26;
  }
  return 'LP' + str;
}

export function symbol_to_id(symbol) {
  let ans = 0;
  let s = symbol.length > 2 && symbol.substr(0, 2) == 'LP' ? symbol.substr(2) : symbol;
  const len = s.length;
  for (let i = 0, j = 1; i < len; i++, j *= 26) {
    ans += parseInt(s.charCodeAt(len - i - 1) - 64) * j;
  }
  return ans;
}
// 倒计时
export function countdown2(endtime, begintime) {
  const t = endtime - begintime;
  const days = Math.floor(t / 86400000);
  let hours = days * 24 + Math.floor((t / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let seconds = Math.floor((t / 1000) % 60);
  hours = hours >= 10 ? hours : `0${hours}`;
  minutes = minutes >= 10 ? minutes : `0${minutes}`;
  seconds = seconds >= 10 ? seconds : `0${seconds}`;
  if (t <= 0) {
    return {
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }
  return { hours, minutes, seconds };
}

export function HbgLpValue(pair) {
   let value = 0;
   if (pair.token0.coin == 'EOS') {
     value = parseFloat(pair.token0.reserve) * 2;
   } else {
     value = parseFloat(pair.token1.reserve) * 2;
   }
   return value;
}

export function statistics() {
  window.dataLayer = window.dataLayer || [];
  const gtag = () => window.dataLayer.push(arguments);
  gtag('js', new Date());
  gtag('config', 'UA-176051030-3');

  const script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-176051030-3';
  document.body.appendChild(script);
}


/**
 * 深拷贝
 *
 * @export
 * @param {*} data 拷贝的数据
 * @returns
 */
export function deepClone(data) {
  const type = typeof data;
  let obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    return data;
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}


// 倒计时
export function countdown(endtime, begintime) {
  const btime = begintime || Date.parse(new Date());
  const t = Date.parse(endtime) - btime;
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let seconds = Math.floor((t / 1000) % 60);
  hours = hours >= 10 ? hours : `0${hours}`;
  minutes = minutes >= 10 ? minutes : `0${minutes}`;
  seconds = seconds >= 10 ? seconds : `0${seconds}`;
  if (t <= 0) {
    return {
      total: t,
      days: 0,
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }
  return { total: t, days, hours, minutes, seconds };
}

export function isIOS() {
  const u = navigator.userAgent;
  const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  return isIos;
}


// 处理IOS输入框失去焦点后网页不还原问题
export function fixIosInputBlur() {
  let flag;
  let myFunction;
  const isIos = isIOS();
  if (isIos) {
    document.body.addEventListener('focusin', () => {
      // 软键盘弹起事件
      flag = true;
      clearTimeout(myFunction);
    });
    document.body.addEventListener('focusout', () => {
      // 软键盘关闭事件
      flag = false;
      if (!flag) {
        const y = window.scrollY;
        myFunction = setTimeout(() => {
          window.scrollTo({ top: y || 0, left: 0, behavior: 'smooth' }); // 重点  =======当键盘收起的时候让页面回到原始位置(这里的top可以根据你们个人的需求改变，并不一定要回到页面顶部)
        }, 200);
      }
    });
  }
}

// 解析url参数为数据字典
export function getQuerys(url) {
  const params = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
    // eslint-disable-line
    params[key] = value;
  });
  return params;
}

/**
 * 时间戳转成本地时间
 */
export function toLocalTime(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

export function idToSymbol(number) {
  let str = '';
  while (number > 0) {
    let m = number % 26;
    if (m == 0) m = 26;
    str = String.fromCharCode(m + 64) + str;
    number = (number - m) / 26;
  }
  return 'LP' + str;
}

export function symbolToId(symbol) {
  let s = symbol.length > 2 && symbol.substr(0, 2) == 'LP' ? symbol.substr(2) : symbol;
  let ans = 0;
  const len = s.length;
  for (let i = 0, j = 1; i < len; i++, j *= 26) {
    ans += parseInt(s.charCodeAt(len - i - 1) - 64) * j;
  }
  return ans;
}

//处理本地币种图标
export function coinUrl(contract, coin) {
  const logoKey = contract + '-' + coin.toLowerCase();
  const localCoins = {
    'eosusdbtoken-usdb': require('@/assets/images/usdb.png'),
    'apsisnetcoin-apc': require('@/assets/images/apc.png'),
    'apsisnetcoin-apb': require('@/assets/images/apb.png'),
  };
  return localCoins[logoKey] ? localCoins[logoKey] : `https://ndi.340wan.com/eos/${logoKey}.png`;
}

//获取地址栏参数
export function GetUrlKey(name,url){
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || ['',''])[1].replace(/\+/g, '%20')) || null;
}