package com.ptone.common.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
 * 
 *
 * @author wangzhi wangzhi@ifreedom001.com
 * @since 1.0.0 2019-03-11
 */
@Data
@EqualsAndHashCode(callSuper=false)
@TableName("sys_attachment")
public class SysAttachmentEntity extends BaseEntity {
	private static final long serialVersionUID = 1L;


    /**
     * 
     */
	private String refTableId;
    /**
     * 
     */
	private String refTableName;
    /**
     * 
     */
	private String displayName;
    /**
     * 
     */
	private String name;
    /**
     * 
     */
	private String extension;
    /**
     * 
     */
	private String relativePath;
    /**
     * 
     */
	private String internalName;
    /**
     * 
     */
	private String contentType;
    /**
     * 
     */
	private Long length;
    /**
     * 
     */
	private byte[] content;
    /**
     * 
     */
	private String typeCode;
    /**
     * 
     */
	private Integer persistentType;

    /**
     * 
     */
	private String creatorName;

    /**
     * 
     */
	private Date updateDate;
    /**
     * 
     */
	private Integer sequence;
    /**
     * 
     */
	private Integer isDelete;
    /**
     * 
     */
	private String lastModifiedUser;
    /**
     * 
     */
	private String lastModifiedUserName;
}