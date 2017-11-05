---
id: lionsnet:getting-started
title: Getting Started ∙ Lionsnet - A Serverless VPC + Subnetting calculator powered by AWS Lambda & DynamoDB.
---

# Getting Started

1. Create CloudFormation Stack using the provided template (cloudformation-template.yaml)
2. Make a HTTP POST request to /configuration before you start creating VPCs
3. Create as many VPCs & Subnets as you want

#### Configuring Lionsnet:

POST: <API_GATEWAY_URL>/configuration

```json
{
  "DefaultWorkspace": "100.64.0.0/10"
}
```


|    Properties    |                                                        Description                                                        | Required |
|:----------------:|:-------------------------------------------------------------------------------------------------------------------------:|:--------:|
| DefaultWorkspace | An IPV4 global address the with a valid CIDR prefix which will be used to sequentially generate VPCs. Ex. "100.64.0.0/10" |    yes   |
    

```sh
$ git clone -o babel-starter-kit \
      -b master --single-branch \
      https://github.com/kriasoft/babel-starter-kit.git \
      <your-project-name>
$ cd <your-project-name>
$ npm install
```
