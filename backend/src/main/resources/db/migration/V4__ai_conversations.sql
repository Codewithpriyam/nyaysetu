-- NyayaSetu Database Migration V4: AI Legal Conversations Table

CREATE TABLE IF NOT EXISTS ai_conversations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    case_id BIGINT,
    module_type VARCHAR(50) NOT NULL DEFAULT 'ASSISTANT',
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_aiconv_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_aiconv_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL,
    INDEX idx_aiconv_user (user_id),
    INDEX idx_aiconv_case (case_id)
);
