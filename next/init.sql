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
    "creationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP NOT NULL,
    "availability" JSONB,
    "workweek" JSONB
);

-- Insert sample data
INSERT INTO "Users" ("email", "password", "name") VALUES 
('admin@example.com', 'admin123', 'Admin User');

INSERT INTO "Intervenants" ("email", "firstname", "lastname", "key", "endDate", "availability", "workweek") VALUES 
('intervenant@example.com', 'John', 'Doe', 'key123', '2024-12-31 23:59:59',
'{"monday": true, "tuesday": true}',
'{"hours": ["9-17", "10-18"]}');