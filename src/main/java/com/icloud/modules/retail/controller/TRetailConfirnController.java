package com.icloud.modules.retail.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.icloud.basecommon.model.Query;
import com.icloud.basecommon.util.codec.Md5Utils;
import com.icloud.basecommon.util.excelutilss.ExcelMoreSheetPoiUtil;
import com.icloud.common.PageUtils;
import com.icloud.common.R;
import com.icloud.common.util.StringUtil;
import com.icloud.common.validator.ValidatorUtils;
import com.icloud.modules.retail.entity.TRetailConfirn;
import com.icloud.modules.retail.service.TRetailConfirnService;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;


/**
 *
 *
 * @author zdh
 * @email yyyyyy@cm.com
 * @date 2020-07-08 11:08:09
 */
@RestController
@RequestMapping("retail/retailconfirn")
@Slf4j
public class TRetailConfirnController {
    @Autowired
    private TRetailConfirnService tRetailConfirnService;
    @Autowired
    protected HttpServletRequest request;
    /**
     * 列表
     */
    @RequestMapping("/list")
    @RequiresPermissions("retail:retailconfirn:list")
    public R list(@RequestParam Map<String, Object> params){
        Query query = new Query(params);
        PageUtils page = tRetailConfirnService.findByPage(query.getPageNum(),query.getPageSize(), query);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{id}")
    @RequiresPermissions("retail:retailconfirn:info")
    public R info(@PathVariable("id") Long id){
        TRetailConfirn tRetailConfirn = (TRetailConfirn)tRetailConfirnService.getById(id);

        return R.ok().put("tRetailConfirn", tRetailConfirn);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    @RequiresPermissions("retail:retailconfirn:save")
    public R save(@RequestBody TRetailConfirn tRetailConfirn){
        if(!StringUtil.checkStr(tRetailConfirn.getUserName())){
            return R.error("用户名不能为空");
        }
        if(tRetailConfirn.getUserName().length()<5){
            return R.error("用户名长度不能小于5");
        }
        tRetailConfirn.setCreateTime(new Date());
        tRetailConfirn.setLiences("gdyf"+tRetailConfirn.getUserName().substring(tRetailConfirn.getUserName().length()-4));//密码铭文
        tRetailConfirn.setPasswd(Md5Utils.md5(tRetailConfirn.getLiences()));//加密的密文
        tRetailConfirnService.save(tRetailConfirn);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    @RequiresPermissions("retail:retailconfirn:update")
    public R update(@RequestBody TRetailConfirn tRetailConfirn){
        ValidatorUtils.validateEntity(tRetailConfirn);
        if(!StringUtil.checkStr(tRetailConfirn.getUserName())){
            return R.error("用户名不能为空");
        }
        if(tRetailConfirn.getUserName().length()<5){
            return R.error("用户名长度不能小于5");
        }
        tRetailConfirn.setModifyTime(new Date());
        tRetailConfirn.setLiences("gdyf"+tRetailConfirn.getUserName().substring(tRetailConfirn.getUserName().length()-4));//密码铭文
        tRetailConfirn.setPasswd(Md5Utils.md5(tRetailConfirn.getLiences()));//加密的密文
        tRetailConfirnService.updateById(tRetailConfirn);

        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @RequiresPermissions("retail:retailconfirn:delete")
    public R delete(@RequestBody Long[] ids){
        tRetailConfirnService.removeByIds(Arrays.asList(ids));
        return R.ok();
    }

    /**
     * 导入
     */
    @RequestMapping("/importusers")
    @RequiresPermissions("retail:retailconfirn:save")
    public R importusers(@RequestParam String url){//url本地文件
        try {
            if(!StringUtil.checkStr(url)){
                return R.error("文件不能为空");
            }
            if(url.indexOf("xls")<0){
                return R.error("不是合法的文件");
            }
//            String realPath = request.getSession().getServletContext().getRealPath(url);
            log.error(url);
            File dirFile = new File(url);
            log.info("url=============="+url);
            log.info("filename=============="+dirFile.getName());
            List<List<Object>> dataList = ExcelMoreSheetPoiUtil.readExcel(dirFile, 0);
            log.info("excel大小:dataList=============="+ dataList.size());
            TRetailConfirn retail = null;
            Date date = new Date();
            List<TRetailConfirn> retailConfirnlist = new ArrayList<>();
            for(int i=0;i<dataList.size();i++){
                if(dataList.get(i).get(0)==null){
                    continue;
                }
                String userName = dataList.get(i).get(0).toString();
                if(userName.length()<5){
                    log.info("userName====="+userName+" 用户账号长度过小");
                    return R.error("账号："+userName+" 长度过小");
                }
                int count = tRetailConfirnService.count(new QueryWrapper<TRetailConfirn>().eq("user_name",userName));
                if(count>0){
                    log.info("userName====="+userName+" 用户已存在");
                    continue;
                }
                retail= new TRetailConfirn();
                retail.setCreateTime(date);
                retail.setUserName(userName);
                retail.setLiences("gdyf"+userName.substring(userName.length()-4));//密码铭文
                retail.setPasswd(Md5Utils.md5(retail.getLiences()));//加密的密文
                retailConfirnlist.add(retail);
            }
            log.info("实际大小=============="+ dataList.size());
            tRetailConfirnService.saveBatch(retailConfirnlist);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return R.ok();
    }

}
