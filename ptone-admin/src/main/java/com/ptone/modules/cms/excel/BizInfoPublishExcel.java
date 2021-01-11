package com.ptone.modules.cms.excel;

import cn.afterturn.easypoi.excel.annotation.Excel;
import lombok.Data;

import java.util.Date;

/**
 * 信息发布表
 *
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-22
 */
@Data
public class BizInfoPublishExcel {
    @Excel(name = "")
    private Long id;
    @Excel(name = "标题")
    private String title;
    @Excel(name = "链接")
    private String href;
    @Excel(name = "封面图片")
    private String coverPicture;
    @Excel(name = "显示日期")
    private Date showDate;
    @Excel(name = "发布人")
    private Long publisher;
    @Excel(name = "信息内容")
    private String content;
    @Excel(name = "")
    private Date createDate;
    @Excel(name = "")
    private String creator;
    @Excel(name = "")
    private Date updateDate;
    @Excel(name = "")
    private String updator;

}