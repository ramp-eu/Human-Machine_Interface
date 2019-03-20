# Introduction

HMI (Human Machine Interface) is a software layer module of the OPIL architecture. This module’s name was changed to MOD.SW.HMI from AHMI when the requirements changed for the OPIL version 2.0. 
HMI is a web application server with its own local database for storing data needed in this module. HMI serves a web browser user interface for the human agents to monitor and control OPIL data entities. 

# Usage of the docker image with docker-compose 

**1.  Start middleware**

    - Run Orion Context Broker  using the -corsOrigin switch
    - ngsiproxy must be started as well, preferably with middleware

Middleware docker-compose.yml:
```
version: "3"
services:
 mongo:
   image: mongo:3.4
   command: --nojournal
 ngsiproxy:
   image: fiware/ngsiproxy
   ports:
     - "3000:3000"
 orion:
   image: fiware/orion
   links:
     - mongo
   ports:
     - "1026:1026"
   command: -dbhost mongo -corsOrigin __ALL
```

**2. Start HMI web application**

    - HMI web app uses its own instance of Mongo DB
        - db data is backed up in folder ./mongo/data
        - application backs up folder ./public/uploads
    - App is started with initial user configured in environment variables
        - although id or password changed here, user's name and role is always 'admin'
        - password could be changed from UI as well


HMI docker-compose.yml:
```
version: "3"
services:
#HMI web app
 mongodb:
    image: mongo:3.6
    restart: always
    volumes:
      - ./mongo/data:/data/db
 app:
    image: l4ms/opil.sw.hmi:latest
    environment:
     - inituser=admin
     - initpw=admin
    restart: always
    volumes:
      - ./public/uploads:/usr/src/app/public/uploads
    ports:
      - "8081:8081"
    links:
      - mongodb
```

**3. Open http://hostnameorIP:8081 with your web browser**