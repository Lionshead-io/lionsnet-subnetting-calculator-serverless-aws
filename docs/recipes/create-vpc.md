---
id: lionsnet:recipes:create-vpc
title: Creating a VPC
---

# Creating a VPC 

POST: <API_GATEWAY_URL>/vpc

```json
{
  "vpcId": "uniqueVpcId",
  "totalHosts": 256,
  "subnetCount": 4,
  "hostsPerSubnet": 64
}
```


|   Properties   |                                                                                                         Description                                                                                                        | Required | Type   |
|:--------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|--------|
|      vpcId     |                                                 A unique identifier of type 'string'. "vpcId" is the partition key of the DynamoDB Table in which Lionsnet stores all data.                                                |    yes   | string |
| totalHosts     | The number of IP Addresses to be allocated to the VPC being generated.Cannot be greater than 65536 (/16).  This value defaults to 256.                                                                                     | no       | int    |
| subnetCount    | Number of subnets that are to be generated within the VPC being created. This value defaults to 4.                                                                                                                         | no       | int    |
| hostsPerSubnet | The number of IP Addresses to be allocated to each subnet being provisioned within the new VPC. This number defaults to 64. NOTE: (subnetCount * hostsPerSubnet) can NOT be greater than the value provided for totalHosts | no       | int    |
