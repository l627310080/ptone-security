package com.ptone.modules.cms.dto;

import com.ptone.common.entity.SysAttachmentEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@ApiModel(value = "信息发布表")
public class InfoPublishDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "")
    private Long id;

   // @TableField(exist = false)
 //   private Long infoId;

    @ApiModelProperty(value = "标题")
    private String title;

    @ApiModelProperty(value = "链接")
    private String href;

    @ApiModelProperty(value = "封面图片")
    private String coverPicture;


    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ApiModelProperty(value = "显示日期")
    private Date showDate;
    @ApiModelProperty(value = "发布人")
    private String publisher;

    @ApiModelProperty(value = "信息内容")
    private String content;

    @ApiModelProperty(value = "")
    private Date createDate;

    @ApiModelProperty(value = "")
    private String creator;

    @ApiModelProperty(value = "")
    private Date updateDate;

    @ApiModelProperty(value = "")
    private String updator;

    private String code;

    private List<Long> columnIds;

    private Integer topStatus;

    private Integer infoSort;

    private String pcode;

    private String publisherName;
    //所有附件
    private List<SysAttachmentEntity> attachments;

    private Long userId;

    private String affiliation;

    private String page;
    private String limit;
    @ApiModelProperty(value = "摘要")
    private String introduction;

}