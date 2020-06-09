package com.icloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.PropertySource;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@SpringBootApplication
//@EnableAutoConfiguration
//@ComponentScan   //这两个注解可以使用SpringBootApplication替代
//@MapperScan("com.icloud.modules.*.dao")/** 扫描mybatis mapper接口 */
@PropertySource({"classpath:config.properties","classpath:jdbc.properties"})
@EnableTransactionManagement/**启用注解事务管理**/
//@ServletComponentScan(value = "com.alibaba.druid.support.http.StatViewServlet")//servlet的扫描
public class Application extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {

        return application.sources(Application.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }


//    @Bean
//    public InternalResourceViewResolver htmlViewResolver() {
//        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
//        viewResolver.setPrefix("");
//        viewResolver.setViewClass(HandleResourceViewExists.class); //设置检查器
//        viewResolver.setSuffix(".html");
//        viewResolver.setOrder(0);
//        viewResolver.setContentType("text/html;charset=UTF-8");
//        return viewResolver;
//    }
}