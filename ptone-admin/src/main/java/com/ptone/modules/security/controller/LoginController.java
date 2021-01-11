/**
 * Copyright (c) 2018 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package com.ptone.modules.security.controller;

import com.ptone.common.exception.ErrorCode;
import com.ptone.common.utils.IpUtils;
import com.ptone.common.utils.Result;
import com.ptone.common.validator.ValidatorUtils;
import com.ptone.modules.log.entity.SysLogLoginEntity;
import com.ptone.modules.log.enums.LoginOperationEnum;
import com.ptone.modules.log.enums.LoginStatusEnum;
import com.ptone.modules.log.service.SysLogLoginService;
import com.ptone.modules.security.dto.LoginDTO;
import com.ptone.modules.security.password.PasswordUtils;
import com.ptone.modules.security.user.SecurityUser;
import com.ptone.modules.security.user.UserDetail;
import com.ptone.modules.sys.dto.SysUserDTO;
import com.ptone.modules.sys.service.SysUserService;
import com.wf.captcha.ArithmeticCaptcha;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * 登录
 * 
 * @author Mark sunlightcs@gmail.com
 */
@RestController
@Api(tags="登录管理")
public class LoginController {
	@Autowired
	private SysUserService sysUserService;
	@Autowired
	private SysLogLoginService sysLogLoginService;

	private static final String CAPTCHA_SESSION_KEY = "CAPTCHA_SESSION_KEY";

	@GetMapping("captcha")
	@ApiOperation(value = "验证码", produces="application/octet-stream")
	public void captcha(HttpServletRequest request, HttpServletResponse response)throws IOException {
		response.setContentType("image/gif");
		response.setHeader("Pragma", "No-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expires", 0);

		//生成验证码
		ArithmeticCaptcha captcha = new ArithmeticCaptcha(150, 40);
		captcha.setLen(2);
		captcha.getArithmeticString();

		//保存到session
		request.getSession().setAttribute(CAPTCHA_SESSION_KEY, captcha.text());

		captcha.out(response.getOutputStream());
	}

	@PostMapping("login")
	@ApiOperation(value = "登录")
	public Result login(HttpServletRequest request, @RequestBody LoginDTO login) {
		//效验数据
//		ValidatorUtils.validateEntity(login);

		//验证码是否正确
//		String captcha = (String)request.getSession().getAttribute(CAPTCHA_SESSION_KEY);
//		if(!login.getCaptcha().equalsIgnoreCase(captcha)){
//			request.getSession().removeAttribute(CAPTCHA_SESSION_KEY);
//			return new Result().error(ErrorCode.CAPTCHA_ERROR);
//		}

		//用户信息
		SysUserDTO user = sysUserService.getByUsername(login.getUsername());
		if(user == null){
			return new Result().error(ErrorCode.ACCOUNT_PASSWORD_ERROR);
		}

		SysLogLoginEntity log = new SysLogLoginEntity();
		log.setOperation(LoginOperationEnum.LOGIN.value());
		log.setCreateDate(new Date());
		log.setIp(IpUtils.getIpAddr(request));
		log.setUserAgent(request.getHeader(HttpHeaders.USER_AGENT));
		log.setIp(IpUtils.getIpAddr(request));

		Result result = new Result();
		try {
			Subject subject = SecurityUtils.getSubject();
			UsernamePasswordToken token = new UsernamePasswordToken(login.getUsername(), login.getPassword());
			subject.login(token);

			//登录成功
			log.setStatus(LoginStatusEnum.SUCCESS.value());
			log.setCreator(user.getId());
			log.setCreatorName(user.getUsername());
			result = new Result().ok(user);
		}catch (UnknownAccountException e) {
			log.setStatus(LoginStatusEnum.FAIL.value());
			log.setCreatorName(login.getUsername());
			result = new Result().error(ErrorCode.ACCOUNT_PASSWORD_ERROR);
		}catch (LockedAccountException e) {
			log.setStatus(LoginStatusEnum.LOCK.value());
			log.setCreator(user.getId());
			log.setCreatorName(user.getUsername());
			result = new Result().error(ErrorCode.ACCOUNT_DISABLE);
		}catch (AuthenticationException e) {
			log.setStatus(LoginStatusEnum.FAIL.value());
			log.setCreator(user.getId());
			log.setCreatorName(user.getUsername());
			result = new Result().error(ErrorCode.ACCOUNT_PASSWORD_ERROR);
		}

		sysLogLoginService.save(log);

		return result;
	}

	@PostMapping("user")
	public Result<SysUserDTO> getUserByName(@RequestParam("username") String username){
		SysUserDTO sysUserDTO = sysUserService.getByUsername(username);
		return new Result<SysUserDTO>().ok(sysUserDTO);
	}

	@PostMapping("logout")
	@ApiOperation(value = "退出")
	public Result logout(HttpServletRequest request) {
		UserDetail user = SecurityUser.getUser();

		//退出
		SecurityUtils.getSubject().logout();

		//用户信息
		SysLogLoginEntity log = new SysLogLoginEntity();
		log.setOperation(LoginOperationEnum.LOGOUT.value());
		log.setIp(IpUtils.getIpAddr(request));
		log.setUserAgent(request.getHeader(HttpHeaders.USER_AGENT));
		log.setIp(IpUtils.getIpAddr(request));
		log.setStatus(LoginStatusEnum.SUCCESS.value());
		log.setCreator(user.getId());
		log.setCreatorName(user.getUsername());
		log.setCreateDate(new Date());
		sysLogLoginService.save(log);

		return new Result();
	}

	/**
	 * 会议前端登陆方法
	 * @param request
	 * @param response
	 * @param login
	 * @return
	 */
	@PostMapping("loginMeeting")
	@ApiOperation(value = "会议前端登录")
	public Result loginMeeting(HttpServletRequest request, HttpServletResponse response, @RequestBody LoginDTO login) {
		//效验数据
		ValidatorUtils.validateEntity(login);
		//用户信息
		SysUserDTO user = sysUserService.getByUsername(login.getUsername());
		boolean b = PasswordUtils.matches(login.getPassword(), user.getPassword());
		if (b==false){
			return new Result().error(ErrorCode.ACCOUNT_PASSWORD_ERROR);
		}else{
			return new Result();
		}
	}
	
}