# Use an official PostgreSQL image as the base image
FROM postgres:16.1-bullseye

# Automate interactive shell
ENV DEBIAN_FRONTEND=noninteractive


# Update index/packages
RUN apt update
RUN apt upgrade -y

# Install postgres common package which lists extensions
RUN apt install -y gnupg postgresql-common apt-transport-https lsb-release wget 
RUN echo | /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh

# Update index
RUN apt update

# Install timescaledb
# RUN apt -y install timescaledb-2-postgresql-16

# Install pg cron
RUN apt -y install postgresql-16-cron

# Install postgis
RUN apt update
RUN apt -y install postgresql-16-postgis-3

# Install locales
RUN apt update && apt-get install -y locales
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen
RUN locale-gen en_US.UTF-8

# Install other requirements
RUN apt -y install postgresql-client
RUN  apt -y install systemd
RUN apt -y install vim nano

COPY docker-entrypoint-initdb.d/* /docker-entrypoint-initdb.d/

EXPOSE 5432

