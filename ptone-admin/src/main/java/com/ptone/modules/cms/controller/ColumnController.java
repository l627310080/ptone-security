package com.ptone.modules.cms.controller;

import com.ptone.common.annotation.LogOperation;
import com.ptone.common.constant.Constant;
import com.ptone.common.page.PageData;
import com.ptone.common.utils.Result;
import com.ptone.common.validator.AssertUtils;
import com.ptone.common.validator.ValidatorUtils;
import com.ptone.common.validator.group.AddGroup;
import com.ptone.common.validator.group.DefaultGroup;
import com.ptone.common.validator.group.UpdateGroup;
import com.ptone.modules.cms.dao.ColumnDao;
import com.ptone.modules.cms.dto.ColumnDTO;
import com.ptone.modules.cms.entity.ColumnEntity;
import com.ptone.modules.cms.service.ColumnService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * 栏目表
 *
 * @author ningshuai wangzhi@ifreedom001.com
 * @since 1.0.0 2019-04-23
 */
@RestController
@RequestMapping("cms/bizcolumn")
@Api(tags = "栏目表")
public class ColumnController {
    @Autowired
    private ColumnService columnService;
    @Autowired
    private ColumnDao columnDao;

    @GetMapping("page")
    @ApiOperation("分页")
    @ApiImplicitParams({
            @ApiImplicitParam(name = Constant.PAGE, value = "当前页码，从1开始", paramType = "query", required = true, dataType = "int"),
            @ApiImplicitParam(name = Constant.LIMIT, value = "每页显示记录数", paramType = "query", required = true, dataType = "int"),
            @ApiImplicitParam(name = Constant.ORDER_FIELD, value = "排序字段", paramType = "query", dataType = "String"),
            @ApiImplicitParam(name = Constant.ORDER, value = "排序方式，可选值(asc、desc)", paramType = "query", dataType = "String")
    })
    public Result<PageData<ColumnDTO>> page(@ApiIgnore @RequestParam Map<String, Object> params) {
        PageData<ColumnDTO> page = columnService.page(params);

        return new Result<PageData<ColumnDTO>>().ok(page);
    }

    @GetMapping("{id}")
    @ApiOperation("信息")
    @RequiresPermissions("cms:bizcolumn:info")
    public Result<ColumnDTO> get(@PathVariable("id") Long id) {
        ColumnDTO data = columnService.getColumnById(id);

        return new Result<ColumnDTO>().ok(data);
    }

    @PostMapping
    @ApiOperation("保存")
    @LogOperation("保存")
    @RequiresPermissions("cms:bizcolumn:save")
    public Result save(@RequestBody ColumnDTO dto) {
        //效验数据
        ValidatorUtils.validateEntity(dto, AddGroup.class, DefaultGroup.class);

        columnService.save(dto);

        return new Result();
    }

    @PutMapping
    @ApiOperation("修改")
    @LogOperation("修改")
    @RequiresPermissions("cms:bizcolumn:update")
    public Result update(@RequestBody ColumnDTO dto) {
        //效验数据
        ValidatorUtils.validateEntity(dto, UpdateGroup.class, DefaultGroup.class);

        columnService.update(dto);

        return new Result();
    }

    @DeleteMapping
    @ApiOperation("删除")
    @LogOperation("删除")
    @RequiresPermissions("cms:bizcolumn:delete")
    public Result delete(@RequestBody Long[] ids) {
        //效验数据
        AssertUtils.isArrayEmpty(ids, "id");

        columnService.deleteData(ids);

        return new Result();
    }

    @GetMapping("list")
    public Result<List<ColumnDTO>> getCategoryList() {
        return new Result<List<ColumnDTO>>().ok(columnService.getCategoryList());
    }

    /**
     * 判断是否有子栏目
     *
     * @param params
     * @return
     */
    @PostMapping("ifHasChildren")
    public Result ifHasChildren(@RequestBody Map<String, Object> params) {
        boolean flag = columnService.ifHasChildren((String) params.get("code"));
        return new Result().ok(flag);
    }

    /**
     * 排序
     *
     * @param params
     */
    @PostMapping("updateSort")
    public void updateSort(@RequestBody Map<String, Object> params) {
        columnService.updateSort(params);
    }

    /**
     * 得到栏目名字
     *
     * @param params
     * @return
     */
    @PostMapping("getColumnNames")
    public Result getColumnNames(@RequestBody Map<String, Object> params) {
        List<Long> columnIds = (List<Long>) params.get("columnIds");
        if (columnIds.size() == 0) {
            return new Result().ok(null);
        }
        List<ColumnEntity> columnEntities = columnDao.selectBatchIds(columnIds);
        ArrayList<String> columnNames = new ArrayList<>();
        for (ColumnEntity columnEntity : columnEntities) {
                columnNames.add(columnEntity.getName());
        }
        return new Result().ok(columnNames);
    }

    /**
     * 得到所有父栏目
     *
     * @param params
     * @return
     */
    @PostMapping("getColumnParents")
    public Result getCoulumnParents(@RequestBody Map<String, Object> params) {
        List<ColumnDTO> coulumnParents = columnService.getCoulumnParents((String) params.get("code"));
        return new Result().ok(coulumnParents);
    }

    /**
     * 得到所有父栏目以及下属发布的信息
     *
     * @param params
     * @return
     */
    @PostMapping("getCategoryAndInfoList")
    public Result getCategoryAndInfoList(@RequestBody Map<String, Object> params) {
        List<ColumnDTO> coulumnParents = columnService.getCategoryAndInfoList((String) params.get("code"));
        return new Result().ok(coulumnParents);
    }

}