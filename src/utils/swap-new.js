/* eslint-disable */
'use strict';



// 获取pairId
export function getPair(coin1, coin2, pairs) {
  // let pay = pair.pay;
  // let receive = pair.receive;
  const id0 = `${coin1.contract}-${coin1.coin}`;
  const id1 = `${coin2.contract}-${coin2.coin}`;
  const item = pairs.find(v => {
    return (v.token0.tokenId === id0 && v.token1.tokenId === id1) ||
      (v.token0.tokenId === id1 && v.token1.tokenId === id0)
  });
  return item;
}

export function getPairId(coin1, coin2, pairs) {
  const pair = getPair(coin1, coin2, pairs);
  return pair ? pair.pairId : null;
}

export function getPairHBG(pairs) {
  const pair = findPair('hbgdefitoken-HBG', 'eosio.token-EOS', pairs);
  return pair ? pair : null;
}

export function get1StepAmount(fromTokenId, toTokenId, amount, fee, pairs, way) {
  let item = findPair(fromTokenId, toTokenId, pairs);
  let nextTokenId = fromTokenId;
  let output = amount;
  const fromToken = nextTokenId == item.token0.tokenId ? item.token0 : item.token1;
  const toToken = nextTokenId == item.token0.tokenId ? item.token1 : item.token0;
  nextTokenId = toToken.tokenId;
  // console.log('check:', fromToken.tokenId, toToken.tokenId);
  const fromReserve = getAmount(fromToken.reserve);
  const toReserve = getAmount(toToken.reserve);
  //console.log(amount, fromReserve, toReserve);
  if (fromReserve == 0 || toReserve == 0) {
    output = 0;
  }
  if (output == 0) {
    if (fromReserve != 0) {
      output = toReserve / fromReserve;
    }
  } else {
    if (way == 1) {
      output = getOutputAmount(output, fromReserve, toReserve, fee);
    } else {
      output = getInputAmount(output, toReserve, fromReserve, fee);
    }
  }
  return {
    bestAmount: output,
    bestPairPath: [item],
  }
}

export function getPath(fromTokenId, toTokenId, amount, fee, pairs, way=1, multipath = false) {
  // 第一步，找是否有直接匹配的
  const paths = [];
  let item = findPair(fromTokenId, toTokenId, pairs);
  if (item) {
    paths.push([item]);
  }
  // 第二步，看下是否能通过eos中转
  let path;
  if(multipath){
    const eosTokenId = 'eosio.token-EOS';
    path = findPairs(fromTokenId, toTokenId, eosTokenId, pairs)
    if (path) {
      // console
      paths.push(path);
    }
    const usdtTokenId = 'tethertether-USDT';
    // 第二步，看下是否能通过usdt中转
    path = findPairs(fromTokenId, toTokenId, usdtTokenId, pairs);
    if (path) {
      paths.push(path);
    }
  }
  //todo: 有可能更好的路径。比如  token0 -> eos -> usdt -> token1
  if (paths.length == 0) {
    return {
      bestAmount: 0,
      bestPairPath: [],
      bestTokenPath: []
    }
  }
  let bestPairPath = null;
  let maxOutput = -1;
  for (path of paths) {
    // console.log(path);
    let output = amount;
    let nextTokenId = fromTokenId;
    for (item of path) {
      const fromToken = nextTokenId == item.token0.tokenId ? item.token0 : item.token1;
      const toToken = nextTokenId == item.token0.tokenId ? item.token1 : item.token0;
      nextTokenId = toToken.tokenId;
      // console.log('check:', fromToken.tokenId, toToken.tokenId, nextTokenId.tokenId);
      const fromReserve = getAmount(fromToken.reserve);
      const toReserve = getAmount(toToken.reserve);
      //console.log(amount, fromReserve, toReserve);
      if (fromReserve == 0 || toReserve == 0) {
        output = 0;
        break;
      }
      if (output == 0) {
        if (fromReserve != 0) {
          output = toReserve / fromReserve;
        }
      } else {
        if (way == 1) {
          output = getOutputAmount(output, fromReserve, toReserve, fee);
        } else {
          output = getInputAmount(output, toReserve, fromReserve, fee);
        }
      }
      // console.log('check:', fromToken.tokenId, toToken.tokenId, output);
      // console.log('reserve:', getAmount(fromToken.reserve), getAmount(toToken.reserve));
    }
    // console.log('price:', output, maxOutput);
    if (output > maxOutput) {
      maxOutput = output;
      bestPairPath = path;
    }
  }
  // console.log(bestPairPath);
  return {
    bestAmount: maxOutput,
    bestPairPath,
    bestTokenPath: getTokenPath(fromTokenId, bestPairPath)
  }
}

function getAmount(reserve) {
  return Number(reserve.split(' ')[0]);
}

function getOutputAmount(input_amount, input_reserve, output_reserve, fee) {
  const trade_fee = input_amount * fee;
  const input_amount_with_fee = input_amount - trade_fee;
  const numerator = input_amount_with_fee * output_reserve;
  const denominator = input_reserve + input_amount_with_fee;
  return numerator / denominator;
}

function getInputAmount(output_amount, input_reserve, output_reserve, fee) {
  const numerator = output_amount * input_reserve;
  const denominator = output_reserve - output_amount;
  const input_amount_with_fee = numerator / denominator;
  const input_amount = input_amount_with_fee / (1 + fee);
  return input_amount;
}

function findPairs(tokenId0, tokenId1, bridgeTokenId, pairs) {
  if (tokenId0 != bridgeTokenId && tokenId1 != bridgeTokenId) {
    const item0 = findPair(tokenId0, bridgeTokenId, pairs);
    if (item0) {
      const item1 = findPair(tokenId1, bridgeTokenId, pairs);
      if (item1) {
        return [item0, item1];
      }
    }
  }
  return null;
}

function findPair(id0, id1, pairs) {
  return pairs.find(v => (v.token0.tokenId === id0 && v.token1.tokenId === id1) || (v.token0.tokenId === id1 && v.token1.tokenId === id0));
}

function getTokenPath(fromTokenId, pairPath) {
  const path = [];
  let lastToken = null;
  for (const p of pairPath) {
    if (lastToken == null) {
      lastToken = p.token0.tokenId == fromTokenId ? p.token0 : p.token1;
      path.push(lastToken);
    }
    if (p.token0.tokenId == lastToken.tokenId) {
      lastToken = p.token1;
    } else {
      lastToken = p.token0;
    }
    path.push(lastToken);
  }
  return path;
}
