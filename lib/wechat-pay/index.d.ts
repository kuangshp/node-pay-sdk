import { ObjectType } from '../types';
import { WechatTradeType, downloadBillType } from './utils/wechat.pay.constant';
interface IWechatPayConfig {
    mchId: string;
    appId: string;
    payKey: string;
}
interface IOrderXml {
    attach: string;
    body: string;
    notify_url: string;
    openid: string;
    out_trade_no: string;
    spbill_create_ip: string;
    total_fee: number;
    nonce_str?: string;
    trade_type?: WechatTradeType;
    sign?: string;
}
interface IRefund {
    transactionId: string;
    outRefundNo: string;
    totalFee: number;
    refundFee: number;
    refundFeeType?: string;
    refundDesc?: string;
    refundAccount?: string;
    notifyUrl?: string;
}
export declare class WechatPay {
    private payConfig;
    constructor(payConfig: IWechatPayConfig);
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 10:03:28
     * @LastEditors: 水痕
     * @Description: 统一下单的方法
     * @param {type}
     * @return:
     */
    createOrder(param: IOrderXml): Promise<ObjectType>;
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 10:51:53
     * @LastEditors: 水痕
     * @Description: 根据微信订单号查询订单
     * @param transactionId {String} 微信交易的订单号
     * @return:
     */
    queryOrder(transactionId: string): Promise<ObjectType>;
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 11:03:01
     * @LastEditors: 水痕
     * @Description: 关闭订单
     * @param outTradeNo {String} 商户订单号【非微信支付交易号】
     * @return:
     */
    closeOrder(outTradeNo: string): Promise<ObjectType>;
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 11:16:12
     * @LastEditors: 水痕
     * @Description: 退款处理
     * @param {type}
     * @return:
     */
    refund(params: IRefund): Promise<any>;
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 15:17:27
     * @LastEditors: 水痕
     * @Description:
     * @param refundId {String} 微信退款单号
     * @param offset {Number} 偏移量
     * @return:
     */
    refundQuery(refundId: string, offset?: number): Promise<any>;
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 15:39:31
     * @LastEditors: 水痕
     * @Description: 下载账单
     * @param billDate {String} 账单日比如:20140603
     * @param billType {String} 账单类型
     * @return:
     */
    downloadBill(billDate: string, billType?: downloadBillType): Promise<any>;
    private getUnifiedorderXmlParams;
    /**
     * 获取微信支付的签名
     * @param payParams
     */
    private getSign;
    /**
     * 获取随机的NonceStr
     */
    private createNonceStr;
}
export {};
