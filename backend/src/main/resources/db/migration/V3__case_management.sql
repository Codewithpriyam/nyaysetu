-- NyayaSetu Database Migration V3: Case Management System

CREATE TABLE IF NOT EXISTS cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lawyer_id BIGINT,
    case_number VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    court_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    filing_date DATE,
    next_hearing_date DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_case_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_case_lawyer FOREIGN KEY (lawyer_id) REFERENCES lawyer_profiles(id) ON DELETE SET NULL,
    INDEX idx_case_user (user_id),
    INDEX idx_case_lawyer (lawyer_id),
    INDEX idx_case_number (case_number)
);

CREATE TABLE IF NOT EXISTS case_hearings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    hearing_date DATE NOT NULL,
    hearing_time VARCHAR(50),
    court_name VARCHAR(255),
    remarks TEXT,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    CONSTRAINT fk_hearing_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    INDEX idx_hearing_case (case_id)
);

CREATE TABLE IF NOT EXISTS case_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    uploaded_by BIGINT NOT NULL,
    document_type VARCHAR(100),
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    uploaded_at DATETIME NOT NULL,
    CONSTRAINT fk_casedoc_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    CONSTRAINT fk_casedoc_user FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_casedoc_case (case_id)
);
