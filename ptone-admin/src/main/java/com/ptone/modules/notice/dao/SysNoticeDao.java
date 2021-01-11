/**
 * Copyright (c) 2019 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */
package com.ptone.modules.notice.dao;

import com.ptone.common.dao.BaseDao;
import com.ptone.modules.notice.entity.SysNoticeEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* 通知管理
*
* @author Mark sunlightcs@gmail.com
*/
@Mapper
public interface SysNoticeDao extends BaseDao<SysNoticeEntity> {
    /**
     * 获取被通知的用户列表
     * @param noticeId  通知ID
     */
    List<SysNoticeEntity> getNoticeUserList(Long noticeId);

    /**
     * 获取我的通知列表
     * @param receiverId  接收者ID
     */
    List<SysNoticeEntity> getMyNoticeList(Long receiverId);
}