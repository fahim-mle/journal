#!/bin/bash

echo "🚀 Starting MERN Stack Application..."
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start all services
echo "📦 Building and starting services..."
docker compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo "🔍 Checking service status..."
docker compose ps

echo ""
echo "✅ Application started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "🗄️  MongoDB: mongodb://localhost:27017"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker compose logs -f"
echo "  - Stop app:  docker compose down"
echo "  - Restart:   docker compose restart"
echo "=================================="