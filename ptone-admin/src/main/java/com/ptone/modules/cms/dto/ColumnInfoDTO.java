package com.ptone.modules.cms.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
@ApiModel(value = "栏目信息关联表")
public class ColumnInfoDTO implements Serializable {
    private static final long serialVersionUID = 1L;

	@ApiModelProperty(value = "")
	private Long id;

	@ApiModelProperty(value = "")
	private Long infoId;

	@ApiModelProperty(value = "")
	private Long columnId;

	@ApiModelProperty(value = "")
	private Date createDate;

	@ApiModelProperty(value = "")
	private String creator;

	@ApiModelProperty(value = "")
	private Date updateDate;

	@ApiModelProperty(value = "")
	private String updator;

	private Integer infoSort;

	private InfoPublishDTO infoPublishDTO;

	private ColumnDTO columnDTO;


}