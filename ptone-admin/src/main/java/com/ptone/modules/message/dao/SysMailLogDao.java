/**
 * Copyright (c) 2018 人人开源 All rights reserved.
 *
 * https://www.renren.io
 *
 * 版权所有，侵权必究！
 */

package com.ptone.modules.message.dao;

import com.ptone.common.dao.BaseDao;
import com.ptone.modules.message.entity.SysMailLogEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 邮件发送记录
 * 
 * @author Mark sunlightcs@gmail.com
 */
@Mapper
public interface SysMailLogDao extends BaseDao<SysMailLogEntity> {
	
}
