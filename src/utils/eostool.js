/* eslint-disable */
'use strict';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs';
import Eos from 'eosjs-without-sort';

ScatterJS.plugins( new ScatterEOS() );

class EosTool {
  constructor() {
    this.config = {
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
      rpcUrl: 'https://eos.blockeden.cn'
    }
    this.account = null;
    this.update();

    this.connected = false;
    this.connect();
  }

  config(chainId, rpcUrl) {
    this.config.chainId = chainId || 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
    this.config.rpcUrl = rpcUrl;
    if (process.env.NODE_ENV == 'dev') {
      this.config.chainId = '8a34ec7df1b8cd06ff4a8abbaa7cc50300823350cadc59ab296cb00d104d2b8f';
      this.config.rpcUrl = 'http://106.53.150.201:8888';
    }
    this.update();
  }

  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async waitConnect() {
    let times = 0;
    while (!this.connected) {
      if (++times == 50) {
        this.connected = true;
        alert('scatter can not connect');
        return;
      }
      await this.sleep(100);
    }
  }

  update() {
    if (process.env.NODE_ENV == 'dev') {
      this.config.chainId = '8a34ec7df1b8cd06ff4a8abbaa7cc50300823350cadc59ab296cb00d104d2b8f';
      this.config.rpcUrl = 'http://106.53.150.201:8888';
    }
    const url = new URL(this.config.rpcUrl);
    this.network = ScatterJS.Network.fromJson({
      blockchain: 'eos',
      chainId: this.config.chainId,
      host: url.hostname,
      port: url.port ? url.port : (url.protocol == 'https:' ? 443 : 80),
      protocol: url.protocol.split(':')[0]
    });
    this.eos = ScatterJS.eos(this.network, Eos);
  }

  async connect() {
    if (!this.connected) {
      this.connected = await ScatterJS.connect('Defi', { network: this.network });
      if (!this.connected) {
        return console.error('no scatter');
      }
    }
    this.eos = await ScatterJS.scatter.eos(this.network, Eos, this.options);
  }

  async logout() {
    await this.waitConnect();
    this.account = null;
    // if (ScatterJS.account('eos'))
    await ScatterJS.logout();
  }

  async login() {
    await this.waitConnect();
    if (!this.account) {
      const id = await ScatterJS.login();
      if (!id) {
        return console.error('no identity');
      }
      this.account = ScatterJS.account('eos');
    }
    return this.account;
  }

  async getAccount(name) {
    return await this.eos.getAccount(name);
  }

  getAuthorization() {
    return {
      actor: this.account.name,
      permission: this.account.authority,
    };
  }

  async getCurrencyBalance(contract, account, symbol) {
    const result = await this.eos.getCurrencyBalance(contract, account, symbol);
    return result.length ? result[0] : '';
  }

  async getCurrencyStats(code, symbol) {
    const result = await this.eos.getCurrencyStats(code, symbol);
    // console.log(result[symbol]);
    return result[symbol] ? result : '';
  }

  async getTableRows(params) {
    const result = await this.eos.getTableRows(params);
    return result.rows;
  }

  async transact(actions) {
    if (!this.account) {
      return;
    }
    await this.waitConnect();
    let result = null;
    try {
      result = await this.eos.transaction({ actions });
    } catch (e) {
      result = e;
    }
    return result;
  }

  handleScatterError(result) {
    if (typeof result == 'string') {
      result = JSON.parse(result);
    }
    if (result.code == 402) {
      return { type: 'lang', text: 'error.canceled' };
    }
    if (result.error && result.error.code) {
      switch (result.code) {
        case 402:
          return { type: 'lang', text: 'error.canceled' };
        case 3080001:
        case 3080002:
        case 3080004:
        case 3040005:
        // 3050003: '账户不存在，资产金额不正确等',
        case 3090003:
          return  { type: 'lang', text: 'error.error' + result.code };
      }
      if (result.error.details) {
        let msg = result.error.details[0].message;
        const prefix = 'assertion failure with message: ';
        if (msg.substr(0, prefix.length) == prefix) {
          msg = 'Error: ' + msg.substr(prefix.length);
        }
        return { type: 'msg', text: msg };
      }
    }
    return { type: 'lang', text: 'error.unknown' };
  }

}

export default new EosTool();
