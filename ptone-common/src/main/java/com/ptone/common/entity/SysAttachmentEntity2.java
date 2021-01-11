package com.ptone.common.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-24
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_attachment")
public class SysAttachmentEntity2 extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 业务表主键
     */
    private Long refTableId;
    /**
     * 业务表名称
     */
    private String refTableName;
    /**
     * 展示的文件名
     */
    private String displayName;
    /**
     * 附件名称
     */
    private String name;
    /**
     * 附件扩展名
     */
    private String extension;
    /**
     * 附件相对路径
     */
    private String relativePath;
    /**
     * 附件内部文件名
     */
    private String internalName;
    /**
     * mine类型名
     */
    private String contentType;
    /**
     * 附件大小
     */
    private Integer length;
    /**
     * 附件二进制（当附件存储类型为数据库存储时有效）
     */
    private String content;
    /**
     * 业务类型表型
     */
    private String typeCode;
    /**
     * 附件存储类型（0 磁盘存储，1 数据库存储）
     */
    private Integer persistentType;
    /**
     * 创建人姓名
     */
    private String creatorName;
    /**
     * 修改时间
     */
    private Date updateDate;
    /**
     * 排序号
     */
    private Integer sequence;
    /**
     * 是否删除 （0正常，1已删除）
     */
    private Integer isDelete;
    /**
     * 最后修改人姓名
     */
    private String lastModifiedUserName;
    /**
     *
     */
    private String lastModifiedUser;
    /**
     * 最后修改人标识
     */
    private String creatorId;

    private Integer sizeType;
}