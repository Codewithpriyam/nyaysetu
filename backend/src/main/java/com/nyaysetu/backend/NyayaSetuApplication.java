package com.nyaysetu.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NyayaSetuApplication {

    private static final Logger log = LoggerFactory.getLogger(NyayaSetuApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(NyayaSetuApplication.class, args);
        log.info("NyayaSetu Spring Boot Backend API Running on Port 8080.");
    }
}
