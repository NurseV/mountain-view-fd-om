-- server/database.sql

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;

-- Create the Roles table based on the PRD
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Create the Departments table
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

-- Create the Users table
-- This table links to roles and departments
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) UNIQUE, -- From Personnel Module [cite: 36]
    badge_number VARCHAR(50), -- From Personnel Module [cite: 36]
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role_id INT NOT NULL REFERENCES roles(role_id),
    department_id INT NOT NULL REFERENCES departments(department_id)
);

-- Seed the initial data required for the system to run

-- Pre-defined roles from PRD [cite: 6]
INSERT INTO roles (role_name) VALUES
    ('Administrator'), -- [cite: 11]
    ('Chief'), -- [cite: 9]
    ('Training Officer'), -- [cite: 7]
    ('Resource Officer'), -- [cite: 8]
    ('Firefighter'); -- [cite: 6]

-- Initial department
INSERT INTO departments (department_name) VALUES
    ('Mountain View Fire Department');

-- Initial admin user with a pre-hashed password for '1234'
-- The hash is generated using bcrypt
INSERT INTO users (username, password_hash, first_name, last_name, role_id, department_id) VALUES
    (
        'admin',
        '$2b$10$fPLMdbDBLpCg2i2pTgafNuFq/o2pCIp2o3qS9Z39d7eyK5hTupY.O',
        'Admin',
        'User',
        (SELECT role_id FROM roles WHERE role_name = 'Administrator'),
        (SELECT department_id FROM departments WHERE department_name = 'Mountain View Fire Department')
    );