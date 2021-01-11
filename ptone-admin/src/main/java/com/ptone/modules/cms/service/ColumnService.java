package com.ptone.modules.cms.service;

import com.ptone.common.page.PageData;
import com.ptone.common.service.CrudService;
import com.ptone.modules.cms.dto.ColumnDTO;
import com.ptone.modules.cms.dto.ColumnInfoDTO;
import com.ptone.modules.cms.entity.ColumnEntity;

import java.util.List;
import java.util.Map;

public interface ColumnService extends CrudService<ColumnEntity, ColumnDTO> {
    /**
     * 得到栏目列表
     * @return
     */
    List<ColumnDTO> getCategoryList();

    /**
     * 判断是否有子栏目
     * @param code
     * @return
     */
    boolean ifHasChildren(String code);

    /**
     * 得到所有父栏目
     * @param code
     * @return
     */
    List<ColumnDTO> getCoulumnParents(String code);

    /**
     * 到所有父栏目以及下属发布的信息
     * @param code
     * @return
     */
    List<ColumnDTO> getCategoryAndInfoList(String code);

    /**
     * 排序
     * @param params
     */
    void updateSort(Map<String, Object> params);

    /**
     * 删除栏目
     * @param ids
     */
    void deleteData(Long[] ids);

    /**
     * 得到栏目详情
     * @param id
     * @return
     */
    ColumnDTO getColumnById(Long id);

    PageData<ColumnDTO> pages(Map<String, Object> params);
}