package com.ptone.modules.cms.controller;

import com.ptone.common.annotation.LogOperation;
import com.ptone.common.constant.Constant;
import com.ptone.common.page.PageData;
import com.ptone.common.utils.ExcelUtils;
import com.ptone.common.utils.Result;
import com.ptone.common.validator.AssertUtils;
import com.ptone.common.validator.ValidatorUtils;
import com.ptone.common.validator.group.AddGroup;
import com.ptone.common.validator.group.DefaultGroup;
import com.ptone.modules.cms.dao.ColumnInfoDao;
import com.ptone.modules.cms.dto.ColumnInfoDTO;
import com.ptone.modules.cms.dto.InfoPublishDTO;
import com.ptone.modules.cms.entity.InfoPublishEntity;
import com.ptone.modules.cms.excel.BizInfoPublishExcel;
import com.ptone.modules.cms.service.InfoPublishService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;


/**
 * 信息发布表
 *
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-22
 */
@RestController
@RequestMapping("cms/infopublish")
@Api(tags = "信息发布表")
public class InfoPublishController {
    @Autowired
    private InfoPublishService bizInfoPublishService;
    @Autowired
    private ColumnInfoDao columnInfoDao;

    @GetMapping("page")
    @ApiOperation("分页")
    @ApiImplicitParams({
            @ApiImplicitParam(name = Constant.PAGE, value = "当前页码，从1开始", paramType = "query", required = true, dataType = "int"),
            @ApiImplicitParam(name = Constant.LIMIT, value = "每页显示记录数", paramType = "query", required = true, dataType = "int"),
            @ApiImplicitParam(name = Constant.ORDER_FIELD, value = "排序字段", paramType = "query", dataType = "String"),
            @ApiImplicitParam(name = Constant.ORDER, value = "排序方式，可选值(asc、desc)", paramType = "query", dataType = "String")
    })
    public Result page(InfoPublishDTO InfoPublishDTO) {
        PageData<ColumnInfoDTO> pageData = bizInfoPublishService.getInfoList(InfoPublishDTO);
        return new Result<>().ok(pageData);
    }

    @GetMapping("pageInfoPublishs")
    @ApiOperation("分页")
    @ApiImplicitParams({
            @ApiImplicitParam(name = Constant.PAGE, value = "当前页码，从1开始", paramType = "query", required = true, dataType = "int"),
            @ApiImplicitParam(name = Constant.LIMIT, value = "每页显示记录数", paramType = "query", required = true, dataType = "int"),
            @ApiImplicitParam(name = Constant.ORDER_FIELD, value = "排序字段", paramType = "query", dataType = "String"),
            @ApiImplicitParam(name = Constant.ORDER, value = "排序方式，可选值(asc、desc)", paramType = "query", dataType = "String")
    })
    public Result pageInfoPublishs(@Ignore @RequestParam Map map) {
        PageData<InfoPublishDTO> infoPublishDTOPageData = bizInfoPublishService.pageInfoPublishs(map);
        return new Result<>().ok(infoPublishDTOPageData);
    }

    @GetMapping("{id}")
    @ApiOperation("信息")
    public Result<InfoPublishDTO> get(@PathVariable("id") Long id) {
        InfoPublishDTO data = bizInfoPublishService.getInfoById(id);
        return new Result<InfoPublishDTO>().ok(data);
    }

    @PostMapping
    @ApiOperation("保存")
    @LogOperation("保存")
    @RequiresPermissions("cms:infopublish:save")
    public Result save(@RequestBody InfoPublishDTO dto) {
        //效验数据
        ValidatorUtils.validateEntity(dto, AddGroup.class, DefaultGroup.class);
        bizInfoPublishService.saveData(dto);
        return new Result();
    }

    @PutMapping
    @ApiOperation("修改")
    @LogOperation("修改")
    @RequiresPermissions("cms:infopublish:update")
    public Result update(@RequestBody InfoPublishDTO dto) {
        //效验数据
        bizInfoPublishService.updateData(dto);
        return new Result();
    }

    @DeleteMapping
    @ApiOperation("删除")
    @LogOperation("删除")
    @RequiresPermissions("cms:infopublish:delete")
    public Result delete(@RequestBody Long[] ids) {
        //效验数据
        AssertUtils.isArrayEmpty(ids, "id");

        bizInfoPublishService.deleteData(ids);

        return new Result();
    }

    @GetMapping("export")
    @ApiOperation("导出")
    @LogOperation("导出")
    @RequiresPermissions("cms:infopublish:export")
    public void export(@ApiIgnore @RequestParam Map<String, Object> params, HttpServletResponse response) throws Exception {
        List<InfoPublishDTO> list = bizInfoPublishService.list(params);

        ExcelUtils.exportExcelToTarget(response, null, list, BizInfoPublishExcel.class);
    }

    /**
     * 排序
     *
     * @param params
     */
    @PostMapping("updateSort")
    public void updateSort(@RequestBody Map<String, Object> params) {
        bizInfoPublishService.updateSort(params);
    }

    @RequestMapping("getById")
    @ApiOperation("信息")
    public Result<InfoPublishDTO> getById(@RequestParam Long id) {
        InfoPublishDTO data = bizInfoPublishService.getInfoById(id);
        return new Result<InfoPublishDTO>().ok(data);
    }


    @RequestMapping("getInfoPublishs")
    @ApiOperation("信息")
    public Result getInfoPublishs(@RequestParam Map<String,Object> params) {
        PageData<InfoPublishEntity> pageData = bizInfoPublishService.getInfoPublishs(params);
        return new Result<>().ok(pageData);
    }

}