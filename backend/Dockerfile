# ── Stage 1: Build & Package Spring Boot Application ───────────────
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy Maven POM to leverage Docker layer caching
COPY pom.xml .

# Download dependencies offline for faster incremental builds
RUN mvn dependency:go-offline -B

# Copy application source code
COPY src ./src

# Build production executable JAR skipping tests
RUN mvn clean package -DskipTests

# ── Stage 2: Production Lightweight JRE Runtime ─────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root user and group for security hardening
RUN addgroup -S spring && adduser -S spring -G spring

# Copy compiled Spring Boot executable JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set file ownership to non-root spring user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring

# Expose HTTP application port
EXPOSE 8080

# Configure JVM flags and execution command
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
