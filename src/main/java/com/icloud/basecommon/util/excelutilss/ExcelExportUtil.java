package com.icloud.basecommon.util.excelutilss;

import com.icloud.common.DateUtil;
import com.icloud.modules.retail.entity.TRetailConfirn;
import org.apache.poi.hssf.usermodel.*;

import java.util.List;

public class ExcelExportUtil {




    public static  HSSFWorkbook MakeExcel(List<TRetailConfirn> orderList) {

        // SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        /*response.reset();
        response.setHeader("Content-Disposition", "attachment;fileName="+ fileName);// 指定下载的文件名
        OutputStream output = response.getOutputStream();
        BufferedOutputStream bufferedOutPut = new BufferedOutputStream(output);  */
        //        String path = this.getClass().getClassLoader().getResource("WEB-INF/tqjsxx").getPath();
        // 定义单元格报头
        String worksheetTitle = "用户信息表";

        HSSFWorkbook wb = new HSSFWorkbook();

        // 创建单元格样式
        HSSFCellStyle cellStyleTitle = wb.createCellStyle();
        // 指定单元格居中对齐
        cellStyleTitle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        // 指定单元格垂直居中对齐
        cellStyleTitle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        // 指定当单元格内容显示不下时不换行
        cellStyleTitle.setWrapText(false);
        // ------------------------------------------------------------------
        HSSFCellStyle cellStyle = wb.createCellStyle();
        // 指定单元格居中对齐
        cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        // 指定单元格垂直居中对齐
        cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        // 指定当单元格内容显示不下时换行
        cellStyle.setWrapText(true);

        // ------------------------------------------------------------------
        // 设置单元格字体
        HSSFFont font = wb.createFont();
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        font.setFontName("宋体");
        font.setFontHeight((short) 200);
//        font.setFontHeight();
        cellStyleTitle.setFont(font);

        // 工作表名
        String userName = "用户账号";
        String liences = "用户密码";
        String openid = "openid";//
        String status = "认证状态";
        String modifyTime = "认证时间";

        HSSFSheet sheet = wb.createSheet();
        ExportExcel exportExcel = new ExportExcel(wb, sheet);
        // 创建报表头部 11列？
        exportExcel.createNormalHead(worksheetTitle, 5);
        // 定义第一行
        HSSFRow row1 = sheet.createRow(1);
        HSSFCell cell1 = row1.createCell(0);

        //第一行第1列
        cell1.setCellStyle(cellStyleTitle);
        cell1.setCellValue(new HSSFRichTextString(userName));
        sheet.setColumnWidth(0, 35 * 256);
        //第一行第2列
        cell1 = row1.createCell(1);
        cell1.setCellStyle(cellStyleTitle);
        cell1.setCellValue(new HSSFRichTextString(liences));
        sheet.setColumnWidth(1, 20 * 256);
        //第一行第3列
        cell1 = row1.createCell(2);
        cell1.setCellStyle(cellStyleTitle);
        cell1.setCellValue(new HSSFRichTextString(openid));
        sheet.setColumnWidth(2, 35 * 256);

        //第一行第4列
        cell1 = row1.createCell(3);
        cell1.setCellStyle(cellStyleTitle);
        cell1.setCellValue(new HSSFRichTextString(status));
        //第一行第5列
        cell1 = row1.createCell(4);
        cell1.setCellStyle(cellStyleTitle);
        cell1.setCellValue(new HSSFRichTextString(modifyTime));
        sheet.setColumnWidth(4, 35 * 256);


        //定义第二行开始后的实体内容
        HSSFRow row = sheet.createRow(2);
        HSSFCell cell = row.createCell(1);
        for (int i = 0; i < orderList.size(); i++) {
            TRetailConfirn order = orderList.get(i);

            row = sheet.createRow(i + 2);

            cell = row.createCell(0);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(new HSSFRichTextString(order.getUserName()));

            cell = row.createCell(1);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(new HSSFRichTextString(order.getLiences()));

            cell = row.createCell(2);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(new HSSFRichTextString(order.getOpenid()+""));

            cell = row.createCell(3);
            cell.setCellStyle(cellStyle);
            if("1".equals(order.getStatus())){
                cell.setCellValue(new HSSFRichTextString("已认证"));
            }else{
                cell.setCellValue(new HSSFRichTextString("未认证"));
            }
            cell = row.createCell(4);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(new HSSFRichTextString(DateUtil.formatTimestamp(order.getModifyTime())));


        }
        return wb;
    }

}
