package com.ptone.modules.cms.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ptone.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import java.util.List;

/**
 * 栏目表
 *
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-23
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("biz_column")
public class ColumnEntity extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 栏目名称
     */
    private String name;
    /**
     *
     */
    private String code;
    /**
     * 上级栏目
     */
    private String pcode;
    /**
     * 排序号
     */
    private Integer sort;
    /**
     * 是否为站点（0：不是，1：是）
     */
    private Integer siteStatus;
    /**
     * 是否需要前台显示
     */
    private Integer showStatus;
    /**
     * 栏目介绍
     */
    private String introduction;
    /**
     * 修改时间
     */
    private Date updateDate;
    /**
     *
     */
    private Long updator;

    @TableLogic
    private Integer hide;

    @TableField(exist = false)
    private Long columnId;
    private Date createDate;

    private Long creator;

    @TableField(exist = false)
    private List<ColumnEntity> children;

    @TableField(exist = false)
    private String parentName;
}