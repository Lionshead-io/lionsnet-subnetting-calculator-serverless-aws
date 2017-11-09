---
id: lionsnet:recipes:create-vpc
title: Creating a VPC
---

# Creating a VPC 

POST: https://<API_GATEWAY_URL>/vpc

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
| totalHosts     | The number of IP Addresses to be allocated to the VPC being generated.Cannot be greater than 65536 (/16).  This value defaults to 256. Take a look at the 'totalHosts' section below.                                                                                         | no       | int    |
| subnetCount    | Number of subnets that are to be generated within the VPC being created. This value defaults to 4.                                                                                                                             | no       | int    |
| hostsPerSubnet | The number of IP Addresses to be allocated to each subnet being provisioned within the new VPC.   This number defaults to 64.   NOTE: (subnetCount * hostsPerSubnet) can NOT be greater than the value provided for totalHosts | no       | int    |


#### 'totalHosts':
> Min value: 256

> Max value: 65536

Valid values for the total number of hosts per VPC are as follows:
```js
256
512
1024
2048
4096
8192
16384
32768
65536
```
Note that the valid 'totalHosts' values provided above all correspond to a CIDR prefix. This CIDR prefixes have been included below for reference. 

```js
'CIDR Prefix': '# of hosts'
 

'/24': 256
'/23': 512
'/22': 1024
'/21': 2048
'/20': 4096
'/19': 8192
'/18': 16384
'/17': 32768
'/16': 65536
```

NOTE: If you were to provide a value 'totalHosts' value of 300, which is not a valid value for this field since it does not have a corresponding CIDR prefix, Lionsnet will automatically round down that value to 256. If a value less than 256 is provided, Lionsnet will automatically assign the value of 256, since a VPC being provisioned using lionsnet must have at least 256 host addresses assigned to it.

#### More Documentation:

* [Getting Started](../getting-started.md)
* [Creating a VPC](create-vpc.md)
* [Deleting a VPC](delete-vpc.md)
* [Creating Subnets within a VPC](create-subnet.md)
* [Deleting Subnets within a VPC](delete-subnet.md)
