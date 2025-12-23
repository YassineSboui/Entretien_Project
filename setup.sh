#!/bin/bash

# Franchise Management System - Setup Script

echo "Setting up Franchise Management System..."

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env"
fi

echo "Starting Docker containers..."
docker-compose up -d

echo ""
echo "✓ Setup complete!"
echo ""
echo "Application is running on:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo "  API Documentation: http://localhost:8000/docs"
echo ""
echo "To stop the services, run: docker-compose down"
