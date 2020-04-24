
/**
 * 微信支付请求URL列表
 */
export const enum WechatPayUrlList {
  /**
   * 统一下单URL
   */
  UnifiedOrderUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder',

  /**
   * 根据订单号查询订单URL
   */
  orderQueryByTransactionId = 'https://api.mch.weixin.qq.com/pay/orderquery',

  /**
   * 关闭订单的URL
   */
  closeOrder = 'https://api.mch.weixin.qq.com/pay/closeorder',

  /**
   * 退款的URL
   */
  refund = 'https://api.mch.weixin.qq.com/secapi/pay/refund',

  /**
   * 查询退款URL
   */
  refundQuery = 'https://api.mch.weixin.qq.com/pay/refundquery',

  /**
   * 下载账单URL
   */
  downloadBill = 'https://api.mch.weixin.qq.com/pay/downloadbill'
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

export const enum downloadBillType {
  ALL = 'ALL', // 全部的
  SUCCESS = 'SUCCESS', // 成功的
  REFUND = 'REFUND', // 退款的
  RECHARGE_REFUND = 'RECHARGE_REFUND', // 当日充值的
}