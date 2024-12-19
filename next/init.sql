\c nom_de_la_base;
-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255)
);

-- Create Intervenants table
CREATE TABLE IF NOT EXISTS "Intervenants" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "creationDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    "availability" JSONB,
    "workweek" JSONB
);

-- Insert sample data
INSERT INTO "Users" ("email", "password", "name") VALUES 
('admin@example.com', 'admin123', 'Admin User');
