-- NyayaSetu Database Migration V2: Payments Table & Lawyer UPI QR Additions

ALTER TABLE lawyer_profiles
ADD COLUMN upi_id VARCHAR(255) DEFAULT 'nyaysetu@upi',
ADD COLUMN qr_image VARCHAR(500) DEFAULT '/img/qrcodes/priya_sharma_qr.png';

-- Update pre-seeded profiles with their specific UPI ID and QR Image URL
UPDATE lawyer_profiles
SET upi_id = 'prince@ybl', qr_image = '/img/qrcodes/prince_kumar_qr.png'
WHERE slug = 'prince-kumar';

UPDATE lawyer_profiles
SET upi_id = 'shruti@ibl', qr_image = '/img/qrcodes/shruti_kirty_qr.png'
WHERE slug = 'shruti';

-- Create dedicated payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    consultation_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    utr_number VARCHAR(100) NOT NULL,
    payment_screenshot VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    verified_by VARCHAR(255),
    verified_at DATETIME,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_payment_consultation FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    INDEX idx_payment_consultation (consultation_id),
    INDEX idx_payment_utr (utr_number)
);
