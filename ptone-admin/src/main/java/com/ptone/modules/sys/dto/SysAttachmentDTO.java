package com.ptone.modules.sys.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;


/**
 * 
 *
 * @author wangzhi wangzhi@ifreedom001.com
 * @since 1.0.0 2019-03-11
 */
@Data
@ApiModel(value = "")
public class SysAttachmentDTO implements Serializable {
    private static final long serialVersionUID = 1L;

	@ApiModelProperty(value = "")
	private Long id;

	@ApiModelProperty(value = "")
	private String refTableId;

	@ApiModelProperty(value = "")
	private String refTableName;

	@ApiModelProperty(value = "")
	private String displayName;

	@ApiModelProperty(value = "")
	private String name;

	@ApiModelProperty(value = "")
	private String extension;

	@ApiModelProperty(value = "")
	private String relativePath;

	@ApiModelProperty(value = "")
	private String internalName;

	@ApiModelProperty(value = "")
	private String contentType;

	@ApiModelProperty(value = "")
	private Long length;

	@ApiModelProperty(value = "")
	private byte[] content;

	@ApiModelProperty(value = "")
	private String typeCode;

	@ApiModelProperty(value = "")
	private Integer persistentType;



	@ApiModelProperty(value = "")
	private String creatorName;

	@ApiModelProperty(value = "")
	private Date updateDate;

	@ApiModelProperty(value = "")
	private Integer sequence;

	@ApiModelProperty(value = "")
	private Integer isDelete;

	@ApiModelProperty(value = "")
	private String lastModifiedUser;

	@ApiModelProperty(value = "")
	private String lastModifiedUserName;


}