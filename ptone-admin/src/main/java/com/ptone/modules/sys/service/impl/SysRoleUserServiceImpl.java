/**
 * Copyright (c) 2018 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package com.ptone.modules.sys.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.ptone.common.service.impl.BaseServiceImpl;
import com.ptone.modules.sys.dao.SysRoleUserDao;
import com.ptone.modules.sys.entity.SysRoleUserEntity;
import com.ptone.modules.sys.service.SysRoleUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 角色用户关系
 *
 * @author Mark sunlightcs@gmail.com
 * @since 1.0.0
 */
@Service
public class SysRoleUserServiceImpl extends BaseServiceImpl<SysRoleUserDao, SysRoleUserEntity> implements SysRoleUserService {

    @Autowired
    SysRoleUserDao sysRoleUserDao;

    @Override
    public void saveOrUpdate(Long userId, List<Long> roleIdList) {
        //先删除角色用户关系
        deleteByUserIds(new Long[]{userId});

        //用户没有一个角色权限的情况
        if(CollUtil.isEmpty(roleIdList)){
            return ;
        }

        //保存角色用户关系
        for(Long roleId : roleIdList){
            SysRoleUserEntity sysRoleUserEntity = new SysRoleUserEntity();
            sysRoleUserEntity.setUserId(userId);
            sysRoleUserEntity.setRoleId(roleId);

            //保存
            insert(sysRoleUserEntity);
        }
    }

    @Override
    public void saveOrUpdateByRoleUser(Long roleId, List<Long> userIdList) {
        //先删除角色用户关系
        if(roleId != null && roleId > 0)
        {
            deleteByRoleIds(new Long[]{roleId});
        }
        //用户没有一个角色权限的情况
        if(CollUtil.isEmpty(userIdList)){
            return ;
        }



        //保存角色用户关系
        for(Long userId : userIdList){
            SysRoleUserEntity sysRoleUserEntity = new SysRoleUserEntity();
            sysRoleUserEntity.setUserId(userId);
            sysRoleUserEntity.setRoleId(roleId);

            //保存
            insert(sysRoleUserEntity);
            // ActivitiUtils.createMembership(userId,roleId);
        }
    }

    @Override
    public void deleteByRoleIds(Long[] roleIds) {
        baseDao.deleteByRoleIds(roleIds);
    }

    @Override
    public void deleteByUserIds(Long[] userIds) {
        baseDao.deleteByUserIds(userIds);
    }

    @Override
    public List<Long> getRoleIdList(Long userId) {

        return sysRoleUserDao.getRoleIdList(userId);
    }

    @Override
    public List<Long> getRoleIds(String username) {
        return sysRoleUserDao.getRoleIds(username);
    }
}