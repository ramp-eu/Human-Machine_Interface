#!/bin/bash

# This script removes unnecessary subscriptions
#
# Run this command before shutting down HMI:
# $ sudo docker exec hminode /usr/src/app/remove_subscriptions.sh
#
# Replace hminode with containerid of HMI if needed

ocburl="http://$ocb_host:$ocb_port/v2/subscriptions/"
array=$(curl -s http://127.0.0.1:8081/api/2230670a-483f-11ea-9cf7-0242ac190004/subscription | grep -Po '"subs_id":"\K[^"]*')

for j in ${array[@]}
do
  url="${ocburl}${j}"
  curl -iX DELETE  --url "$url"
done

curl -iX DELETE  --url 'http://127.0.0.1:8081/api/2230670a-483f-11ea-9cf7-0242ac190004/subscription'
