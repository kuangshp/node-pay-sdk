import { Builder, parseString } from 'xml2js';

const buildXML: Builder = new Builder({ rootName: 'xml', cdata: true, headless: true, renderOpts: { indent: ' ', pretty: true } });

/**
 * 将对象转换为xml
 * @param obj 对象
 */
export const convertObjToXml = (obj: {}) => {
	return buildXML.buildObject(obj);
}

/**
 * 将xml文本解析为对象
 * @param xml xml文本
 */
export const parseObjFromXml = async (xml: any) => {
	return new Promise((resolve, reject) => {
		parseString(xml, { explicitRoot: false, explicitArray: false }, (error, result) => error ? reject(error) : resolve(result));
	});
}