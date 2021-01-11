package com.ptone.modules.sys.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.ptone.common.service.impl.BaseServiceImpl;
import com.ptone.modules.sys.dao.SysRoleColumnDao;
import com.ptone.modules.sys.entity.SysRoleColumnEntity;
import com.ptone.modules.sys.service.SysRoleColumnService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SysRoleColumnServiceImpl extends BaseServiceImpl<SysRoleColumnDao, SysRoleColumnEntity> implements SysRoleColumnService {
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOrUpdate(Long roleId, List<Long> coloumnIdList) {
        //先删除角色菜单关系
        deleteByRoleIds(new Long[]{roleId});

        //角色没有一个菜单权限的情况
        if(CollUtil.isEmpty(coloumnIdList)){
            return ;
        }

        //保存角色菜单关系
        for(Long coloumnId : coloumnIdList){
            SysRoleColumnEntity sysRoleColumnEntity = new SysRoleColumnEntity();
            sysRoleColumnEntity.setColumnId(coloumnId);
            sysRoleColumnEntity.setRoleId(roleId);

            //保存
            insert(sysRoleColumnEntity);
        }
    }

    @Override
    public List<Long> getColumnIdList(Long roleId){
        return baseDao.getColumnIdList(roleId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByRoleIds(Long[] roleIds) {
        baseDao.deleteByRoleIds(roleIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByColumnId(Long coloumnId) {
        baseDao.deleteByColumnId(coloumnId);
    }

}
