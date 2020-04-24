"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 微信支付交易类型
 */
var WechatTradeType;
(function (WechatTradeType) {
    /**
     * JSAPI、小程序支付
     */
    WechatTradeType["JSAPI"] = "JSAPI";
    /**
     * 扫码支付
     */
    WechatTradeType["NATIVE"] = "NATIVE";
    /**
     * APP支付
     */
    WechatTradeType["APP"] = "APP";
    /**
     * H5支付
     */
    WechatTradeType["MWEB"] = "MWEB";
})(WechatTradeType = exports.WechatTradeType || (exports.WechatTradeType = {}));
