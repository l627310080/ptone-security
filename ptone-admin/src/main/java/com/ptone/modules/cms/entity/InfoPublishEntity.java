package com.ptone.modules.cms.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ptone.common.entity.BaseEntity;
import com.ptone.common.entity.SysAttachmentEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import java.util.List;

/**
 * 信息发布表
 *
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-22
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("biz_info_publish")
public class InfoPublishEntity extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 标题
     */
    private String title;
    /**
     * 链接
     */
    private String href;
    /**
     * 封面图片
     */
    private String coverPicture;
    /**
     * 显示日期
     */
    private Date showDate;
    /**
     * 发布人
     */
    private String publisher;
    /**
     * 信息内容
     */
    private String content;
    /**
     *
     */
    private Date updateDate;
    /**
     *
     */
    private String updator;


    @TableField(exist = false)
    private Integer infoSort;

    private Integer topStatus;

    @TableLogic
    private Integer hide;

    @TableField(exist = false)
    private String publisherName;

   // private Long id;

  //  private Long infoId;

    private Date createDate;

    @TableField(exist = false)
    private String code;

    @TableField(exist = false)
    private List<Long> columnIds;
    @TableField(exist = false)
    private String pcode;
    //所以附件
    @TableField(exist = false)
    private List<SysAttachmentEntity> attachments;
    @TableField(exist = false)
    private Long userId;
    @TableField(exist = false)
    private String affiliation;
    private String introduction;

}