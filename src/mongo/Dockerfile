FROM mongo:3.6

COPY init.json /init.json
CMD mongoimport --host mongodb --db hminodeapp --collection users --mode upsert --upsertFields userid --type json --file /init.json
