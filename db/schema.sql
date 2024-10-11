-- Connect to the database
\c winter_wolf_estimate;

-- Drop tables if they exist
DROP TABLE IF EXISTS EstimateEquipment CASCADE;
DROP TABLE IF EXISTS EstimateAccessories CASCADE;
DROP TABLE IF EXISTS FinalEstimates CASCADE;
DROP TABLE IF EXISTS Estimates CASCADE;
DROP TABLE IF EXISTS Accessories CASCADE;
DROP TABLE IF EXISTS Equipment CASCADE;
DROP TABLE IF EXISTS Users CASCADE;



-- Drop indexes if they exist
DROP INDEX IF EXISTS idx_estimate_client_name;
DROP INDEX IF EXISTS idx_equipment_name;
DROP INDEX IF EXISTS idx_accessory_name;

-- Table: Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Store hashed passwords here
    role VARCHAR(50) DEFAULT 'admin',  -- 'admin', 'client', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Equipment (HVAC systems and units)
CREATE TABLE Equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model_number VARCHAR(100),
    brand VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- Table: Accessories (HVAC materials)
CREATE TABLE Accessories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- Table: Estimates
CREATE TABLE Estimates (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_address VARCHAR(255),
    client_phone VARCHAR(20),
    labor_hours DECIMAL(10, 2) NOT NULL DEFAULT 0,
    labor_rate DECIMAL(10, 2) NOT NULL DEFAULT 68,
    equipment_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    accessories_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(4, 3) NOT NULL DEFAULT 0.08875,
    market_cap DECIMAL(10, 2),  -- Placeholder, will be set by frontend
    details JSONB,  -- Store the detailed breakdown as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES Users(id) ON DELETE SET NULL  -- Link to the Users table
);

-- Table: EstimateEquipment
CREATE TABLE EstimateEquipment (
    id SERIAL PRIMARY KEY,
    estimate_id INTEGER REFERENCES Estimates(id) ON DELETE CASCADE,
    equipment_id INTEGER REFERENCES Equipment(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE (estimate_id, equipment_id)
);

-- Table: EstimateAccessories
CREATE TABLE EstimateAccessories (
    id SERIAL PRIMARY KEY,
    estimate_id INTEGER REFERENCES Estimates(id) ON DELETE CASCADE,
    accessory_id INTEGER REFERENCES Accessories(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE (estimate_id, accessory_id)
);

-- Table: FinalEstimates
CREATE TABLE FinalEstimates (
    id SERIAL PRIMARY KEY,
    estimate_id INTEGER REFERENCES Estimates(id) ON DELETE CASCADE,
    labor_cost DECIMAL(10, 2) NOT NULL,
    equipment_cost DECIMAL(10, 2) NOT NULL,
    accessories_cost DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a unique constraint to FinalEstimates
ALTER TABLE FinalEstimates
ADD CONSTRAINT unique_estimate_id UNIQUE (estimate_id);

-- Create indexes for faster searches
CREATE INDEX idx_estimate_client_name ON Estimates (client_name);
CREATE INDEX idx_equipment_name ON Equipment (name);
CREATE INDEX idx_accessory_name ON Accessories (name);