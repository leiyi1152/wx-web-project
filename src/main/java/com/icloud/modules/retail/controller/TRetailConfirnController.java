package com.icloud.modules.retail.controller;

import com.icloud.basecommon.model.Query;
import com.icloud.basecommon.util.codec.Md5Utils;
import com.icloud.common.PageUtils;
import com.icloud.common.R;
import com.icloud.common.util.StringUtil;
import com.icloud.common.validator.ValidatorUtils;
import com.icloud.modules.retail.entity.TRetailConfirn;
import com.icloud.modules.retail.service.TRetailConfirnService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.Map;


/**
 *
 *
 * @author zdh
 * @email yyyyyy@cm.com
 * @date 2020-07-08 11:08:09
 * 菜单主连接： modules/retail/tretailconfirn.html
 */
@RestController
@RequestMapping("retail/retailconfirn")
public class TRetailConfirnController {
    @Autowired
    private TRetailConfirnService tRetailConfirnService;

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

}
