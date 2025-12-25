package com.braight.dc.admin.web.controller;

import com.braight.dc.admin.web.service.RegisterService;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.utils.StringUtils;
import com.braight.master.system.service.ISysConfigService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author Shine
 * @date 2025/12/24
 */
@RestController
public class ApiController extends BaseController {
    @Resource
    private RegisterService registerService;
    @Resource
    private ISysConfigService configService;

    @PostMapping("/registerProxy")
    public AjaxResult register(@RequestBody RegisterBodyVO user)
    {
        if (!("true".equals(configService.selectConfigByKey("sys.account.registerUser"))))
        {
            return error("当前系统没有开启注册功能！");
        }
        String msg = registerService.register(user);
        return StringUtils.isEmpty(msg) ? success() : error(msg);
    }
}
