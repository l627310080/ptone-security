package com.ptone.modules.cms.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ptone.common.service.impl.CrudServiceImpl;
import com.ptone.modules.cms.dao.ColumnInfoDao;
import com.ptone.modules.cms.dto.ColumnInfoDTO;
import com.ptone.modules.cms.entity.ColumnInfoEntity;
import com.ptone.modules.cms.service.ColumnInfoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ColumnInfoServiceImpl extends CrudServiceImpl<ColumnInfoDao, ColumnInfoEntity, ColumnInfoDTO> implements ColumnInfoService {
    @Override
    public QueryWrapper<ColumnInfoEntity> getWrapper(Map<String, Object> params) {
        String id = (String) params.get("id");

        QueryWrapper<ColumnInfoEntity> wrapper = new QueryWrapper<>();
        wrapper.eq(StringUtils.isNotBlank(id), "id", id);
        wrapper.orderByAsc("sort");

        return wrapper;
    }



}