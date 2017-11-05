---
id: lionsnet:recipes:delete-vpc
title: Deleting a VPC
---

# Deleting a VPC 

DELETE: https://<API_GATEWAY_URL>/vpc/{vpcId}

```json
{
  "vpcId": "uniqueVpcId",
  "totalHosts": 256,
  "subnetCount": 4,
  "hostsPerSubnet": 64
}
```


|   Properties   |                                                                                                           Description                                                                                                          | Required | Type   |
|:--------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|--------|
|      vpcId     |                                                   A unique identifier of type 'string'. "vpcId" is the partition key of the DynamoDB Table in which Lionsnet stores all data.                                                  |    yes   | string |
