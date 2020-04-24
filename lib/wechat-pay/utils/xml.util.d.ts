/**
 * 将对象转换为xml
 * @param obj 对象
 */
export declare const convertObjToXml: (obj: {}) => string;
/**
 * 将xml文本解析为对象
 * @param xml xml文本
 */
export declare const parseObjFromXml: (xml: any) => Promise<unknown>;
