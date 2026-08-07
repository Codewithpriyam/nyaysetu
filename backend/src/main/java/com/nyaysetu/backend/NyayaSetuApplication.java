package com.nyaysetu.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NyayaSetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(NyayaSetuApplication.class, args);
        System.out.println("==========================================================");
        System.out.println(" NyayaSetu Spring Boot Backend API Running on Port 8080!");
        System.out.println(" H2 Console: http://localhost:8080/h2-console");
        System.out.println("==========================================================");
    }
}
