package com.ptone.modules.cms.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.ptone.common.constant.Constant;
import com.ptone.common.dao.SysAttachmentDao;
import com.ptone.common.entity.SysAttachmentEntity;
import com.ptone.common.page.PageData;
import com.ptone.common.service.impl.CrudServiceImpl;
import com.ptone.common.utils.ConvertUtils;
import com.ptone.modules.cms.dao.ColumnInfoDao;
import com.ptone.modules.cms.dao.InfoPublishDao;
import com.ptone.modules.cms.dto.ColumnInfoDTO;
import com.ptone.modules.cms.dto.InfoPublishDTO;
import com.ptone.modules.cms.entity.ColumnInfoEntity;
import com.ptone.modules.cms.entity.InfoPublishEntity;
import com.ptone.modules.cms.service.InfoPublishService;
import com.ptone.modules.security.user.SecurityUser;
import com.ptone.modules.security.user.UserDetail;
import com.ptone.modules.sys.dao.SysUserDao;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InfoPublishServiceImpl extends CrudServiceImpl<InfoPublishDao, InfoPublishEntity, InfoPublishDTO> implements InfoPublishService {
    @Autowired
    private InfoPublishDao infoPublishDao;
    @Autowired
    private ColumnInfoDao columnInfoDao;
    @Autowired
    private SysUserDao userDao;
    @Autowired
    private SysAttachmentDao sysAttachmentDao;

    /*@Override
    protected <T> PageData<T> getPageData(List<?> list, long total, Class<T> target) {

        return super.getPageData(list, total, target);
    }
*/
    @Override
    public QueryWrapper<InfoPublishEntity> getWrapper(Map<String, Object> params) {
        String id = (String) params.get("id");
        String title = (String) params.get("title");

        QueryWrapper<InfoPublishEntity> wrapper = new QueryWrapper<>();
        wrapper.eq(StringUtils.isNotBlank(id), "id", id);
        return wrapper;
    }

    /**
     * 得到信息列表
     *
     * @param infoPublishDTO
     * @return
     */
    @Override
    public PageData<ColumnInfoDTO> getInfoList(InfoPublishDTO infoPublishDTO) {
        UserDetail user = SecurityUser.getUser();
        infoPublishDTO.setUserId(user.getId());
        Map map = new HashMap();
        map.put("pcode", infoPublishDTO.getPcode());
        map.put("page", infoPublishDTO.getPage());
        map.put("limit", infoPublishDTO.getLimit());
        if (StringUtils.isNotEmpty(infoPublishDTO.getTitle())) {
            map.put("title", infoPublishDTO.getTitle());
        }
        IPage<ColumnInfoDTO> page = getPage(map, null, false);
        List<ColumnInfoDTO> infoList = columnInfoDao.getInfoList(map);
//        for (ColumnInfoDTO columnInfoEntity : infoList) {
//            SysUserEntity sysUserEntity = userDao.getById(columnInfoEntity.getInfoPublishDTO().getPublisher());
//            /*得到发布者姓名*/
//            columnInfoEntity.getInfoPublishDTO().setPublisherName(sysUserEntity.getRealName());
//        }
        for (ColumnInfoDTO infoDTO : infoList) {
            infoDTO.getInfoPublishDTO().setPublisherName(infoDTO.getInfoPublishDTO().getPublisher());
        }
        PageData<ColumnInfoDTO> columnInfoDTOPageData = new PageData<>(infoList, page.getTotal());

        return columnInfoDTOPageData;
    }

    /**
     * 新增信息
     *
     * @param infoPublishDTO
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveData(InfoPublishDTO infoPublishDTO) {
        List<Long> columnIds = infoPublishDTO.getColumnIds();

        if (CollUtil.isEmpty(columnIds)) {
            return;
        }
        InfoPublishEntity infoPublishEntity = ConvertUtils.sourceToTarget(infoPublishDTO, InfoPublishEntity.class);
        insert(infoPublishEntity);
        for (Long columnId : columnIds) {
            ColumnInfoEntity columnInfoEntity = new ColumnInfoEntity();
            columnInfoEntity.setColumnId(columnId);
            columnInfoEntity.setInfoId(infoPublishEntity.getId());
            columnInfoDao.insert(columnInfoEntity);
        }
    }

    /**
     * 修改信息
     *
     * @param infoPublishDTO
     */
    @Override
    public void updateData(InfoPublishDTO infoPublishDTO) {
        InfoPublishEntity publishEntity = new InfoPublishEntity();
        publishEntity.setTopStatus(0);
        infoPublishDao.update(publishEntity, getWrapper(new HashMap<>()));
        InfoPublishEntity infoPublishEntity = ConvertUtils.sourceToTarget(infoPublishDTO, InfoPublishEntity.class);
        updateById(infoPublishEntity);
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("info_id", infoPublishDTO.getId());
        //先删除信息栏目关系
        columnInfoDao.deleteByMap(hashMap);
        List<Long> columnIds = infoPublishDTO.getColumnIds();
        //角色没有一个菜单权限的情况
        if (CollUtil.isEmpty(columnIds)) {
            return;
        }

        //保存信息栏目关系
        for (Long columnId : columnIds) {
            ColumnInfoEntity columnInfoEntity = new ColumnInfoEntity();
            columnInfoEntity.setColumnId(columnId);
            columnInfoEntity.setInfoId(infoPublishEntity.getId());
            //保存
            columnInfoDao.insert(columnInfoEntity);
        }
    }

    @Override
    public void deleteData(Long ids[]) {
        for (Long id : ids) {
            HashMap<String, Object> hashMap = new HashMap<>();
            hashMap.put("info_id", id);
            columnInfoDao.deleteByMap(hashMap);
        }
        delete(ids);
    }

    /**
     * 排序
     *
     * @param params
     */
    @Override
    public void updateSort(Map<String, Object> params) {
        List<Map<String, Object>> mapList = (List<Map<String, Object>>) params.get("sort");
        for (Map<String, Object> map : mapList) {
            InfoPublishEntity entity = infoPublishDao.selectOne(new QueryWrapper<InfoPublishEntity>().eq("id", map.get("id")));
            entity.setInfoSort((Integer) map.get("sort"));
            infoPublishDao.updateById(entity);
        }
    }

    @Override
    public PageData<InfoPublishDTO> pageInfoPublishs(Map map) {
        IPage<InfoPublishEntity> page = baseDao.selectPage(
                getPage(map, Constant.CREATE_DATE, false),
                getWrapper(map)
        );
        PageData<InfoPublishDTO> infoPublishDTOPageData = getPageData(page, InfoPublishDTO.class);
        List<InfoPublishDTO> infoPublishDTOS = infoPublishDTOPageData.getList();
        for (InfoPublishDTO infoPublishDTO : infoPublishDTOS) {
            InfoPublishDTO infoPublish = getInfoById(infoPublishDTO.getId());
            infoPublishDTO.setAttachments(infoPublish.getAttachments());
            infoPublishDTO.setColumnIds(infoPublish.getColumnIds());
            infoPublishDTO.setPublisherName(infoPublish.getPublisherName());
        }
        return getPageData(page, InfoPublishDTO.class);
    }

    @Override
    public InfoPublishDTO getInfoById(Long id) {
        InfoPublishDTO data = get(id);

        List columnIds = new ArrayList();

        // 得到用户名
        //SysUserEntity userEntity = userDao.selectById(data.getPublisher());
        //data.setPublisherName(userEntity.getRealName());
        //得到该信息所属的栏目
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("info_id", id);
        List<ColumnInfoEntity> bizColumnInfoEntities = columnInfoDao.selectByMap(hashMap);
        for (ColumnInfoEntity columnInfoEntity : bizColumnInfoEntities) {
            columnIds.add(columnInfoEntity.getColumnId());
        }
        data.setColumnIds(columnIds);
        //得到该信息所有的附件
        List<SysAttachmentEntity> attachments = sysAttachmentDao.selectList(new QueryWrapper<SysAttachmentEntity>().eq("type_code","attechments").eq("ref_table_id", id));
        data.setAttachments(attachments);
        return data;
    }

    @Override
    public PageData<InfoPublishEntity> getInfoPublishs(Map<String, Object> map) {
        PageData<InfoPublishEntity> pageData = null;
        Integer total = infoPublishDao.findTotal(map);
        if (total != null && total.intValue() != 0) {
            int page = map.get("page") == null || "".equals(map.get("page")) ? 1 : Integer.parseInt(map.get("page").toString());
            int limit = map.get("limit") == null || "".equals(map.get("limit")) ? 10 : Integer.parseInt(map.get("limit").toString());
            int start = (page - 1) * limit;
            map.put("page", start);
            List<InfoPublishEntity> list = infoPublishDao.findPage(map);
            pageData = getPageData(list, total, InfoPublishEntity.class);
            return pageData;
        }
        return pageData;
    }
}