package com.ptone.modules.sys.controller;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.ptone.common.utils.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @description: Id生成
 * @author: wangzhi
 * @create: 2019-05-06 11:56
 **/
@RestController
@RequestMapping("sys/idWorld")
public class SysIdWorldController {

    @GetMapping("/getIdStr")
    public Result<String> getIdStr(){
        return new Result<String>().ok(IdWorker.getIdStr());
    }
}
