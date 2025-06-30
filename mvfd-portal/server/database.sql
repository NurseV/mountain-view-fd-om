-- server/database.sql

-- Drop tables in reverse order of creation to respect foreign key constraints
DROP TABLE IF EXISTS applicants;
DROP TABLE IF EXISTS emergency_contacts;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS personnel;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;


-- Create the Roles table
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
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role_id INT NOT NULL REFERENCES roles(role_id),
    department_id INT NOT NULL REFERENCES departments(department_id)
);

-- Create the main Personnel table
CREATE TABLE personnel (
    personnel_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE SET NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    employee_id SERIAL UNIQUE,
    badge_number VARCHAR(50) UNIQUE,
    rank VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active',
    hire_date DATE,
    probation_end_date DATE,
    phone_number VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the Certifications table
CREATE TABLE certifications (
    certification_id SERIAL PRIMARY KEY,
    personnel_id INT NOT NULL REFERENCES personnel(personnel_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    issuing_agency VARCHAR(100),
    certification_number VARCHAR(100),
    issue_date DATE,
    expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the Emergency Contacts table
CREATE TABLE emergency_contacts (
    contact_id SERIAL PRIMARY KEY,
    personnel_id INT NOT NULL REFERENCES personnel(personnel_id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50),
    primary_phone VARCHAR(20),
    secondary_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the Applicants table
CREATE TABLE applicants (
    applicant_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    application_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Pending Review',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Seed the initial data required for the system to run
INSERT INTO roles (role_name) VALUES ('Administrator'), ('Chief'), ('Training Officer'), ('Resource Officer'), ('Firefighter');
INSERT INTO departments (department_name) VALUES ('Mountain View Fire Department');

-- Initial admin user with the correct password hash
INSERT INTO users (username, password_hash, first_name, last_name, role_id, department_id) VALUES
    (
        'admin',
        -- This is a new hash for the password "password"
        '$2b$10$3l3AsgnjB1e6uJd8e/aLd.NVb54sCVgPyfGctnbl2I89VbB9Im9rK',
        'Admin',
        'User',
        (SELECT role_id FROM roles WHERE role_name = 'Administrator'),
        (SELECT department_id FROM departments WHERE department_name = 'Mountain View Fire Department')
    );

-- Add a dummy personnel record for our admin user
INSERT INTO personnel (user_id, first_name, last_name, rank, status, hire_date)
SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    'Administrator',
    'Active',
    CURRENT_DATE
FROM users u
WHERE u.username = 'admin'
ON CONFLICT (user_id) DO NOTHING;