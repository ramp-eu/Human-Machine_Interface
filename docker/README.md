#Docker

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
