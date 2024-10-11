-- Connect to the database
\c winter_wolf_estimate;

-- Seed the Users table
INSERT INTO Users (name, username, email, password, role) VALUES
('John Doe', 'johndoe', 'johndoe@example.com', 'hashed_password_1', 'admin'),
('Jane Smith', 'janesmith', 'janesmith@example.com', 'hashed_password_2', 'client'),
('Alice Johnson', 'alicejohnson', 'alicejohnson@example.com', 'hashed_password_3', 'client');

-- Seed the Equipment table (HVAC Example)
INSERT INTO Equipment (name, model_number, brand, description, price) VALUES
('Central Air Conditioner', 'CAC-1000', 'Trane', 'High-efficiency central air conditioner with a SEER rating of 18.', 3000.00),
('Gas Furnace', 'GF-2000', 'Lennox', 'Gas furnace with a variable-speed blower and high efficiency.', 2500.00),
('Heat Pump', 'HP-3000', 'Carrier', 'All-in-one heat pump with cooling and heating capabilities.', 4000.00),
('Ductless Mini Split', 'DMS-1500', 'Daikin', 'Ductless mini split air conditioner and heater.', 3500.00),
('Rooftop HVAC Unit', 'RTU-5000', 'York', 'Rooftop HVAC unit for commercial applications.', 5000.00),
('Packaged HVAC System', 'PHS-4000', 'Carrier', 'All-in-one packaged HVAC system for heating and cooling.', 4500.00),
('Commercial HVAC System', 'CHV-6000', 'Trane', 'Large commercial HVAC unit for extensive building coverage.', 12000.00),
('Window Air Conditioner', 'WAC-900', 'LG', 'Window-mounted air conditioner for smaller spaces.', 500.00);

-- Seed the Accessories table (HVAC Example)
INSERT INTO Accessories (name, description, price) VALUES
('Copper Pipe (3/8 inch)', 'High-quality copper pipe for refrigerant lines.', 120.00),
('Thermostat', 'Programmable smart thermostat for temperature control.', 150.00),
('Flexible Ductwork', 'Flexible duct for airflow in HVAC systems.', 200.00),
('Air Filter', 'High-efficiency air filter for HVAC systems.', 50.00),
('Insulation Wrap', 'Wrap for HVAC duct insulation.', 100.00),
('Refrigerant R410A', 'Refrigerant for modern HVAC systems.', 250.00),
('Drain Pan', 'Condensate drain pan for HVAC systems.', 75.00),
('Electrical Wiring Kit', 'Complete electrical wiring kit for HVAC installation.', 300.00);

-- Seed the Estimates table (Ensure IDs are available for foreign keys)
INSERT INTO Estimates (client_name, client_address, client_phone, labor_hours, labor_rate, equipment_cost, accessories_cost, tax_rate, market_cap, details, created_at, user_id) VALUES
('Cool Comfort Inc.', '789 Oak St, Metropolis', '555-6789', 20, 80, 3000.00, 150.00, 0.08875, 500.00, 
'{
    "floors": [
        {
            "floor_name": "First Floor",
            "rooms": [
                {
                    "room_name": "Living Room",
                    "equipment": [
                        {"name": "Central Air Conditioner", "quantity": 1}
                    ],
                    "accessories": [
                        {"name": "Copper Pipe (3/8 inch)", "quantity": 1}
                    ]
                },
                {
                    "room_name": "Bedroom",
                    "equipment": [
                        {"name": "Gas Furnace", "quantity": 1}
                    ],
                    "accessories": [
                        {"name": "Flexible Ductwork", "quantity": 2}
                    ]
                }
            ]
        }
    ]
}', CURRENT_TIMESTAMP, 2),
('Heat Solutions LLC', '101 Pine St, Gotham', '555-4321', 15, 85, 4000.00, 200.00, 0.08875, 600.00, 
'{
    "floors": [
        {
            "floor_name": "Second Floor",
            "rooms": [
                {
                    "room_name": "Master Bedroom",
                    "equipment": [
                        {"name": "Heat Pump", "quantity": 1}
                    ],
                    "accessories": [
                        {"name": "Air Filter", "quantity": 2}
                    ]
                }
            ]
        }
    ]
}', CURRENT_TIMESTAMP, 3),
('Perfect Air Solutions', '500 Maple Ave, Star City', '555-9876', 25, 90, 5000.00, 300.00, 0.08875, 800.00, 
'{
    "floors": [
        {
            "floor_name": "First Floor",
            "rooms": [
                {
                    "room_name": "Kitchen",
                    "equipment": [
                        {"name": "Packaged HVAC System", "quantity": 1}
                    ],
                    "accessories": [
                        {"name": "Refrigerant R410A", "quantity": 1}
                    ]
                }
            ]
        }
    ]
}', CURRENT_TIMESTAMP, 2);

-- Seed the EstimateEquipment table (Ensure estimate_id matches the Estimates table)
INSERT INTO EstimateEquipment (estimate_id, equipment_id, quantity) VALUES
(1, 1, 1),  -- 1 Central Air Conditioner for Cool Comfort Inc.
(1, 2, 1),  -- 1 Gas Furnace for Cool Comfort Inc.
(2, 3, 1),  -- 1 Heat Pump for Heat Solutions LLC
(3, 6, 1);  -- 1 Packaged HVAC System for Perfect Air Solutions

-- Seed the EstimateAccessories table (Ensure estimate_id matches the Estimates table)
INSERT INTO EstimateAccessories (estimate_id, accessory_id, quantity) VALUES
(1, 1, 1),  -- 1 Copper Pipe (3/8 inch) for Cool Comfort Inc.
(1, 3, 2),  -- 2 Flexible Ductwork for Cool Comfort Inc.
(2, 4, 2),  -- 2 Air Filters for Heat Solutions LLC
(3, 6, 1);  -- 1 Refrigerant R410A for Perfect Air Solutions

-- Seed the FinalEstimates table (Ensure estimate_id matches the Estimates table)
INSERT INTO FinalEstimates (estimate_id, labor_cost, equipment_cost, accessories_cost, subtotal, tax, total_cost, created_at) VALUES
(1, 1600.00, 3000.00, 150.00, 4750.00, 422.56, 5172.56, CURRENT_TIMESTAMP),  -- Cool Comfort Inc.
(2, 1275.00, 4000.00, 200.00, 5275.00, 468.68, 5743.68, CURRENT_TIMESTAMP),   -- Heat Solutions LLC
(3, 2250.00, 5000.00, 300.00, 7550.00, 670.31, 8220.31, CURRENT_TIMESTAMP);   -- Perfect Air Solutions
