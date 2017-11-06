---
id: lionsnet:recipes:delete-subnet
title: Deleting a Subnet
---

# Deleting a Subnet 

DELETE: https://<API_GATEWAY_URL>/vpc/{vpcId}/subnet/{subnetNetworkAddress}

|   Properties   |                                                                                                           Description                                                                                                          | Required | Type   |
|:--------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|--------|
|      vpcId (url param)     |                                                   A unique identifier of type 'string'. "vpcId" is the partition key of the DynamoDB Table in which Lionsnet stores all data.                                                  |    yes   | string |
| subnetNetworkAddress (url param)    | The IPv4 Network Address of the subnet that you want to delete (ex. 100.64.1.65).                                                                                                                             | yes       | string    |
