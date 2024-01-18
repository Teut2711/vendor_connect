#!/bin/bash

# Change to the application directory
cd /vendor_connect

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Start the Django development server
exec python manage.py runserver 0.0.0.0:8000
