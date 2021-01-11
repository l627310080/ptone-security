package com.ptone.modules.cms.dto;

import com.ptone.modules.cms.entity.InfoPublishEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@ApiModel(value = "栏目表")
public class ColumnDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private  Long id;
	@ApiModelProperty(value = "")
	private Long columnId;

	@ApiModelProperty(value = "栏目名称")
	private String name;

	@ApiModelProperty(value = "")
	private String code;

	@ApiModelProperty(value = "上级栏目")
	private String pcode;

	@ApiModelProperty(value = "排序号")
	private Integer sort;

	@ApiModelProperty(value = "是否为站点（0：不是，1：是）")
	private Integer siteStatus;

	@ApiModelProperty(value = "是否需要前台显示")
	private Integer showStatus;

	@ApiModelProperty(value = "栏目介绍")
	private String introduction;

	@ApiModelProperty(value = "创建时间")
	private Date createDate;

	@ApiModelProperty(value = "")
	private Long creator;

	@ApiModelProperty(value = "修改时间")
	private Date updateDate;

	@ApiModelProperty(value = "")
	private Long updator;

	private List<ColumnDTO> children;

	private List<InfoPublishEntity> infoPublishs;

	private String parentName;
}