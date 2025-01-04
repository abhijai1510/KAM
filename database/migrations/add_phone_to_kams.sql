USE kam_lead_management;

ALTER TABLE kams
ADD COLUMN phone VARCHAR(20) NOT NULL DEFAULT '';

UPDATE kams SET phone = 'Not provided' WHERE phone = '';
