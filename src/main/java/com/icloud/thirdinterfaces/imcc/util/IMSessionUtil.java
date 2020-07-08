package com.icloud.thirdinterfaces.imcc.util;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import java.net.URLDecoder;
import java.util.Iterator;
import java.util.Map;

public class IMSessionUtil {
    /**
     * 第三方节点解析属性
     */
    private static final String _PROPERTY = "property";
    private static final String _KEY = "key";
    private static final String _VALUE = "value";
    private static final String _URL_CODING = "utf-8";

    /**
     * 第三方节点调用返回结果定义
     */
    public static final String _SESSION_PROPERTIES = "sessionProperties";
    public static final String _STR_REASON = "strReason";
    public static final String _CODE = "code";


    /**
     * 通过第三方节点参数获取指定属性值
     * @param xml
     * @param propertyKey
     * @return
     */
    @SuppressWarnings("unchecked")
    public static String getXmlPropertites(String xml, String propertyKey){
        String keyValue = null;
        try{
            Document doc = DocumentHelper.parseText(xml);
            Element root = doc.getRootElement();
            Iterator<Element> itr = root.elementIterator(_PROPERTY);
            Element propertyElement;
            String key;
            while(itr.hasNext()){
                propertyElement = (Element)itr.next();
                key = propertyElement.attributeValue(_KEY);
                if(propertyKey.equals(key)){
                    keyValue = URLDecoder.decode(propertyElement.attributeValue(_VALUE), _URL_CODING);
                    break;
                }
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(keyValue);
        return keyValue;
    }


    /**
     * 组装第三方节点调用标准返回串
     * @param valueMap
     * @param transaction	是否增加属性的转换标识
     * @return
     */
    @SuppressWarnings("unchecked")
    public static String createXml(Map<String, Object> valueMap, boolean transaction){
        StringBuffer sb = new StringBuffer();
        sb.append("<response>");
        sb.append("<result>");
        sb.append("<code>").append(valueMap.get(_CODE)).append("</code>");
        sb.append("<strReason>").append(valueMap.get(_STR_REASON)).append("</strReason>");
        sb.append("</result>");
        sb.append("<properties>");
        sb.append("<session>");
        if(valueMap.get(_SESSION_PROPERTIES) != null){
            sb.append(createSessionProperXml((Map<String, String>)valueMap.get(_SESSION_PROPERTIES),transaction));
        }
        sb.append("</session>");
        sb.append("</properties>");
        sb.append("</response>");
        return sb.toString();
    }

    /**
     * 组装第三方节点session属性
     * @param sessionMap
     * @param transaction	是否增加属性的转换标识
     * @return
     */
    private static String createSessionProperXml(Map<String, String> sessionMap, boolean transaction){
        StringBuffer sb = new StringBuffer();
        Iterator<String> itr = sessionMap.keySet().iterator();
        String key;
        while(itr.hasNext()){
            key = itr.next();
            sb.append("<property ");
            if(transaction){
                sb.append("transaction=\"true\" ");
            }
            sb.append("key=\"").append(key).append("\" value=\"").append(sessionMap.get(key)).append("\"/>");
        }
        return sb.toString();
    }


    /**
     * 组装第三方节点调用标准返回串
     * @param valueMap
     * @param transaction	是否增加属性的转换标识
     * @return
     */
    @SuppressWarnings("unchecked")
    public static String createXml(Map<String, Object> valueMap, boolean transaction,String sessionxml){
        StringBuffer sb = new StringBuffer();
        sb.append("<response>");
        sb.append("<result>");
        sb.append("<code>").append(valueMap.get(_CODE)).append("</code>");
        sb.append("<strReason>").append(valueMap.get(_STR_REASON)).append("</strReason>");
        sb.append("</result>");
        sb.append("<properties>");
        sb.append(sessionxml);
        sb.append("</properties>");
        sb.append("</response>");
        return sb.toString();
    }

}
