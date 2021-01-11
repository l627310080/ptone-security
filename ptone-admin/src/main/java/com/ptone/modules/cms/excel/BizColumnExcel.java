package com.ptone.modules.cms.excel;

import cn.afterturn.easypoi.excel.annotation.Excel;
import lombok.Data;

import java.util.Date;

/**
 * 栏目表
 *
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-23
 */
@Data
public class BizColumnExcel {
    @Excel(name = "")
    private Long id;
    @Excel(name = "栏目名称")
    private String name;
    @Excel(name = "")
    private String code;
    @Excel(name = "上级栏目")
    private String pcode;
    @Excel(name = "排序号")
    private Integer sort;
    @Excel(name = "是否为站点（0：不是，1：是）")
    private Integer siteStatus;
    @Excel(name = "是否需要前台显示")
    private Integer showStatus;
    @Excel(name = "栏目介绍")
    private String introduction;
    @Excel(name = "创建时间")
    private Date createDate;
    @Excel(name = "")
    private Long creator;
    @Excel(name = "修改时间")
    private Date updateDate;
    @Excel(name = "")
    private Long updator;

}