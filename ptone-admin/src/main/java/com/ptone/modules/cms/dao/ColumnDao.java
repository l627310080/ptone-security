package com.ptone.modules.cms.dao;

import com.ptone.common.dao.BaseDao;
import com.ptone.modules.cms.dto.ColumnDTO;
import com.ptone.modules.cms.entity.ColumnEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ColumnDao extends BaseDao<ColumnEntity> {
     /**
      * 管理员栏目列表
      * @return
      */
     List<ColumnDTO> getCategoryListAdmin();

    /**
     * 普通用户栏目列表
      * @param userId
     * @return
     */
     List<ColumnDTO> getCategoryList(Long userId);

    /**
     * 得到所有父栏目（管理员）
      * @param code
     * @return
     */
     List<ColumnDTO> getCoulumnParentsAdmin(String code);

    /**
     * 得到所有父栏目（普通用户）
      * @param code
     * @param userId
     * @return
     */
     List<ColumnDTO> getCoulumnParents(@Param("code") String code, @Param("userId") Long userId);


    /**
     * 得到所有父栏目以及发布信息
     * @param code
     * @return
     */
    List<ColumnDTO> getCategoryAndInfoList(String code);

}