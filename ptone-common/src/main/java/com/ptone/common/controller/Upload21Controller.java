package com.ptone.common.controller;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ptone.common.dao.SysAttachment2Dao;
import com.ptone.common.entity.SysAttachmentEntity2;
import com.ptone.common.exception.RenException;
import com.ptone.common.utils.DateUtils;
import com.ptone.common.utils.Result;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * @description: 文件上传处理控制器
 * @author: wangzhi
 * @create: 2019-04-29 15:46
 **/
@Slf4j
@RestController
@RequestMapping("/upload2")
public class Upload21Controller {

    @Value("${biz-properties.fileUploadPath}")
    private String fileUploadPath;


    /*public UploadController(){
        ClassPathResource resource = new ClassPathResource("application.yml");
        try {

            Properties properties = PropertiesLoaderUtils.loadProperties(resource);
            this.fileUploadPath3 = properties.getProperty("fileUploadPath1234");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }*/


    @Autowired
    private SysAttachment2Dao attachment2Dao;

    /**
     * 文件上传
     * <p>
     * action!=config 是表示不是获取富文本编辑器参数
     *
     * @return
     */
    @RequestMapping(value = "/file", params = {"action!=config"})
    public String fileUpload(@RequestParam("file") MultipartFile multipartFile, HttpServletRequest request) throws IOException {

        if (multipartFile == null || multipartFile.isEmpty()) {
            return JSONObject.toJSONString(new Result().error("文件不能为空"));
        }

        String tableId = request.getParameter("tableId");
        String tableName = request.getParameter("tableName");
        String typeCode = request.getParameter("typeCode");
        /*是否开启多种大小图片上传*/
        String uploadFlag = request.getParameter("uploadFlag");

        checkIsNullParam(tableId, "'tableId'不能为空！");
        checkIsNullParam(tableName, "'tableName'不能为空！");
        checkIsNullParam(typeCode, "'typeCode'不能为空！");


        String contentType = multipartFile.getContentType();
        log.debug("上传文件类型:", contentType);

        //设置类型文件夹名/image .. /pdf 如果是jpg\jpeg\gif就是 /image , 否则就是文件后缀
        String fileType = contentType.substring(0, contentType.lastIndexOf("/"));
        if (!"image".equalsIgnoreCase(fileType)) {
            fileType = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf(".") + 1);
        }
        String path = fileUploadPath + File.separator + fileType + File.separator + getDatePath();


        String originalFilename = multipartFile.getOriginalFilename();
        int size = (int) multipartFile.getSize();
        System.out.println(originalFilename + "-->" + size);


        String fileName = UUID.randomUUID().toString().replaceAll("-", "") + originalFilename.substring(originalFilename.lastIndexOf("."));
        String fullPath = path + File.separator + fileName;

        File dest = new File(fullPath);
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }

        multipartFile.transferTo(dest);


        String relativePath = fullPath.replace(fileUploadPath.substring(0, fileUploadPath.lastIndexOf(File.separator)), "");
        String internalName = relativePath.substring(relativePath.lastIndexOf(File.separator) + 1);

        SysAttachmentEntity2 sysAttachmentEntity = getSysAttachmentEntity(multipartFile, tableId, tableName, typeCode, contentType, originalFilename, fileName, relativePath, internalName, 0);
        attachment2Dao.insert(sysAttachmentEntity);


        //是否要进行将一张图片拆分为4张，原图，大中小图片
        if ("true".equals(uploadFlag) && contentType.contains("image")) {
            String[] sizeName = new String[]{"_max", "_middle", "_min"};
            //图片质量
            double[] pictureSize = new double[]{0.75, 0.5, 0.25};
            for (int i = 0; i < sizeName.length; i++) {
                String uuId = fileName.substring(0, fileName.lastIndexOf("."));
                String splitFullPath = path + File.separator + uuId + sizeName[i];
                //图片压缩
                //不缩放， 进行质量裁剪
                Thumbnails.of(dest.getAbsolutePath()).scale(1f).outputQuality(pictureSize[i]).outputFormat("jpg").toFile(splitFullPath);

                String relativePathSplit = splitFullPath.replace(fileUploadPath.substring(0, fileUploadPath.lastIndexOf(File.separator)), "") + ".jpg";
                String internalNameSplit = relativePathSplit.substring(relativePathSplit.lastIndexOf(File.separator) + 1);

                SysAttachmentEntity2 sysAttachmentEntitySplit = getSysAttachmentEntity(multipartFile, tableId, tableName, typeCode, contentType, originalFilename, fileName, relativePathSplit, internalNameSplit, i + 1);
                attachment2Dao.insert(sysAttachmentEntitySplit);

            }
        }


        if (!isBaiduUeditor(request)) {
            //普通上传
            Map<String, String> resultMap = Maps.newHashMap();
            resultMap.put("name", originalFilename);
            resultMap.put("fileId", sysAttachmentEntity.getId().toString());
            resultMap.put("url", File.separator + relativePath);

            return JSONObject.toJSONString(new Result().ok(resultMap));
        } else {
            //百度编辑器上传
            Map<String, String> resultMap = Maps.newHashMap();
            //String state, String url, String title, String original
            resultMap.put("url", relativePath);
            resultMap.put("state", "SUCCESS");
            resultMap.put("title", originalFilename);
            resultMap.put("original", originalFilename);
            return JSONObject.toJSONString(resultMap);
        }


    }

    private boolean isBaiduUeditor(HttpServletRequest request) {
        return StringUtils.isNotBlank(request.getParameter("action"));
    }


    /**
     * 获取百度富文本编辑器参数
     */
    @GetMapping(value = "/file", params = {"action=config"})
    @ResponseBody
    public String getUeditorConfig() {
        String config = "/* 前后端通信相关的配置,注释只允许使用多行方式 */\n" +
                "{\n" +
                "    /* 上传图片配置项 */\n" +
                "    \"imageActionName\": \"uploadimage\", /* 执行上传图片的action名称 */\n" +
                "    \"imageFieldName\": \"file\", /* 提交的图片表单名称 */\n" +
                "    \"imageMaxSize\": 2048000, /* 上传大小限制，单位B */\n" +
                "    \"imageAllowFiles\": [\".png\", \".jpg\", \".jpeg\", \".gif\", \".bmp\"], /* 上传图片格式显示 */\n" +
                "    \"imageCompressEnable\": true, /* 是否压缩图片,默认是true */\n" +
                "    \"imageCompressBorder\": 1600, /* 图片压缩最长边限制 */\n" +
                "    \"imageInsertAlign\": \"none\", /* 插入的图片浮动方式 */\n" +
                "    \"imageUrlPrefix\": \"\", /* 图片访问路径前缀 */\n" +
                "    \"imagePathFormat\": \"/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}\", /* 上传保存路径,可以自定义保存路径和文件名格式 */\n" +
                "                                /* {filename} 会替换成原文件名,配置这项需要注意中文乱码问题 */\n" +
                "                                /* {rand:6} 会替换成随机数,后面的数字是随机数的位数 */\n" +
                "                                /* {time} 会替换成时间戳 */\n" +
                "                                /* {yyyy} 会替换成四位年份 */\n" +
                "                                /* {yy} 会替换成两位年份 */\n" +
                "                                /* {mm} 会替换成两位月份 */\n" +
                "                                /* {dd} 会替换成两位日期 */\n" +
                "                                /* {hh} 会替换成两位小时 */\n" +
                "                                /* {ii} 会替换成两位分钟 */\n" +
                "                                /* {ss} 会替换成两位秒 */\n" +
                "                                /* 非法字符 \\ : * ? \" < > | */\n" +
                "                                /* 具请体看线上文档: fex.baidu.com/ueditor/#use-format_upload_filename */\n" +
                "\n" +
                "    /* 涂鸦图片上传配置项 */\n" +
                "    \"scrawlActionName\": \"uploadscrawl\", /* 执行上传涂鸦的action名称 */\n" +
                "    \"scrawlFieldName\": \"file\", /* 提交的图片表单名称 */\n" +
                "    \"scrawlPathFormat\": \"/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}\", /* 上传保存路径,可以自定义保存路径和文件名格式 */\n" +
                "    \"scrawlMaxSize\": 2048000, /* 上传大小限制，单位B */\n" +
                "    \"scrawlUrlPrefix\": \"\", /* 图片访问路径前缀 */\n" +
                "    \"scrawlInsertAlign\": \"none\",\n" +
                "\n" +
                "    /* 截图工具上传 */\n" +
                "    \"snapscreenActionName\": \"uploadimage\", /* 执行上传截图的action名称 */\n" +
                "    \"snapscreenPathFormat\": \"/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}\", /* 上传保存路径,可以自定义保存路径和文件名格式 */\n" +
                "    \"snapscreenUrlPrefix\": \"\", /* 图片访问路径前缀 */\n" +
                "    \"snapscreenInsertAlign\": \"none\", /* 插入的图片浮动方式 */\n" +
                "\n" +
                "    /* 抓取远程图片配置 */\n" +
                "    \"catcherLocalDomain\": [\"127.0.0.1\", \"localhost\", \"img.baidu.com\"],\n" +
                "    \"catcherActionName\": \"catchimage\", /* 执行抓取远程图片的action名称 */\n" +
                "    \"catcherFieldName\": \"source\", /* 提交的图片列表表单名称 */\n" +
                "    \"catcherPathFormat\": \"/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}\", /* 上传保存路径,可以自定义保存路径和文件名格式 */\n" +
                "    \"catcherUrlPrefix\": \"\", /* 图片访问路径前缀 */\n" +
                "    \"catcherMaxSize\": 2048000, /* 上传大小限制，单位B */\n" +
                "    \"catcherAllowFiles\": [\".png\", \".jpg\", \".jpeg\", \".gif\", \".bmp\"], /* 抓取图片格式显示 */\n" +
                "\n" +
                "    /* 上传视频配置 */\n" +
                "    \"videoActionName\": \"uploadvideo\", /* 执行上传视频的action名称 */\n" +
                "    \"videoFieldName\": \"file\", /* 提交的视频表单名称 */\n" +
                "    \"videoPathFormat\": \"/ueditor/jsp/upload/video/{yyyy}{mm}{dd}/{time}{rand:6}\", /* 上传保存路径,可以自定义保存路径和文件名格式 */\n" +
                "    \"videoUrlPrefix\": \"\", /* 视频访问路径前缀 */\n" +
                "    \"videoMaxSize\": 102400000, /* 上传大小限制，单位B，默认100MB */\n" +
                "    \"videoAllowFiles\": [\n" +
                "        \".flv\", \".swf\", \".mkv\", \".avi\", \".rm\", \".rmvb\", \".mpeg\", \".mpg\",\n" +
                "        \".ogg\", \".ogv\", \".mov\", \".wmv\", \".mp4\", \".webm\", \".mp3\", \".wav\", \".mid\"], /* 上传视频格式显示 */\n" +
                "\n" +
                "    /* 上传文件配置 */\n" +
                "    \"fileActionName\": \"uploadfile\", /* controller里,执行上传视频的action名称 */\n" +
                "    \"fileFieldName\": \"file\", /* 提交的文件表单名称 */\n" +
                "    \"filePathFormat\": \"/ueditor/jsp/upload/file/{yyyy}{mm}{dd}/{time}{rand:6}\", /* 上传保存路径,可以自定义保存路径和文件名格式 */\n" +
                "    \"fileUrlPrefix\": \"\", /* 文件访问路径前缀 */\n" +
                "    \"fileMaxSize\": 51200000, /* 上传大小限制，单位B，默认50MB */\n" +
                "    \"fileAllowFiles\": [\n" +
                "        \".png\", \".jpg\", \".jpeg\", \".gif\", \".bmp\",\n" +
                "        \".flv\", \".swf\", \".mkv\", \".avi\", \".rm\", \".rmvb\", \".mpeg\", \".mpg\",\n" +
                "        \".ogg\", \".ogv\", \".mov\", \".wmv\", \".mp4\", \".webm\", \".mp3\", \".wav\", \".mid\",\n" +
                "        \".rar\", \".zip\", \".tar\", \".gz\", \".7z\", \".bz2\", \".cab\", \".iso\",\n" +
                "        \".doc\", \".docx\", \".xls\", \".xlsx\", \".ppt\", \".pptx\", \".pdf\", \".txt\", \".md\", \".xml\"\n" +
                "    ], /* 上传文件格式显示 */\n" +
                "\n" +
                "    /* 列出指定目录下的图片 */\n" +
                "    \"imageManagerActionName\": \"listimage\", /* 执行图片管理的action名称 */\n" +
                "    \"imageManagerListPath\": \"/ueditor/jsp/upload/image/\", /* 指定要列出图片的目录 */\n" +
                "    \"imageManagerListSize\": 20, /* 每次列出文件数量 */\n" +
                "    \"imageManagerUrlPrefix\": \"\", /* 图片访问路径前缀 */\n" +
                "    \"imageManagerInsertAlign\": \"none\", /* 插入的图片浮动方式 */\n" +
                "    \"imageManagerAllowFiles\": [\".png\", \".jpg\", \".jpeg\", \".gif\", \".bmp\"], /* 列出的文件类型 */\n" +
                "\n" +
                "    /* 列出指定目录下的文件 */\n" +
                "    \"fileManagerActionName\": \"listfile\", /* 执行文件管理的action名称 */\n" +
                "    \"fileManagerListPath\": \"/ueditor/jsp/upload/file/\", /* 指定要列出文件的目录 */\n" +
                "    \"fileManagerUrlPrefix\": \"\", /* 文件访问路径前缀 */\n" +
                "    \"fileManagerListSize\": 20, /* 每次列出文件数量 */\n" +
                "    \"fileManagerAllowFiles\": [\n" +
                "        \".png\", \".jpg\", \".jpeg\", \".gif\", \".bmp\",\n" +
                "        \".flv\", \".swf\", \".mkv\", \".avi\", \".rm\", \".rmvb\", \".mpeg\", \".mpg\",\n" +
                "        \".ogg\", \".ogv\", \".mov\", \".wmv\", \".mp4\", \".webm\", \".mp3\", \".wav\", \".mid\",\n" +
                "        \".rar\", \".zip\", \".tar\", \".gz\", \".7z\", \".bz2\", \".cab\", \".iso\",\n" +
                "        \".doc\", \".docx\", \".xls\", \".xlsx\", \".ppt\", \".pptx\", \".pdf\", \".txt\", \".md\", \".xml\"\n" +
                "    ] /* 列出的文件类型 */\n" +
                "\n" +
                "}";

        return config;
    }

    private SysAttachmentEntity2 getSysAttachmentEntity(MultipartFile multipartFile, String tableId, String
            tableName, String typeCode, String contentType, String originalFilename, String fileName, String
                                                                relativePath, String internalName, Integer sizeTypeIndex) {
        SysAttachmentEntity2 sysAttachmentEntity = new SysAttachmentEntity2();
        sysAttachmentEntity.setRefTableId(Long.valueOf(tableId));
        sysAttachmentEntity.setRefTableName(tableName);
        sysAttachmentEntity.setDisplayName(originalFilename);
        sysAttachmentEntity.setName(fileName);
        sysAttachmentEntity.setExtension(fileName.substring(fileName.lastIndexOf(".") + 1));
        sysAttachmentEntity.setRelativePath(relativePath);
        sysAttachmentEntity.setInternalName(internalName);
        sysAttachmentEntity.setContentType(contentType);
        sysAttachmentEntity.setLength((int) multipartFile.getSize());
        sysAttachmentEntity.setTypeCode(typeCode);
        sysAttachmentEntity.setPersistentType(0);
        sysAttachmentEntity.setUpdateDate(new Date());
        sysAttachmentEntity.setSequence(0);
        sysAttachmentEntity.setIsDelete(0);
        sysAttachmentEntity.setCreateDate(new Date());
        sysAttachmentEntity.setSizeType(sizeTypeIndex);
        return sysAttachmentEntity;
    }

    /**
     * 检查参数是否为空
     *
     * @param param
     * @param message
     */
    private void checkIsNullParam(String param, String message) {
        if (StringUtils.isBlank(param)) {
            throw new RenException(message);
        }
    }


    public String getDatePath() {
        Date nowDate = new Date();
        String year = DateUtils.format(nowDate, "yyyy");
        String month = DateUtils.format(nowDate, "MM");
        String day = DateUtils.format(nowDate, "dd");
        return year + File.separator + month + File.separator + day;
    }

    /**
     * 删除文件
     *
     * @param fileIds
     */
    @DeleteMapping
    public Result delFile(@RequestBody Long[] fileIds) {

        if (fileIds != null && fileIds.length > 0) {
            for (Long id : fileIds) {
                SysAttachmentEntity2 sysAttachmentEntity = attachment2Dao.selectById(id);
                if (sysAttachmentEntity.getSizeType() != null) {
                    List<SysAttachmentEntity2> sysAttachmentEntities = attachment2Dao.selectList(new QueryWrapper<SysAttachmentEntity2>().eq("name", sysAttachmentEntity.getName()).eq("ref_table_id", sysAttachmentEntity.getRefTableId()).eq("type_code", sysAttachmentEntity.getTypeCode()));
                    for (SysAttachmentEntity2 attachmentEntity : sysAttachmentEntities) {
                        attachment2Dao.deleteById(attachmentEntity.getId());
                    }
                } else {
                    attachment2Dao.deleteById(id);
                }
            }
        }

        return new Result();
    }

    /**
     * 显示详情
     *
     * @param tableId
     * @param typeCode
     * @param sizeType 图片 0 、1、2、3   0最大  3最小
     * @return
     */
    @GetMapping("/detail")
    public Result detail(String tableId, String typeCode, String sizeType) {
        LambdaQueryWrapper<SysAttachmentEntity2> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysAttachmentEntity2::getRefTableId, tableId)
                .eq(SysAttachmentEntity2::getTypeCode, typeCode)
                .eq(StringUtils.isNotEmpty(sizeType), SysAttachmentEntity2::getSizeType, sizeType);//查询原图
        //  .eq(StringUtils.isNotEmpty(sizeType),SysAttachmentEntity::getSizeType,StringUtils.defaultString(sizeType,"0"));//查询原图

        List<SysAttachmentEntity2> list = attachment2Dao.selectList(wrapper);
        //图片默认原图

        return new Result().ok(list);
    }

    /**
     * 显示详情byId
     *
     * @return
     */
    @GetMapping("/detail/{id}")
    public Result detailByIds(@PathVariable("id") Long id) {
        SysAttachmentEntity2 sysAttachmentEntity2 = attachment2Dao.selectById(id);
        return new Result().ok(sysAttachmentEntity2);
    }

    public static void main(String[] args) {
        String path = "C:\\Users\\44736\\Pictures\\必应图片\\LuciolaCruciata_ZH-CN9063767400_1920x1080.jpg";

        System.out.println("文件名:" + path.substring(path.lastIndexOf(File.separator)));
        System.out.println("文件名:" + File.separator);
    }
}
