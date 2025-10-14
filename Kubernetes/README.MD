# Kubernetes

## Setup

Basics
* Cluster preset: Dev/TEst

Node pools
* node autoprovisioning: disable
* Node size: A2 v2  / scale method: Autoscale

## Deployment

https://portal.azure.com/#@woutervanranstgmail.onmicrosoft.com/resource/subscriptions/fadf2beb-197e-4bab-b10d-7c828acb2f16/resourceGroups/rg-kubernetestest/providers/Microsoft.ContainerService/managedClusters/mycluster/overview

## Commands

### Connect to cluster
az aks get-credentials --resource-group rg-kubernetestest --name mycluster --overwrite-existing

### Configure DNS name
az network public-ip update --resource-group MC_rg-kubernetestest_mycluster_canadacentral --name kubernetes-ac41fa7cec0bc4049b187bffbcc448c5 --dns-name byas-helloworld-app

### Set min node pool size
az aks nodepool update --resource-group rg-kubernetestest --cluster-name mycluster --name agentpool --update-cluster-autoscaler --min-count 1 --max-count 5




kubectl get nodes

kubectl create deployment byas-helloworld --image=woutervanranst/byas-helloworld:latest --replicas=3

kubectl expose deployment byas-helloworld --port=80 --target-port=8080 --type=LoadBalancer

kubectl get deployments -w
kubectl get services -w
kubectl get pods -w