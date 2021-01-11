package com.ptone.modules.sys.service;

import com.ptone.common.service.BaseService;
import com.ptone.modules.sys.entity.SysRoleColumnEntity;

import java.util.List;

public interface SysRoleColumnService extends BaseService<SysRoleColumnEntity> {

    /**
     * 根据角色ID，获取栏目ID列表
     */
    List<Long> getColumnIdList(Long roleId);

    /**
     * 保存或修改
     * @param roleId      角色ID
     * @param ColumnIdList  栏目ID列表
     */
    void saveOrUpdate(Long roleId, List<Long> ColumnIdList);

    /**
     * 根据角色id，删除角色栏目关系
     * @param roleIds 角色ids
     */
    void deleteByRoleIds(Long[] roleIds);

    /**
     * 根据栏目id，删除角色栏目关系
     * @param ColumnId 栏目id
     */
    void deleteByColumnId(Long ColumnId);
}
