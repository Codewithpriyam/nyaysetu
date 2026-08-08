-- NyayaSetu Database Architecture V1 Migration
-- Created for MySQL & Spring Boot JPA

CREATE TABLE IF NOT EXISTS advocates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    bar_enrollment VARCHAR(100),
    phone VARCHAR(255),
    court VARCHAR(255),
    district VARCHAR(255),
    state VARCHAR(255),
    address VARCHAR(500),
    specialization VARCHAR(255),
    experience INT,
    rating DOUBLE,
    reviews_count INT,
    source VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at DATETIME,
    updated_at DATETIME,
    INDEX idx_clerk_user_id (clerk_user_id)
);

CREATE TABLE IF NOT EXISTS lawyer_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    court VARCHAR(255),
    experience_years INT DEFAULT 0,
    consultation_count INT DEFAULT 0,
    price_per_minute DOUBLE DEFAULT 25.0,
    profile_image VARCHAR(500),
    bar_council_number VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    is_accepting_clients BOOLEAN DEFAULT TRUE,
    average_rating DOUBLE DEFAULT 4.9,
    total_reviews INT DEFAULT 15,
    office_address VARCHAR(500),
    bio VARCHAR(2000),
    languages VARCHAR(255),
    verification_status VARCHAR(50) DEFAULT 'VERIFIED',
    created_at DATETIME,
    CONSTRAINT fk_lawyer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS consultations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lawyer_id BIGINT NOT NULL,
    problem VARCHAR(2000),
    category VARCHAR(255),
    requested_date DATE,
    scheduled_at DATETIME,
    duration_minutes INT DEFAULT 20,
    rate_per_minute DOUBLE DEFAULT 25.0,
    total_amount DOUBLE DEFAULT 500.0,
    price DOUBLE DEFAULT 500.0,
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    meet_link VARCHAR(500),
    utr_number VARCHAR(50),
    created_at DATETIME,
    CONSTRAINT fk_consultation_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_consultation_lawyer FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(id),
    INDEX idx_consultation_user (user_id),
    INDEX idx_consultation_lawyer (lawyer_id)
);

CREATE TABLE IF NOT EXISTS consultation_meetings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    consultation_id BIGINT NOT NULL,
    meeting_provider VARCHAR(50) NOT NULL DEFAULT 'GOOGLE_MEET',
    meeting_link VARCHAR(500) NOT NULL,
    created_by VARCHAR(255),
    created_at DATETIME,
    CONSTRAINT fk_meeting_consultation FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consultation_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    consultation_id BIGINT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255),
    changed_at DATETIME,
    CONSTRAINT fk_history_consultation FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    who VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(255),
    entity_id BIGINT,
    timestamp DATETIME NOT NULL,
    ip_address VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receiver_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body VARCHAR(1000) NOT NULL,
    type VARCHAR(50) DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    CONSTRAINT fk_notification_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uploaded_by BIGINT NOT NULL,
    consultation_id BIGINT,
    case_id VARCHAR(100),
    storage_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    size BIGINT,
    uploaded_at DATETIME,
    CONSTRAINT fk_document_user FOREIGN KEY (uploaded_by) REFERENCES users(id),
    CONSTRAINT fk_document_consultation FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL
);
