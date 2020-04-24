import axios from 'axios';
import * as queryString from 'querystring';
import { createHash } from "crypto";

import { ObjectType } from '../types';
import { WechatTradeType } from './utils/wechat.pay.constant';
import { parseObjFromXml } from './utils/xml.util';

interface IWechatPayConfig {
  mchId: string; // 商户号
  appId: string; // 应用id
  payKey: string; // 密钥
}

interface IOrderXml {
  attach: string, // 支付的标题
  body: string, // 支付的请求体
  notifyUrl: string, // 支付的回调
  openid: string, // 支付的标识(可以是订单id,或者为空)
  outTradeNo: string, // 商家平台生成的交易号
  spbillCreateIp: string, // 支付的ip地址
  totalFee: string | number, // 支付的金额(分为单位)
  tradeType: WechatTradeType, // 支付类型
  nonceStr?: string, // 随机字符串
  sign?: string, // 签名
}


export class WechatPay {
  private payConfig: IWechatPayConfig;

  constructor (payConfig: IWechatPayConfig) {
    this.payConfig = payConfig;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-04-24 10:03:28
   * @LastEditors: 水痕
   * @Description: 统一下单的方法
   * @param {type} 
   * @return: 
   */
  async createOrder(param: IOrderXml): Promise<ObjectType> {
    // 生成统一下单接口参数
    const unifiedorderParams: any = {
      appid: this.payConfig.appId,
      attach: param.attach,
      body: param.body,
      mch_id: this.payConfig.mchId,
      nonce_str: this.createNonceStr(),
      notify_url: param.notifyUrl,// 微信付款后的回调地址
      openid: param.openid,
      out_trade_no: param.outTradeNo,
      spbill_create_ip: param.spbillCreateIp,
      total_fee: param.totalFee,
      trade_type: param.tradeType, // 支付类型
    };
    //第一次签名 参数并且到参数中
    unifiedorderParams.sign = this.getSign(unifiedorderParams);
    const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    const postData = JSON.stringify(this.getUnifiedorderXmlParams(unifiedorderParams));
    const { data } = await axios.post(url, postData);
    // 将xml格式化转换json格式,并且判断签名是否成功
    const unifiedOrder: any = await parseObjFromXml(data);
    if (unifiedOrder.return_code !== 'SUCCESS') {
      throw unifiedOrder.return_msg;
    }
    // 第二次签名
    const timeStamp = String(new Date().getTime() / 1000);
    const nonceStr = this.createNonceStr();
    const wcPayParams: ObjectType = {
      "appId": this.payConfig.appId,     //公众号名称，由商户传入
      "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数
      "nonceStr": nonceStr, //随机串                 
      // 通过统一下单接口获取
      "package": "prepay_id=" + unifiedOrder.prepay_id,   //小程序支付用这个
      "code_url": unifiedOrder.prepay_id,
      "signType": "MD5",         //微信签名方式：
    };
    const PaySign = this.getSign(wcPayParams); //微信支付签名
    return {
      TimeStamp: timeStamp,
      NonceStr: nonceStr,
      Package: "prepay_id=" + unifiedOrder.prepay_id,
      SignType: WechatTradeType.NATIVE,
      PaySign: PaySign,
    }
  }

  /*
   * 获取微信统一下单参数
   */
  private getUnifiedorderXmlParams(obj: IOrderXml): string {
    var body = '<xml> ' +
      '<appid>' + this.payConfig.appId + '</appid> ' +
      '<attach>' + obj.attach + '</attach> ' +
      '<body>' + obj.body + '</body> ' +
      '<mch_id>' + this.payConfig.mchId + '</mch_id> ' +
      '<nonce_str>' + obj.nonceStr + '</nonce_str> ' +
      '<notify_url>' + obj.notifyUrl + '</notify_url>' +
      '<openid>' + obj.openid + '</openid> ' +
      '<out_trade_no>' + obj.outTradeNo + '</out_trade_no>' +
      '<spbill_create_ip>' + obj.spbillCreateIp + '</spbill_create_ip> ' +
      '<total_fee>' + obj.totalFee + '</total_fee> ' +
      '<trade_type>' + obj.tradeType + '</trade_type> ' +
      '<sign>' + obj.sign + '</sign> ' +
      '</xml>';
    return body;
  }
  /**
   * 获取微信支付的签名
   * @param payParams
   */
  private getSign(signParams: ObjectType): string {
    // 按 key 值的ascll 排序
    var keys = Object.keys(signParams);
    keys = keys.sort();
    let newArgs: ObjectType = {};
    keys.forEach(val => {
      if (signParams[val]) {
        newArgs[val] = signParams[val];
      }
    })
    var string = queryString.stringify(newArgs) + '&key=' + this.payConfig.payKey;
    // 生成签名
    return createHash('md5').update(queryString.unescape(string), 'utf8').digest("hex").toUpperCase();
  }

  /**
   * 获取随机的NonceStr
   */
  private createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  };
}