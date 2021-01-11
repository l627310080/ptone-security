/**
 * Copyright (c) 2018 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package com.ptone.modules.sys.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.ptone.common.dao.BaseDao;
import com.ptone.modules.sys.dto.SysUserDTO;
import com.ptone.modules.sys.entity.SysUserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 系统用户
 * 
 * @author Mark sunlightcs@gmail.com
 */
@Mapper
public interface SysUserDao extends BaseDao<SysUserEntity> {

	List<SysUserEntity> getList(Map<String, Object> params);

	SysUserEntity getById(Long id);

	SysUserEntity getByUsername(String username);

	int updatePassword(@Param("id") Long id, @Param("newPassword") String newPassword);

	List<SysUserEntity> recursiveGetPageListByDeptId(@Param("pg") IPage<SysUserEntity> myPage, @Param("ew") QueryWrapper<SysUserEntity> queryWrapper);

	/**
	 * 根据部门ID，查询用户数
	 */
	int getCountByDeptId(Long deptId);

	/**
	 * 根据部门ID,查询用户ID列表
	 */
	List<Long> getUserIdListByDeptId(List<Long> deptIdList);

	/**
	 * 查看该角色有哪些人员
	 */
	List<SysUserDTO> getRoleList(String roleid);

	/**
	 * 根据部门ID,查询用户名列表
	 */
	List<String> getUserNameListByDeptId(List<Long> deptIdList);

	List<SysUserEntity> getListByRoleId(Long roleId);

}