package com.ptone.modules.cms.dao;

import com.ptone.common.dao.BaseDao;
import com.ptone.modules.cms.dto.ColumnInfoDTO;
import com.ptone.modules.cms.entity.ColumnInfoEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ColumnInfoDao extends BaseDao<ColumnInfoEntity> {
    /**
     * 得到信息列表
     * @param map
     * @return
     */
    List<ColumnInfoDTO> getInfoList(Map map);
}