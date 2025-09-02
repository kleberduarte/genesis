package com.genesis.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // aplica para todas as rotas
                    .allowedOrigins("*") // libera qualquer origem
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // libera métodos
                    .allowedHeaders("*"); // permite todos os headers
            }
        };
    }
}