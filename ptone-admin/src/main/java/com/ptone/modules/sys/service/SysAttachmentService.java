package com.ptone.modules.sys.service;

import com.ptone.common.entity.SysAttachmentEntity;
import com.ptone.common.service.CrudService;
import com.ptone.modules.sys.dto.SysAttachmentDTO;

import java.util.List;
import java.util.Map;

/**
 * 
 *
 * @author wangzhi wangzhi@ifreedom001.com
 * @since 1.0.0 2019-03-11
 */
public interface SysAttachmentService extends CrudService<SysAttachmentEntity, SysAttachmentDTO> {
    int insertToId(SysAttachmentEntity entity);

     List<SysAttachmentEntity> selectList(Map<String, Object> params);

    /**
     * 查询关于这条会议的所有附件（
     *
     * @param reftableid
     * @return
     */
    List<SysAttachmentEntity> selectAttachment(String reftableid);


    /**
     * 查询这条议程的所有附件
     *
     * @return
     */
    List<SysAttachmentEntity> selectAgendaMeet(String reftableid);
}