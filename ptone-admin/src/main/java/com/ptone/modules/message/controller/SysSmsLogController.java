package com.ptone.modules.message.controller;

import com.ptone.common.annotation.LogOperation;
import com.ptone.common.constant.Constant;
import com.ptone.common.page.PageData;
import com.ptone.common.utils.Result;
import com.ptone.modules.message.dto.SysSmsLogDTO;
import com.ptone.modules.message.service.SysSmsLogService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.Arrays;
import java.util.Map;

/**
 * 短信日志
 *
 * @author Mark sunlightcs@gmail.com
 */
@RestController
@RequestMapping("sys/smslog")
@Api(tags="短信日志")
public class SysSmsLogController {
    @Autowired
    private SysSmsLogService sysSmsLogService;

    @GetMapping("page")
    @ApiOperation("分页")
    @ApiImplicitParams({
        @ApiImplicitParam(name = Constant.PAGE, value = "当前页码，从1开始", paramType = "query", required = true, dataType="int") ,
        @ApiImplicitParam(name = Constant.LIMIT, value = "每页显示记录数", paramType = "query",required = true, dataType="int") ,
        @ApiImplicitParam(name = Constant.ORDER_FIELD, value = "排序字段", paramType = "query", dataType="String") ,
        @ApiImplicitParam(name = Constant.ORDER, value = "排序方式，可选值(asc、desc)", paramType = "query", dataType="String")
    })
    @RequiresPermissions("sys:smslog:all")
    public Result<PageData<SysSmsLogDTO>> page(@ApiIgnore @RequestParam Map<String, Object> params){
        PageData<SysSmsLogDTO> page = sysSmsLogService.page(params);

        return new Result<PageData<SysSmsLogDTO>>().ok(page);
    }

    @DeleteMapping
    @ApiOperation("删除")
    @LogOperation("删除")
    @RequiresPermissions("sys:smslog:all")
    public Result delete(@RequestBody Long[] ids){
        sysSmsLogService.deleteBatchIds(Arrays.asList(ids));

        return new Result();
    }
}