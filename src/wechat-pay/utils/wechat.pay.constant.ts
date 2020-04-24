
/**
 * 微信支付请求URL列表
 */
export const enum WechatPayUrlList {
  /**
   * 统一下单URL
   */
  UnifiedOrderUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
}

/**
 * 微信支付交易类型
 */
export enum WechatTradeType {
  /**
   * JSAPI、小程序支付
   */
  JSAPI = 'JSAPI',

  /**
   * 扫码支付
   */
  NATIVE = 'NATIVE',

  /**
   * APP支付
   */
  APP = 'APP',

  /**
   * H5支付
   */
  MWEB = 'MWEB',
}

/**
 * 微信支付加密方式
 */
export const enum WechatPaySingType {
  /**
   * MD5
   */
  MD5 = 'MD5',

  /**
   * HMAC-SHA256
   */
  HMAC_SHA256 = 'HMAC-SHA256'
}

/**
 * 微信支付请求返回Code类型
 */
export const enum WechatPayResCode {
  Success = 'SUCCESS',
  Fail = 'FAIL'
}