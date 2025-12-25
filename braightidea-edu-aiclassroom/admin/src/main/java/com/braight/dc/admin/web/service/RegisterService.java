package com.braight.dc.admin.web.service;

import com.braight.dc.admin.web.controller.RegisterBodyVO;
import com.braight.master.common.constant.CacheConstants;
import com.braight.master.common.constant.Constants;
import com.braight.master.common.constant.UserConstants;
import com.braight.master.common.core.domain.entity.SysUser;
import com.braight.master.common.core.redis.RedisCache;
import com.braight.master.common.exception.user.CaptchaException;
import com.braight.master.common.exception.user.CaptchaExpireException;
import com.braight.master.common.utils.MessageUtils;
import com.braight.master.common.utils.SecurityUtils;
import com.braight.master.common.utils.StringUtils;
import com.braight.master.framework.manager.AsyncManager;
import com.braight.master.framework.manager.factory.AsyncFactory;
import com.braight.master.system.service.ISysConfigService;
import com.braight.master.system.service.ISysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Shine
 * @date 2025/12/24
 */
@Component
public class RegisterService {

    @Autowired
    private ISysUserService userService;

    @Autowired
    private ISysConfigService configService;

    @Autowired
    private RedisCache redisCache;

    /**
     * 注册
     */
    public String register(RegisterBodyVO registerBody)
    {
        String msg = "", username = registerBody.getUsername(), password = registerBody.getPassword(),
                email = registerBody.getEmail();
        SysUser sysUser = new SysUser();
        sysUser.setUserName(username);
        sysUser.setEmail(email);

        // 验证码开关
        boolean captchaEnabled = configService.selectCaptchaEnabled();
        if (captchaEnabled)
        {
            validateCaptcha(username, registerBody.getCode(), registerBody.getUuid());
        }

        if (StringUtils.isEmpty(username))
        {
            msg = "用户名不能为空";
        }
        else if (StringUtils.isEmpty(password))
        {
            msg = "用户密码不能为空";
        }
        else if (username.length() < UserConstants.USERNAME_MIN_LENGTH
                || username.length() > UserConstants.USERNAME_MAX_LENGTH)
        {
            msg = "账户长度必须在2到20个字符之间";
        }
        else if (password.length() < UserConstants.PASSWORD_MIN_LENGTH
                || password.length() > UserConstants.PASSWORD_MAX_LENGTH)
        {
            msg = "密码长度必须在5到20个字符之间";
        }
        else if (!userService.checkUserNameUnique(sysUser))
        {
            msg = "保存用户'" + username + "'失败，注册账号已存在";
        }
        else
        {
            sysUser.setNickName(username);
            sysUser.setPassword(SecurityUtils.encryptPassword(password));
            boolean regFlag = userService.registerUser(sysUser);
            if (!regFlag)
            {
                msg = "注册失败,请联系系统管理人员";
            }
            else
            {
                AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.REGISTER, MessageUtils.message("user.register.success")));
            }
        }
        return msg;
    }

    /**
     * 校验验证码
     *
     * @param username 用户名
     * @param code 验证码
     * @param uuid 唯一标识
     * @return 结果
     */
    public void validateCaptcha(String username, String code, String uuid)
    {
        String verifyKey = CacheConstants.CAPTCHA_CODE_KEY + StringUtils.nvl(uuid, "");
        String captcha = redisCache.getCacheObject(verifyKey);
        redisCache.deleteObject(verifyKey);
        if (captcha == null)
        {
            throw new CaptchaExpireException();
        }
        if (!code.equalsIgnoreCase(captcha))
        {
            throw new CaptchaException();
        }
    }
}
