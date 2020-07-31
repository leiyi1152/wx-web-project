package com.icloud.modules.mpwx.entity.menu;

import lombok.Data;

@Data
public class MpwxMenu {
    private Integer appId;		// 微信号id
    private String xcxAppid;		// 小程序id
    private String name;		// 菜单名
    private String url;		// url
    private Integer menuLevel;		// 菜单级别1,2
    private Integer orderNo;		// 排序
    // 菜单类型:click:点击事件
    //        view:跳转连接
    //        scancode_push: ：扫码推事件用户点击按钮后，微信客户端将调起扫一扫工具，完成扫码操作后显示扫描结果（如果是URL，将进入URL），且会将扫码的结果传给开发者，开发者可以下发消息。
    //        scancode_waitmsg:扫码推事件且弹出“消息接收中”提示框用户点击按钮后
    //        pic_sysphoto: 弹出系统拍照发图用户点击按钮后，微信客户端将调起系统相机
    //        pic_photo_or_album:
    //        pic_weixin:
    //        location_select:
    //        media_id:
    //       view_limited:
    //       miniprogram:
    //
    private String menuType;
    // 1视图2事件, （2018/01/10t添加 3 扫码 4、跳转小程序
    //1视图2事件3扫码（显示结果）或者跳转链接 4跳转小程序,5扫码，有提示框，可以接受开发者推送的消息
    //view、click、scancode_push，miniprogram,scancode_waitmsg
    private MpwxMenu parent;		// 父类，0跟
    private String isUse;		// 状态0停用1正常
    private String pagepath;		// 小程序页面路径
}
