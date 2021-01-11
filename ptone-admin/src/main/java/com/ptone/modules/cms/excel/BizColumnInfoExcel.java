package com.ptone.modules.cms.excel;

import cn.afterturn.easypoi.excel.annotation.Excel;
import lombok.Data;

import java.util.Date;

/**
 * 栏目信息关联表
 *
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-22
 */
@Data
public class BizColumnInfoExcel {
    @Excel(name = "")
    private Long id;
    @Excel(name = "")
    private Long infoId;
    @Excel(name = "")
    private Long columnId;
    @Excel(name = "")
    private Date createDate;
    @Excel(name = "")
    private String creator;
    @Excel(name = "")
    private Date updateDate;
    @Excel(name = "")
    private String updator;

}