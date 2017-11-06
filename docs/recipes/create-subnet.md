---
id: lionsnet:recipes:create-subnet
title: Creating a Subnet
---

# Creating a Subnet 

POST: https://<API_GATEWAY_URL>/vpc/{vpcId}/subnet

```json
{
  "subnetCount": 4,
  "hostsPerSubnet": 64
}
```


|   Properties   |                                                                                                           Description                                                                                                          | Required | Type   |
|:--------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|--------|
|      vpcId (url param)     |                                                   A unique identifier of type 'string'. "vpcId" is the partition key of the DynamoDB Table in which Lionsnet stores all data.                                                  |    yes   | string |
| subnetCount    | Number of subnets that are to be generated within the VPC being created. This value defaults to 4.                                                                                                                             | no       | int    |
| hostsPerSubnet | The number of IP Addresses to be allocated to each subnet being provisioned within the new VPC.   This number defaults to 64.   NOTE: (subnetCount * hostsPerSubnet) can NOT be greater than the value provided for totalHosts | no       | int    |
