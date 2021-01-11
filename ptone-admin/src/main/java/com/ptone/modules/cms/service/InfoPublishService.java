package com.ptone.modules.cms.service;

import com.ptone.common.page.PageData;
import com.ptone.common.service.CrudService;
import com.ptone.modules.cms.dto.ColumnInfoDTO;
import com.ptone.modules.cms.dto.InfoPublishDTO;
import com.ptone.modules.cms.entity.InfoPublishEntity;

import java.util.List;
import java.util.Map;

public interface InfoPublishService extends CrudService<InfoPublishEntity, InfoPublishDTO> {
    /**
     * 得到信息列表
     *
     * @param InfoPublishDTO
     * @return
     */
    PageData<ColumnInfoDTO> getInfoList(InfoPublishDTO InfoPublishDTO);

    /**
     * 保存信息
     *
     * @param infoPublishDTO
     */
    void saveData(InfoPublishDTO infoPublishDTO);

    /**
     * 修改信息
     *
     * @param infoPublishDTO
     */
    void updateData(InfoPublishDTO infoPublishDTO);

    /**
     * 删除信息
     *
     * @param ids
     */
    void deleteData(Long ids[]);

    /**
     * 得到信息详情
     *
     * @param id
     * @return
     */
    InfoPublishDTO getInfoById(Long id);

    /**
     * 排序
     *
     * @param params
     */
    void updateSort(Map<String, Object> params);

    PageData<InfoPublishDTO> pageInfoPublishs(Map map);

    /**
     * 获得栏目下信息列表
     * @param params
     * @return
     */
    PageData<InfoPublishEntity> getInfoPublishs(Map<String,Object> params);
}