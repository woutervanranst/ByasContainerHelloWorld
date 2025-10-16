# Kubernetes

## Setup

Basics
* Cluster preset: Dev/TEst

Node pools
* node autoprovisioning: disable
* Node size: A2 v2  / scale method: Autoscale

Cluster Overview > MOntiroing > enable Container Insights

## Deployment

https://portal.azure.com/#@woutervanranstgmail.onmicrosoft.com/resource/subscriptions/fadf2beb-197e-4bab-b10d-7c828acb2f16/resourceGroups/rg-kubernetestest/providers/Microsoft.ContainerService/managedClusters/mycluster/overview

## Commands

### Prep

#### Connect to cluster
az aks get-credentials --resource-group rg-kubernetestest --name mycluster --overwrite-existing



#### Set min node pool size
az aks nodepool update --resource-group rg-kubernetestest --cluster-name mycluster --name agentpool --update-cluster-autoscaler --min-count 1 --max-count 3


### Demo

kubectl get nodes

kubectl get pods

kubectl create deployment byas-helloworld --image=woutervanranst/byas-helloworld:latest

#### Configure DNS name

kubectl create service loadbalancer byas-helloworld --tcp=80:8080
kubectl annotate service byas-helloworld service.beta.kubernetes.io/azure-dns-label-name=byas-helloworld-demo

curl http://byas-helloworld-demo.canadacentral.cloudapp.azure.com/hello


<!-- NODE_RG=$(az aks show --resource-group rg-kubernetestest --name mycluster --query nodeResourceGroup --output tsv) && echo "Node Resource Group: $NODE_RG"
EXTERNAL_IP="4.229.160.24" && PUBLIC_IP_NAME=$(az network public-ip list --resource-group MC_rg-kubernetestest_mycluster_canadacentral --query "[?ipAddress=='$EXTERNAL_IP'].name" --output tsv) && echo "Public IP Name: $PUBLIC_IP_NAME"
az network public-ip update --resource-group MC_rg-kubernetestest_mycluster_canadacentral --name kubernetes-af8fcfb347dbf4c85a1f7e8cb4538f08 --dns-name byas-helloworld-demo -->

<!-- # 1. Create basic deployment (1 replica by default)
kubectl expose deployment byas-helloworld --port=80 --target-port=8080 --type=LoadBalancer -->

# Run load test
k6 run load-test.js 

# 2. Add resource requests (mandatory for HPA)
kubectl set resources deployment byas-helloworld --requests=cpu=100m,memory=128Mi --limits=cpu=500m,memory=256Mi

# 3. Create the Horizontal Pod Autoscaler
kubectl autoscale deployment byas-helloworld --cpu-percent=10 --min=1 --max=10


kubectl get deployments -w
kubectl get services -w
kubectl get pods -w

### Monitor autoscaling in action
# Terminal 1: Watch pod scaling
kubectl get pods -w

# Terminal 2: Watch HPA metrics and decisions
kubectl get hpa -w

# Terminal 3: Watch CPU/memory usage
watch kubectl top pods

# Terminal 4: Monitor specific deployment
watch kubectl top pods -l app=byas-helloworld


### Remove application resources

<!-- Delete the Horizontal Pod Autoscaler -->
kubectl delete hpa byas-helloworld

<!-- # Delete the service -->
kubectl delete service byas-helloworld

<!-- # Delete the deployment -->
kubectl delete deployment byas-helloworld

<!-- # Verify cleanup -->
kubectl get deployments,services,hpa,pods