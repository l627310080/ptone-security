package com.ptone.modules.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ptone.common.dao.SysAttachmentDao;
import com.ptone.common.entity.SysAttachmentEntity;
import com.ptone.common.service.impl.CrudServiceImpl;
import com.ptone.modules.sys.dto.SysAttachmentDTO;
import com.ptone.modules.sys.service.SysAttachmentService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 *
 *
 * @author wangzhi wangzhi@ifreedom001.com
 * @since 1.0.0 2019-03-11
 */
@Service
public class SysAttachmentServiceImpl extends CrudServiceImpl<SysAttachmentDao, SysAttachmentEntity, SysAttachmentDTO> implements SysAttachmentService {

    @Override
    public QueryWrapper<SysAttachmentEntity> getWrapper(Map<String, Object> params){
        String id = (String)params.get("id");

        QueryWrapper<SysAttachmentEntity> wrapper = new QueryWrapper<>();
        wrapper.eq(StringUtils.isNotBlank(id), "id", id);

        String refTableId = (String)params.get("refTableId");
        String refTableName = (String)params.get("refTableName");
        if(StringUtils.isNotBlank(refTableId) && StringUtils.isNotBlank(refTableName)){

            wrapper.eq("refTableId",refTableId);
            wrapper.eq("refTableName",refTableName);
        }
        String typeCode = (String)params.get("typeCode");
        if(StringUtils.isNotBlank(typeCode)){
            wrapper.eq("typeCode",typeCode);
        }
        wrapper.eq("isdelete",0);
        return wrapper;
    }

    public List<SysAttachmentEntity> selectList(Map<String, Object> params){
        QueryWrapper<SysAttachmentEntity> wrapper =  this.getWrapper(params);
        return baseDao.selectList(wrapper);
    }

    @Override
    public int insertToId(SysAttachmentEntity entity) {

        return baseDao.insert(entity);
    }

    /**
     * 查询关于这条会议的所有附件（不包括议程）
     *
     * @param reftableid
     * @return
     */
    @Override
    public List<SysAttachmentEntity> selectAttachment(String reftableid) {
        List<SysAttachmentEntity> SysAttachmentEntityList = baseDao.selectList(new QueryWrapper<SysAttachmentEntity>().eq("ref_table_id", reftableid));
        return SysAttachmentEntityList;
    }


    /**
     * 查询这条议程的所有附件
     *
     * @param reftableid
     * @return
     */
    @Override
    public List<SysAttachmentEntity> selectAgendaMeet(String reftableid) {
        List<SysAttachmentEntity> sysAttachmentEntities = baseDao.selectList(new QueryWrapper<SysAttachmentEntity>().eq("ref_table_id", reftableid).and(wrapper -> wrapper.eq("ref_table_name", "biz_meetingagenda").and(wrapper1 -> wrapper1.eq("type_code", "Agenda"))));
        return sysAttachmentEntities;
    }
}