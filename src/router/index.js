/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);



/**
 * @for meta
 * @param title 标题
 * @param icon 图标
 * @param name 用来匹配路由名称
 * @param isKeep 是否启用缓存
 * @param isNav 是否启用头部/底部导航
 */

const constantRouter = [
  {
    path: '/',
    redirect: '/swap',
    component: () => import(/* webpackChunkName: "index" */ '@/views/swap/Index'),
    meta: { title: 'cross', tabbar: false ,isKeep:true,isNav:true},
    children: [
      {
        path: '/swap',
        name: 'swap',
        component: () => import(/* webpackChunkName: "swap" */ '@/views/swap/Swap'),
        meta: { title: 'Swap',isKeep:true,isNav:true,isRoad:true, },
      },
      {
        path: '/pool',
        name: 'pool',
        component: () => import(/* webpackChunkName: "pool" */ '@/views/swap/Pool'),
        meta: { title: 'Pool',isKeep:true,isNav:true,isRoad:true, },
      },
      {
        path: '/swap1step',//一步Beta
        name: 'swap1step',
        component: () => import(/* webpackChunkName: "swap" */ '@/views/swap/Swap1Step'),
        meta: { title: 'Swap1Step',isKeep:true,isNav:true,isRoad:false },
      },
    ]
  },

  {
    path:'/currenIndex',//稳定币
    name:'CurrenIndex',
    redirect:'/currenIndex/generate',
    component:resolve=>require(['@/views/swap/stableCurrency/index'],resolve),
    meta:{ title:'StableCurrency',isKeep:true,isNav:true},
    children:[
      {
        path:'/currenIndex/generate',//生成
        name:'Generate',
        redirect:'/generate/bondList',
        component:resolve=>require(['@/views/swap/stableCurrency/generate'],resolve),
        meta:{title:'Generate',isNav:true},
        children:[
          {
            path:'/generate/bondList',//债仓排行
            name:'Bond',
            component:resolve=>require(['@/views/swap/stableCurrency/genCom/bondList'],resolve),
            meta:{isNav:true}
          },
          {
            path:'/generate/about',//关于USDB
            name:'About',
            component:resolve=>require(['@/views/swap/stableCurrency/genCom/about'],resolve),
            meta:{isNav:true}
          },
          {
            path:'/generate/problem',//常见问题
            name:'Problem',
            component:resolve=>require(['@/views/swap/stableCurrency/genCom/problem'],resolve),
            meta:{isNav:true,isKeep:false}
          },
        ]
      },
      {
        path:'/currenIndex/shoot',//抢拍
        name:'Shoot',
        component:resolve=>require(['@/views/swap/stableCurrency/shoot'],resolve),
        meta:{title:'Shoot',isNav:true}
      },
    ]
  },
  //稳定币兑换
  {
    path:'/currencyExchange',
    name:'CurrencyExchange',
    component:resolve=>require(['@/views/currencyExchange/index'],resolve),
    meta:{ title:'CurrencyExchange',isKeep:true,isNav:true},
    redirect:'/currencyExchange/exchange',
    children:[
      {
        path:'/currencyExchange/exchange',//兑换
        name:'Exchange',
        component:resolve=>require(['@/views/currencyExchange/exchange/index'],resolve),
        meta:{ title:'CurrencyExchange',isKeep:true,isNav:true},
      },
      {
        path:'/currencyExchange/make',//做市
        name:'Make',
        component:resolve=>require(['@/views/currencyExchange/market/index'],resolve),
        meta:{ title:'CurrencyExchange',isKeep:true,isNav:true},
      }
    ]

  },

  //所有竞拍
  {
    path:'/allOut',
    name:'AllOut',
    redirect:'/addOut/soldout',
    component:resolve=>require(['@/views/swap/stableCurrency/shCom/allOut'],resolve),
    meta:{ title:'AllOut',isNav:false,isKeep:true},
    children:[
      {
        path:'/addOut/soldout',//已爆仓
        name:'SoldOut',
        component:resolve=>require(['@/views/swap/stableCurrency/shCom/soldOut'],resolve)
      },
      {
        path:'/addOut/endOut',//抢拍结束
        name:'EndOut',
        component:resolve=>require(['@/views/swap/stableCurrency/shCom/endOut'],resolve)
      },
      {
        path:'/addOut/myOut',//我的抢拍
        name:'MyOut',
        component:resolve=>require(['@/views/swap/stableCurrency/shCom/myOut'],resolve)
      },
    ]
  },

  {
    path: '/swap/records',
    name: 'swap-record',
    component: () => import(/* webpackChunkName: "swap-record" */ '@/views/swap/SwapRecord'),
    meta: { title: 'Hamburger',isKeep:true,isNav:false },
  },
  {
    path: '/pool/records',
    name: 'liquidity-record',
    component: () => import(/* webpackChunkName: "liquidity-record" */ '@/views/swap/LiquidityRecord'),
    meta: { title: 'Hamburger',isKeep:true,isNav:false },
  },
  {
    path: '/pool/reduce',
    name: 'pool-reduce',
    component: () => import(/* webpackChunkName: "liquidity-record" */ '@/views/swap/PoolReduce'),
    meta: { title: 'Hamburger',isKeep:false,isNav:false },
  },

  {
    path: '/mining',
    redirect: '/mining/liquidity',
    component: () => import(/* webpackChunkName: "index" */ '@/views/swap/Mining'),
    meta: { title: 'cross', tabbar: false,isKeep:true,isNav:false, },
    children: [
      {
        path: '/mining/trade',
        name: 'tradeMining',
        component: () => import(/* webpackChunkName: "mining" */ '@/views/swap/TradeMining'),
        meta: { title: 'tradeMining',isKeep:true },
      },
      {
        path: '/mining/liquidity',
        name: 'liquidityMining',
        component: () => import(/* webpackChunkName: "pool" */ '@/views/swap/LiquidityMining'),
        meta: { title: 'liquidityMining',isKeep:true },
      },
    ]
  },
  {
    path:'/noticeCenter',//公告中心
    name:'NoticeCenter',
    component:resolve=>require(['@/views/swap/notice/notice'],resolve),
    meta: { title: 'NoticeCenter',isKeep:true,isNav:false },
  },
  {
    path:'/noticeDetails',//公告详情
    name:'NoticeDetails',
    component:resolve=>require(['@/views/swap/notice/notDetails'],resolve),
    meta:{title:'NoticeDetails',isKeep:false,isNav:false}
  },
  {
    path:'/valut',//金库
    name:'Valut',
    component:resolve=>require(['@/views/swap/valut/valut'],resolve),
    meta:{title:'Valut',isKeep:false,isNav:false}
  },
  {
    path:'/vote',//投票
    name:'Vote',
    component:resolve=>require(['@/views/swap/vote/vote'],resolve),
    meta:{title:'Vote',isKeep:false,isNav:false},
    children:[
      {
        path:'/vote/voteList',//投票列表
        name:'VoteList',
        component:resolve=>require(['@/views/swap/vote/com/voteList'],resolve)
      },
      {
        path:'/vote/ranking',//排行
        name:'Ranking',
        component:resolve=>require(['@/views/swap/vote/com/ranking'],resolve)
      },
      {
        path:'/vote/invested',//已投
        name:'Invested',
        component:resolve=>require(['@/views/swap/vote/com/invested'],resolve)
      }
    ],
    redirect:'/vote/voteList'
  },
  {
    path:'/voteDetails',//投票详情
    name:'VoteDetails',
    component:resolve=>require(['@/views/swap/vote/voteDetails'],resolve),
    meta:{title:'VoteDetails',isKeep:false,isNav:false}
  },
  // { // 挖矿
  //   path: '/start',
  //   name: 'fundraising',
  //   component: () => import(/* webpackChunkName: "fundraising" */ '@/views/swap/Fundraising'),
  //   meta: { title: 'Hamburger' },
  // },
  // { // 抵押/解押
  //   path: '/stake/:way',
  //   name: 'stake',
  //   component: () => import(/* webpackChunkName: "stake" */ '@/views/swap/Stake'),
  //   meta: { title: 'Hamburger' },
  // },
  {
    path:'/generateU',//生成
    name:'GenerateU',
    component:resolve=>require(['@/views/swap/stableCurrency/generateUSDB/index'],resolve),
    meta:{title:'Generate USDB',isKeep:true,isNav:false},
    children:[
      {
        path:'/generate',//生成USDB
        name:'Generate',
        component:resolve=>require(['@/views/swap/stableCurrency/generateUSDB/generate'],resolve),
      },
      {
        path:'/repay',//偿还SUDB
        name:'Repay',
        component:resolve=>require(['@/views/swap/stableCurrency/generateUSDB/repay'],resolve)
      },
      {
        path:'/management',//管理抵押
        name:'Management',
        component:resolve=>require(['@/views/swap/stableCurrency/generateUSDB/management'],resolve)
      }
    ],
    redirect:'/generate'
  },
  {
    path:'/problemDe',//常见问题内页(稳定币)
    name:'ProblemDe',
    component:resolve=>require(['@/views/swap/stableCurrency/genCom/problemDetails'],resolve),
    meta:{title:'ProblemDetails',isKeep:false,isNav:false}
  },
  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "create" */ '@/views/swap/Create'),
    meta: { title: 'Hamburger',isKeep:true,isNav:false },
  },
];


export default new Router({
  base: '/',
  mode: 'history',
  routes: constantRouter,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});


/**
 * 解决报错问题：报错显示是路由重复
 * Error: Avoided redundant navigation to current location
 */
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
