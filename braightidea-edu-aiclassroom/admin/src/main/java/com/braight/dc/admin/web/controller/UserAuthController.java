package com.braight.dc.admin.web.controller;

import com.braight.dc.admin.web.entity.AieduTeachersPO;
import com.braight.dc.admin.web.mapper.AieduTeachersPOMapper;
import com.braight.dc.admin.web.service.RegisterService;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.core.domain.entity.SysUser;
import com.braight.master.common.enums.BusinessType;
import com.braight.master.common.utils.SecurityUtils;
import com.braight.master.common.utils.StringUtils;
import com.braight.master.system.service.ISysConfigService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 用户登录认证
 *
 * @author Shine
 * @date 2025/12/24
 */
@RestController
@RequestMapping("/api/teacher")
public class UserAuthController extends BaseController {
    @Resource
    private RegisterService registerService;
    @Resource
    private ISysConfigService configService;
    @Resource
    private AieduTeachersPOMapper aieduTeachersPOMapper;


    @Log(title = "用户注册", businessType = BusinessType.OTHER)
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

    /**
     * 获取用户信息
     *
     * @return 用户信息
     */
    @Log(title = "教师信息", businessType = BusinessType.QUERY)
    @GetMapping("profile")
    public AjaxResult getInfo()
    {
        SysUser user = SecurityUtils.getLoginUser().getUser();
        // 角色集合
//        Set<String> roles = permissionService.getRolePermission(user);
        // 权限集合
//        Set<String> permissions = permissionService.getMenuPermission(user);
//        Map<String, Object> map = new HashMap<>();
//        map.put("user", user);
//        map.put("roles", roles);
//        map.put("permissions", permissions);
        AieduTeachersPO po = aieduTeachersPOMapper.selectByUserId(user.getUserId());
        return AjaxResult.success(po);
    }

    /**
     * 更新用户信息
     *
     * @return 用户信息
     */
    @Log(title = "教师信息", businessType = BusinessType.UPDATE)
    @PostMapping("profile/put")
    public AjaxResult updateInfo(@RequestBody AieduTeachersPO po)
    {
        po.setUserId(getUserId());
        aieduTeachersPOMapper.updateByUserId(po);
        return AjaxResult.success();
    }
}
