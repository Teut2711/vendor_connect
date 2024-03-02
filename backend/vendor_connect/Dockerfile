FROM python:3.11

# Set the working directory in the container
WORKDIR /vendor_connect

# Copy the requirements file into the container at /vendor_connect
COPY . .
# Install GDAL dependencies
RUN apt-get update && apt-get install -y libgdal-dev


# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt


EXPOSE 8000

ENTRYPOINT ["/bin/bash", "/vendor_connect/init.sh"]