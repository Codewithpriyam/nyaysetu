-- NyayaSetu Database Migration V5: YouPI PG V2 Gateway & Central Admin Escrow Fields
-- Adds YouPI session ID, order ID, gateway status, signature, customer contact, and Method B Central Admin Escrow columns

ALTER TABLE payments
ADD COLUMN gateway_session_id VARCHAR(100),
ADD COLUMN gateway_order_id VARCHAR(100),
ADD COLUMN gateway_status VARCHAR(50) DEFAULT 'INITIATED',
ADD COLUMN gateway_signature VARCHAR(255),
ADD COLUMN customer_phone VARCHAR(20),
ADD COLUMN customer_email VARCHAR(100),
ADD COLUMN receiving_vpa VARCHAR(255) DEFAULT '8873932040@ptsbi',
ADD COLUMN platform_fee DOUBLE DEFAULT 0.0,
ADD COLUMN advocate_payout DOUBLE DEFAULT 0.0,
ADD COLUMN payout_status VARCHAR(50) DEFAULT 'PENDING_SETTLEMENT';

CREATE INDEX idx_payment_gateway_session ON payments (gateway_session_id);
CREATE INDEX idx_payment_gateway_order ON payments (gateway_order_id);
