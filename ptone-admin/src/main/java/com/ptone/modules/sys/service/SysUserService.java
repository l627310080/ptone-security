/**
 * Copyright (c) 2018 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package com.ptone.modules.sys.service;

import com.ptone.common.page.PageData;
import com.ptone.common.service.BaseService;
import com.ptone.modules.sys.dto.SysUserDTO;
import com.ptone.modules.sys.entity.SysUserEntity;

import java.util.List;
import java.util.Map;


/**
 * 系统用户
 * 
 * @author Mark sunlightcs@gmail.com
 */
public interface SysUserService extends BaseService<SysUserEntity> {

	PageData<SysUserDTO> page(Map<String, Object> params);

	List<SysUserDTO> list(Map<String, Object> params);

	SysUserDTO get(Long id);

	SysUserDTO getByUsername(String username);

	void save(SysUserDTO dto);

	void update(SysUserDTO dto);

	void delete(Long[] ids);

	PageData<SysUserDTO> recursiveGetPageListByDeptId( Map<String, Object> params);

	/**
	 * 修改密码
	 * @param id           用户ID
	 * @param newPassword  新密码
	 */
	void updatePassword(Long id, String newPassword);

	/**
	 * 根据部门ID，查询用户数
	 */
	int getCountByDeptId(Long deptId);

	/**
	 * 根据部门ID,查询用户ID列表
	 */
	List<Long> getUserIdListByDeptId(List<Long> deptIdList);

	/**
	 * 根据部门ID,查询用户列表
	 */
	List<String> getUserNameListByDeptId(List<Long> deptIdList);

	/**
	 * 查看该权限有哪些人员
	 * @param roleid
	 * @return
	 */
	List<SysUserDTO> getRoleList(String roleid);

	List<SysUserDTO>  getListByRoleId(Long roleId);

}
