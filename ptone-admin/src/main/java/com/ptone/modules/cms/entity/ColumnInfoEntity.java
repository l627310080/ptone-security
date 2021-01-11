package com.ptone.modules.cms.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ptone.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
 * 栏目信息关联表
 *
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-22
 */
@Data
@EqualsAndHashCode(callSuper=false)
@TableName("biz_column_info")
public class ColumnInfoEntity extends BaseEntity {
	private static final long serialVersionUID = 1L;

    /**
     * 
     */
	private Long infoId;
    /**
     * 
     */
	private Long columnId;
    /**
     * 
     */
	private Date updateDate;
    /**
     * 
     */
	private String updator;

	private Integer sort;

	@TableLogic
	private Integer hide;


	@TableField(exist = false)
	private ColumnEntity columnDTO;

	@TableField(exist = false)
	private InfoPublishEntity infoPublishDTO;


	private Date createDate;

	@TableField(exist = false)
	private Integer infoSort;



}