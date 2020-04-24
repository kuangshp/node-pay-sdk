"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var queryString = require("querystring");
var crypto_1 = require("crypto");
var wechat_pay_constant_1 = require("./utils/wechat.pay.constant");
var xml_util_1 = require("./utils/xml.util");
var WechatPay = /** @class */ (function () {
    function WechatPay(payConfig) {
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
    WechatPay.prototype.createOrder = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var unifiedorderParams, url, postData, data, unifiedOrder, timeStamp, nonceStr, wcPayParams, PaySign, resultObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unifiedorderParams = {
                            appid: this.payConfig.appId,
                            attach: param.attach,
                            body: param.body,
                            mch_id: this.payConfig.mchId,
                            nonce_str: this.createNonceStr(),
                            notify_url: param.notify_url,
                            openid: param.openid,
                            out_trade_no: param.out_trade_no,
                            spbill_create_ip: param.spbill_create_ip,
                            total_fee: param.total_fee,
                            trade_type: param.trade_type,
                        };
                        //第一次签名 参数并且到参数中
                        unifiedorderParams['sign'] = this.getSign(unifiedorderParams);
                        console.log(unifiedorderParams, '???');
                        url = "https://api.mch.weixin.qq.com/pay/unifiedorder" /* unifiedOrderUrl */;
                        postData = JSON.stringify(this.getUnifiedorderXmlParams(unifiedorderParams));
                        console.log('xml格式化', postData);
                        return [4 /*yield*/, axios_1.default.post(url, postData)];
                    case 1:
                        data = (_a.sent()).data;
                        return [4 /*yield*/, xml_util_1.parseObjFromXml(data)];
                    case 2:
                        unifiedOrder = _a.sent();
                        console.log('第一次签名', unifiedOrder);
                        if (unifiedOrder.return_code !== 'SUCCESS') {
                            throw unifiedOrder.return_msg;
                        }
                        timeStamp = Number.parseInt(String(new Date().getTime() / 1000));
                        nonceStr = this.createNonceStr();
                        wcPayParams = {
                            appId: this.payConfig.appId,
                            timeStamp: timeStamp,
                            nonceStr: nonceStr,
                            // 通过统一下单接口获取
                            package: 'prepay_id=' + unifiedOrder.prepay_id,
                            code_url: unifiedOrder.prepay_id,
                            signType: 'MD5',
                        };
                        PaySign = this.getSign(wcPayParams);
                        console.log('第二次前面', PaySign);
                        resultObj = {
                            timeStamp: timeStamp,
                            nonceStr: nonceStr,
                            signType: 'MD5',
                            paySign: PaySign,
                        };
                        if (Object.is(param.trade_type, wechat_pay_constant_1.WechatTradeType.JSAPI)) { // 小程序支付
                            return [2 /*return*/, Object.assign(resultObj, {
                                    package: 'prepay_id=' + unifiedOrder.prepay_id
                                })];
                        }
                        else if (Object.is(param.trade_type, wechat_pay_constant_1.WechatTradeType.NATIVE) ||
                            Object.is(param.trade_type, wechat_pay_constant_1.WechatTradeType.MWEB)) {
                            return [2 /*return*/, Object.assign(resultObj, {
                                    codeUrl: unifiedOrder.prepay_id,
                                })];
                        }
                        else {
                            return [2 /*return*/, resultObj];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 10:51:53
     * @LastEditors: 水痕
     * @Description: 根据微信订单号查询订单
     * @param transactionId {String} 微信交易的订单号
     * @return:
     */
    WechatPay.prototype.queryOrder = function (transactionId) {
        return __awaiter(this, void 0, void 0, function () {
            var postData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postData = {
                            appid: this.payConfig.appId,
                            mch_id: this.payConfig.mchId,
                            transaction_id: transactionId,
                            nonce_str: this.createNonceStr(),
                            sign_type: 'MD5'
                        };
                        postData['sign'] = this.getSign(postData);
                        return [4 /*yield*/, axios_1.default.post("https://api.mch.weixin.qq.com/pay/orderquery" /* orderQueryByTransactionId */, postData)];
                    case 1:
                        result = _a.sent();
                        if (result.return_code !== "SUCCESS" /* Success */) {
                            throw result.return_msg;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 11:03:01
     * @LastEditors: 水痕
     * @Description: 关闭订单
     * @param outTradeNo {String} 商户订单号【非微信支付交易号】
     * @return:
     */
    WechatPay.prototype.closeOrder = function (outTradeNo) {
        return __awaiter(this, void 0, void 0, function () {
            var postData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postData = {
                            appid: this.payConfig.appId,
                            mch_id: this.payConfig.mchId,
                            out_trade_no: outTradeNo,
                            nonce_str: this.createNonceStr(),
                            sign_type: 'MD5'
                        };
                        postData['sign'] = this.getSign(postData);
                        return [4 /*yield*/, axios_1.default.post("https://api.mch.weixin.qq.com/pay/closeorder" /* closeOrder */, postData)];
                    case 1:
                        result = _a.sent();
                        if (result.return_code !== "SUCCESS" /* Success */) {
                            throw result.return_msg;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 11:16:12
     * @LastEditors: 水痕
     * @Description: 退款处理
     * @param {type}
     * @return:
     */
    WechatPay.prototype.refund = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionId, outRefundNo, totalFee, refundFee, _a, refundFeeType, _b, refundDesc, _c, refundAccount, _d, notifyUrl, postData, result;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        transactionId = params.transactionId, outRefundNo = params.outRefundNo, totalFee = params.totalFee, refundFee = params.refundFee, _a = params.refundFeeType, refundFeeType = _a === void 0 ? 'CNY' : _a, _b = params.refundDesc, refundDesc = _b === void 0 ? '商品已售完' : _b, _c = params.refundAccount, refundAccount = _c === void 0 ? 'REFUND_SOURCE_RECHARGE_FUNDS' : _c, _d = params.notifyUrl, notifyUrl = _d === void 0 ? '' : _d;
                        postData = {
                            appid: this.payConfig.appId,
                            mch_id: this.payConfig.mchId,
                            nonce_str: this.createNonceStr(),
                            transaction_id: transactionId,
                            out_refund_no: outRefundNo,
                            total_fee: totalFee,
                            refund_fee: refundFee,
                            refund_fee_type: refundFeeType,
                            refund_desc: refundDesc,
                            refund_account: refundAccount,
                            notify_url: notifyUrl,
                            sign_type: 'MD5'
                        };
                        postData['sign'] = this.getSign(postData);
                        return [4 /*yield*/, axios_1.default.post("https://api.mch.weixin.qq.com/secapi/pay/refund" /* refund */, postData)];
                    case 1:
                        result = _e.sent();
                        if (result.return_code !== "SUCCESS" /* Success */) {
                            throw result.return_msg;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 15:17:27
     * @LastEditors: 水痕
     * @Description:
     * @param refundId {String} 微信退款单号
     * @param offset {Number} 偏移量
     * @return:
     */
    WechatPay.prototype.refundQuery = function (refundId, offset) {
        if (offset === void 0) { offset = 15; }
        return __awaiter(this, void 0, void 0, function () {
            var postData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postData = {
                            appid: this.payConfig.appId,
                            mch_id: this.payConfig.mchId,
                            nonce_str: this.createNonceStr(),
                            refund_id: refundId,
                            offset: offset,
                            sign_type: 'MD5'
                        };
                        postData['sign'] = this.getSign(postData);
                        return [4 /*yield*/, axios_1.default.post("https://api.mch.weixin.qq.com/pay/refundquery" /* refundQuery */, postData)];
                    case 1:
                        result = _a.sent();
                        if (result.return_code !== "SUCCESS" /* Success */) {
                            throw result.return_msg;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @Author: 水痕
     * @Date: 2020-04-24 15:39:31
     * @LastEditors: 水痕
     * @Description: 下载账单
     * @param billDate {String} 账单日比如:20140603
     * @param billType {String} 账单类型
     * @return:
     */
    WechatPay.prototype.downloadBill = function (billDate, billType) {
        if (billType === void 0) { billType = "SUCCESS" /* SUCCESS */; }
        return __awaiter(this, void 0, void 0, function () {
            var postData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postData = {
                            appid: this.payConfig.appId,
                            mch_id: this.payConfig.mchId,
                            nonce_str: this.createNonceStr(),
                            bill_date: billDate,
                            bill_type: billType,
                            sign_type: 'MD5'
                        };
                        postData['sign'] = this.getSign(postData);
                        return [4 /*yield*/, axios_1.default.post("https://api.mch.weixin.qq.com/pay/downloadbill" /* downloadBill */, postData)];
                    case 1:
                        result = _a.sent();
                        if (result.return_code !== "SUCCESS" /* Success */) {
                            throw result.return_msg;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /*
     * 获取微信统一下单参数
     */
    WechatPay.prototype.getUnifiedorderXmlParams = function (obj) {
        var body = '<xml> ' +
            '<appid>' + this.payConfig.appId + '</appid> ' +
            '<attach>' + obj.attach + '</attach> ' +
            '<body>' + obj.body + '</body> ' +
            '<mch_id>' + this.payConfig.mchId + '</mch_id> ' +
            '<nonce_str>' + obj.nonce_str + '</nonce_str> ' +
            '<notify_url>' + obj.notify_url + '</notify_url>' +
            '<openid>' + obj.openid + '</openid> ' +
            '<out_trade_no>' + obj.out_trade_no + '</out_trade_no>' +
            '<spbill_create_ip>' + obj.spbill_create_ip + '</spbill_create_ip> ' +
            '<total_fee>' + obj.total_fee + '</total_fee> ' +
            '<trade_type>' + obj.trade_type + '</trade_type> ' +
            '<sign>' + obj.sign + '</sign> ' +
            '</xml>';
        return body;
    };
    /**
     * 获取微信支付的签名
     * @param payParams
     */
    WechatPay.prototype.getSign = function (signParams) {
        // 按 key 值的ascll 排序
        var keys = Object.keys(signParams);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach(function (val) {
            if (signParams[val]) {
                newArgs[val] = signParams[val];
            }
        });
        var string = queryString.stringify(newArgs) + '&key=' + this.payConfig.payKey;
        // 生成签名
        return crypto_1.createHash('md5').update(queryString.unescape(string), 'utf8').digest("hex").toUpperCase();
    };
    /**
     * 获取随机的NonceStr
     */
    WechatPay.prototype.createNonceStr = function () {
        return Math.random().toString(36).substr(2, 15);
    };
    ;
    return WechatPay;
}());
exports.WechatPay = WechatPay;
