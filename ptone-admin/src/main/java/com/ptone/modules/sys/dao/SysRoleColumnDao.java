/**
 * Copyright (c) 2018 弗锐登开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package com.ptone.modules.sys.dao;

import com.ptone.common.dao.BaseDao;
import com.ptone.modules.sys.entity.SysRoleColumnEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 角色与栏目对应关系
 * 
 * @author Mark sunlightcs@gmail.com
 */
@Mapper
public interface SysRoleColumnDao extends BaseDao<SysRoleColumnEntity> {


	/**
	 * 根据角色ID，获取菜单ID列表
	 */
	List<Long> getColumnIdList(Long roleId);

	/**
	 * 根据角色id，删除角色菜单关系
	 * @param roleIds 角色ids
	 */
	void deleteByRoleIds(Long[] roleIds);

	/**
	 * 根据菜单id，删除角色菜单关系
	 * @param columnId 菜单id
	 */
	void deleteByColumnId(Long columnId);
}
