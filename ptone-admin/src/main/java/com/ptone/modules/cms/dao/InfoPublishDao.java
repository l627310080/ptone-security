package com.ptone.modules.cms.dao;

import com.ptone.common.dao.BaseDao;
import com.ptone.modules.cms.dto.InfoPublishDTO;
import com.ptone.modules.cms.entity.InfoPublishEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface InfoPublishDao extends BaseDao<InfoPublishEntity> {
    /**
     * 根据栏目表id获取信息发布数据集合
     * @param params
     * @return
     */
    List<InfoPublishEntity> findPage(Map<String,Object> params);

    Integer findTotal(Map<String,Object> params);

    InfoPublishDTO findById(Long id);
}