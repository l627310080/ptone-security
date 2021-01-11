package com.ptone.modules.cms.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ptone.common.page.PageData;
import com.ptone.common.service.impl.CrudServiceImpl;
import com.ptone.modules.cms.dao.ColumnDao;
import com.ptone.modules.cms.dao.ColumnInfoDao;
import com.ptone.modules.cms.dto.ColumnDTO;
import com.ptone.modules.cms.dto.ColumnInfoDTO;
import com.ptone.modules.cms.entity.ColumnEntity;
import com.ptone.modules.cms.service.ColumnService;
import com.ptone.modules.security.user.SecurityUser;
import com.ptone.modules.security.user.UserDetail;
import com.ptone.modules.sys.dao.SysRoleColumnDao;
import com.ptone.modules.sys.enums.SuperAdminEnum;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ColumnServiceImpl extends CrudServiceImpl<ColumnDao, ColumnEntity, ColumnDTO> implements ColumnService {
    @Autowired
    private ColumnDao columnDao;
    @Autowired
    private SysRoleColumnDao roleColumnDao;
    @Autowired
    private ColumnInfoDao columnInfoDao;

    @Override
    public QueryWrapper<ColumnEntity> getWrapper(Map<String, Object> params) {
        String id = (String) params.get("id");
        String name = (String) params.get("name");
        String pcode = (String) params.get("pcode");

        QueryWrapper<ColumnEntity> wrapper = new QueryWrapper<>();
        wrapper.eq(StringUtils.isNotBlank(id), "id", id);
        wrapper.like(StringUtils.isNotBlank(name), "name", name);
        wrapper.eq(StringUtils.isNotBlank(pcode), "pcode", pcode);
        wrapper.eq(StringUtils.isBlank(pcode), "pcode", "cnkjg_kjfmg");
        wrapper.orderByAsc("sort");
        return wrapper;
    }

    @Override
    public List<ColumnDTO> getCategoryList() {
        UserDetail user = SecurityUser.getUser();
        List<ColumnDTO> columnDTOList = null;
        //是否是admin
        if ("admin".equals(user.getUsername())) {
            columnDTOList = columnDao.getCategoryListAdmin();
        } else {
            columnDTOList = columnDao.getCategoryList(user.getId());
        }
        return columnDTOList;
    }

    @Override
    public boolean ifHasChildren(String code) {
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("pcode", code);
        List<ColumnEntity> infoPublishEntities = columnDao.selectList(getWrapper(hashMap));
        return infoPublishEntities.size() > 0 ? true : false;
    }

    @Override
    public void deleteData(Long[] ids) {
        for (Long id : ids) {
            HashMap<String, Object> hashMap = new HashMap<>();
            hashMap.put("column_id", id);
            roleColumnDao.deleteByMap(hashMap);
            columnInfoDao.deleteByMap(hashMap);
        }
        delete(ids);
    }

    @Override
    public void updateSort(Map<String, Object> params) {
        List<Map<String, Object>> mapList = (List<Map<String, Object>>) params.get("sort");
        for (Map<String, Object> map : mapList) {
            ColumnEntity entity = columnDao.selectOne(new QueryWrapper<ColumnEntity>().eq("id", map.get("id")));
            entity.setSort((Integer) map.get("sort"));
            columnDao.updateById(entity);
        }
    }

    @Override
    public List<ColumnDTO> getCoulumnParents(String code) {
        UserDetail user = SecurityUser.getUser();
        List<ColumnDTO> columnDTOList = null;
        if (user.getSuperAdmin() == SuperAdminEnum.YES.value()) {
            columnDTOList = columnDao.getCoulumnParentsAdmin(code);
        } else {
            columnDTOList = columnDao.getCoulumnParents(code, user.getId());
        }
        return columnDTOList;
    }

    @Override
    public List<ColumnDTO> getCategoryAndInfoList(String code) {
        return columnDao.getCategoryAndInfoList(code);
    }

    @Override
    public ColumnDTO getColumnById(Long id) {
        ColumnDTO columnDTO = get(id);
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("code", columnDTO.getPcode());
        List<ColumnEntity> columnEntities = columnDao.selectByMap(hashMap);
        columnDTO.setParentName(columnEntities.get(0).getName());
        return columnDTO;
    }

    public PageData<ColumnDTO> pages(Map<String, Object> params){
        UserDetail user = SecurityUser.getUser();
        if ("admin".equals(user.getUsername())) {
            PageData<ColumnEntity> pageData = getPageData(getPage(params,"sort",true),ColumnEntity.class);
            return null;
        }else{
            return null;
        }
    }
}