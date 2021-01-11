/**
 * Copyright (c) 2018 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package com.ptone.modules.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.ptone.common.constant.Constant;
import com.ptone.common.page.PageData;
import com.ptone.common.service.impl.BaseServiceImpl;
import com.ptone.common.utils.ConvertUtils;
import com.ptone.modules.security.password.PasswordUtils;
import com.ptone.modules.security.user.SecurityUser;
import com.ptone.modules.security.user.UserDetail;
import com.ptone.modules.sys.dao.SysUserDao;
import com.ptone.modules.sys.dto.SysDeptDTO;
import com.ptone.modules.sys.dto.SysUserDTO;
import com.ptone.modules.sys.entity.SysUserEntity;
import com.ptone.modules.sys.enums.SuperAdminEnum;
import com.ptone.modules.sys.service.SysDeptService;
import com.ptone.modules.sys.service.SysRoleUserService;
import com.ptone.modules.sys.service.SysUserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;


/**
 * 系统用户
 * 
 * @author Mark sunlightcs@gmail.com
 */
@Service
public class SysUserServiceImpl extends BaseServiceImpl<SysUserDao, SysUserEntity> implements SysUserService {
	@Autowired
	private SysRoleUserService sysRoleUserService;
	@Autowired
	private SysDeptService sysDeptService;

	@Autowired
	private SysUserDao sysUserDao;

	@Override
	public PageData<SysUserDTO> page(Map<String, Object> params) {
		//转换成like
		paramsToLike(params, "username");

		//分页
		IPage<SysUserEntity> page = getPage(params, Constant.CREATE_DATE, false);

		//普通管理员，只能查询所属部门及子部门的数据
		UserDetail user = SecurityUser.getUser();
		if(user.getSuperAdmin() == SuperAdminEnum.NO.value()) {
			params.put("deptIdList", sysDeptService.getSubDeptIdList(user.getDeptId()));
		}

		//查询
		List<SysUserEntity> list = baseDao.getList(params);

		return getPageData(list, page.getTotal(), SysUserDTO.class);
	}

	@Override
	public List<SysUserDTO> list(Map<String, Object> params) {
//		//普通管理员，只能查询所属部门及子部门的数据
//		UserDetail user = SecurityUser.getUser();
//		if(user.getSuperAdmin() == SuperAdminEnum.NO.value()) {
//			params.put("deptIdList", sysDeptService.getSubDeptIdList(user.getDeptId()));
//		}
//
//		List<SysUserEntity> entityList = baseDao.getList(params);
//
//		return ConvertUtils.sourceToTarget(entityList, SysUserDTO.class);
		//普通管理员，只能查询所属部门及子部门的数据
		UserDetail user = SecurityUser.getUser();
//        if (user.getSuperAdmin() == SuperAdminEnum.NO.value()) {
//            params.put("deptIdList", sysDeptService.getSubDeptIdList(user.getDeptId()));
//        }

		if ("real_name".equals(params.get("orderField"))) {
			params.replace("orderField", "username");
		}
		List<SysUserEntity> entityList = baseDao.getList(params);

		return ConvertUtils.sourceToTarget(entityList, SysUserDTO.class);
	}

	public QueryWrapper<SysUserEntity> getWrapper(Map<String, Object> params) {
		String id = (String) params.get("id");

		QueryWrapper<SysUserEntity> wrapper = new QueryWrapper<>();
		wrapper.eq(StringUtils.isNotBlank(id), "id", id);

		String username = (String) params.get("username");
		if (StringUtils.isNotBlank(username) && !username.equals("null")) {
			wrapper.eq("username", username);
		}
		wrapper.eq(StringUtils.isNotBlank(username), "user_name", username);
		Integer status = (Integer) params.get("status");
		wrapper.eq(status != null, "t1.status", status);
		String realname = (String) params.get("realname");
		if (StringUtils.isNotBlank(realname) && !realname.equals("null")) {
			wrapper.like("real_name", realname);
		}


//		String deptId = (String) params.get("deptId");
//		wrapper.eq(StringUtils.isNotBlank(deptId), "deptId", deptId);

		List<Long> deptIdList = (List<Long>) params.get("deptIdList");
		if (deptIdList != null && deptIdList.size() > 0) {
			wrapper.in("dept_id", deptIdList);
		}
		return wrapper;
	}

	@Override
	public PageData<SysUserDTO> recursiveGetPageListByDeptId(Map<String, Object> params) {

		params.put("t1.super_admin", 0);
		params.put("status", 1);
		//转换成like
		paramsToLike(params, "username");
		paramsToLike(params, "realname");
		//分页
		IPage<SysUserEntity> page = getPage(params, Constant.CREATE_DATE, false);

		//普通管理员，只能查询所属部门及子部门的数据
		UserDetail user = SecurityUser.getUser();

		if (params.get("deptId") != null && StringUtils.isNotBlank(params.get("deptId").toString())) {
			if(params.get("deptId").equals("1198886056592388098")){
				//params.put("deptIdList", sysDeptService.getSubDeptIdList(user.getDeptId()));
				String id = "1113339058116055042,1113342301613281281,1113342342629380097,1113342407393628161,1196319424691036161,1196319491464355842,1199520823947546626,1196319349147426817,1120868792545296385";
				//用逗号将字符串分开，得到字符串数组
				String[] strs=id.split(",");
				//将字符串数组转换成集合list
				List list=Arrays.asList(strs);
				params.put("deptIdList", list);
			}else{
				params.put("deptIdList", sysDeptService.getSubDeptIdList(Long.parseLong(params.get("deptId").toString())));
			}
		}
		else {
			if (user.getSuperAdmin() == SuperAdminEnum.NO.value()) {
				params.put("deptIdList", sysDeptService.getSubDeptIdList(user.getDeptId()));
			}
		}

		//查询
		List<SysUserEntity> list = baseDao.recursiveGetPageListByDeptId(page,
				getWrapper(params));

		return getPageData(list, page.getTotal(), SysUserDTO.class);

	}

	@Override
	public SysUserDTO get(Long id) {
		SysUserEntity entity = baseDao.getById(id);

		return ConvertUtils.sourceToTarget(entity, SysUserDTO.class);
	}

	@Override
	public SysUserDTO getByUsername(String username) {
		SysUserEntity entity = baseDao.getByUsername(username);
		SysUserDTO sysUserDTO = ConvertUtils.sourceToTarget(entity, SysUserDTO.class);
		if (sysUserDTO.getDeptId() != null) {
			SysDeptDTO sysDeptDTO = sysDeptService.get(sysUserDTO.getDeptId());
			sysUserDTO.setDeptName(sysDeptDTO.getName());
		}
		return sysUserDTO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void save(SysUserDTO dto) {
		SysUserEntity entity = ConvertUtils.sourceToTarget(dto, SysUserEntity.class);

		//密码加密
		String password = PasswordUtils.encode(entity.getPassword());
		entity.setPassword(password);

		//保存用户
		entity.setSuperAdmin(SuperAdminEnum.NO.value());
		insert(entity);

		//保存角色用户关系
		sysRoleUserService.saveOrUpdate(entity.getId(), dto.getRoleIdList());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void update(SysUserDTO dto) {
		SysUserEntity entity = ConvertUtils.sourceToTarget(dto, SysUserEntity.class);

		//密码加密
		if(StringUtils.isBlank(dto.getPassword())){
			entity.setPassword(null);
		}else{
			String password = PasswordUtils.encode(entity.getPassword());
			entity.setPassword(password);
		}

		//更新用户
		updateById(entity);

		//更新角色用户关系
		sysRoleUserService.saveOrUpdate(entity.getId(), dto.getRoleIdList());
	}

	@Override
	public void delete(Long[] ids) {
		//删除用户
		baseDao.deleteBatchIds(Arrays.asList(ids));

		//删除角色用户关系
		sysRoleUserService.deleteByUserIds(ids);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePassword(Long id, String newPassword) {
		newPassword = PasswordUtils.encode(newPassword);

		baseDao.updatePassword(id, newPassword);
	}

	@Override
	public int getCountByDeptId(Long deptId) {
		return baseDao.getCountByDeptId(deptId);
	}

	/**
	 * 查看该权限有哪些人员
	 * @param roleid
	 * @return
	 */
	@Override
	public List<SysUserDTO> getRoleList(String roleid) {
		List<SysUserDTO> roleList = sysUserDao.getRoleList(roleid);
		return roleList;
	}

	@Override
	public List<Long> getUserIdListByDeptId(List<Long> deptIdList) {
		return baseDao.getUserIdListByDeptId(deptIdList);
	}

	@Override
	public List<String> getUserNameListByDeptId(List<Long> deptIdList) {
		return sysUserDao.getUserNameListByDeptId(deptIdList);
	}

	@Override
	public List<SysUserDTO> getListByRoleId(Long roleId) {
		List<SysUserEntity> entityList = baseDao.getListByRoleId(roleId);
		return ConvertUtils.sourceToTarget(entityList, SysUserDTO.class);
	}
}
