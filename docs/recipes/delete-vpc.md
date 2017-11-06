---
id: lionsnet:recipes:delete-vpc
title: Deleting a VPC
---

# Deleting a VPC 

DELETE: https://<API_GATEWAY_URL>/vpc/{vpcId}

|   Properties   |                                                                                                           Description                                                                                                          | Required | Type   |
|:--------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|--------|
|      vpcId     |                                                   A unique identifier of type 'string'. "vpcId" is the partition key of the DynamoDB Table in which Lionsnet stores all data.                                                  |    yes   | string |

#### More Documentation:

* [Getting Started](../getting-started.md)
* [Creating a VPC](create-vpc.md)
* [Deleting a VPC](delete-vpc.md)
* [Creating Subnets within a VPC](create-subnet.md)
* [Deleting Subnets within a VPC](delete-subnet.md)
