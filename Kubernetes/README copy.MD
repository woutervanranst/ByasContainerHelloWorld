# Kubernetes

This demo shows how to deploy a containerized application to Kubernetes with autoscaling capabilities.

## Setup

Basics
* Cluster preset: Dev/TEst

Node pools
* node autoprovisioning: disable
* Node size: A2 v2  / scale method: Autoscale


## 1. Pre-Lecture Preparation

### Connect to the cluster (replace with your resource group and cluster name)
az aks get-credentials --resource-group rg-kubernetestest --name mycluster --overwrite-existing

#### Verify connection
kubectl get nodes

#### Configure DNS for the load balancer (optional)

# Get the node resource group
NODE_RG=$(az aks show --resource-group rg-kubernetestest --name mycluster --query nodeResourceGroup --output tsv)

# Note: DNS will be configured after service creation during the demo
```

### Set cluster autoscaling (if not already configured)
```bash
# Set minimum node count to 1 for cost optimization
az aks nodepool update --resource-group rg-kubernetestest --cluster-name mycluster --name agentpool --update-cluster-autoscaler --min-count 1 --max-count 5
```

## 2. Live Demo - Deploy Application with Autoscaling

### Step 1: Create the deployment
```bash
# Deploy the container with 3 replicas
kubectl create deployment byas-helloworld --image=woutervanranst/byas-helloworld:latest --replicas=3

# Check deployment status
kubectl get deployments
kubectl get pods
```

### Step 2: Expose the service
```bash
# Create a LoadBalancer service
kubectl expose deployment byas-helloworld --port=80 --target-port=8080 --type=LoadBalancer

# Check service status (wait for external IP)
kubectl get services
```

### Step 3: Configure DNS name (optional)
```bash
# Get the external IP
EXTERNAL_IP=$(kubectl get service byas-helloworld -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "External IP: $EXTERNAL_IP"

# Get the node resource group and public IP name
NODE_RG=$(az aks show --resource-group rg-kubernetestest --name mycluster --query nodeResourceGroup --output tsv)
PUBLIC_IP_NAME=$(az network public-ip list --resource-group $NODE_RG --query "[?ipAddress=='$EXTERNAL_IP'].name" --output tsv)

# Configure DNS name
az network public-ip update --resource-group $NODE_RG --name $PUBLIC_IP_NAME --dns-name byas-helloworld-demo

# Get the FQDN
FQDN=$(az network public-ip show --resource-group $NODE_RG --name $PUBLIC_IP_NAME --query dnsSettings.fqdn --output tsv)
echo "Application URL: http://$FQDN"
echo "Hello endpoint: http://$FQDN/hello"
```

### Step 4: Configure Horizontal Pod Autoscaling
```bash
# Add resource requests to the deployment (required for HPA)
kubectl patch deployment byas-helloworld -p '{"spec":{"template":{"spec":{"containers":[{"name":"byas-helloworld","resources":{"requests":{"cpu":"100m","memory":"128Mi"},"limits":{"cpu":"500m","memory":"256Mi"}}}]}}}}'

# Create Horizontal Pod Autoscaler
kubectl autoscale deployment byas-helloworld --cpu-percent=50 --min=1 --max=10

# Check HPA status
kubectl get hpa
```

### Step 5: Test the application
```bash
# Test the application
curl http://$FQDN/hello

# Monitor pods and HPA
kubectl get pods -w
# In another terminal: kubectl get hpa -w
```

### Step 6: Load testing (optional)
```bash
# Generate load to trigger autoscaling
kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh
# Inside the pod:
while true; do wget -q -O- http://byas-helloworld/hello; done
```

## 3. Teardown - Clean Up Resources

### Remove application resources
```bash
# Delete the Horizontal Pod Autoscaler
kubectl delete hpa byas-helloworld

# Delete the service
kubectl delete service byas-helloworld

# Delete the deployment
kubectl delete deployment byas-helloworld

# Verify cleanup
kubectl get deployments,services,hpa,pods
```

### Reset DNS configuration (optional)
```bash
# Remove DNS name from public IP
NODE_RG=$(az aks show --resource-group rg-kubernetestest --name mycluster --query nodeResourceGroup --output tsv)
PUBLIC_IP_NAME=$(az network public-ip list --resource-group $NODE_RG --query "[?dnsSettings.domainNameLabel=='byas-helloworld-demo'].name" --output tsv)

if [ ! -z "$PUBLIC_IP_NAME" ]; then
    az network public-ip update --resource-group $NODE_RG --name $PUBLIC_IP_NAME --remove dnsSettings
fi
```

### Clean up any remaining resources
```bash
# Check for any remaining resources
kubectl get all

# Delete any orphaned resources if needed
kubectl delete pod --all
kubectl delete service --all --ignore-not-found=true
kubectl delete deployment --all
```

## Demo Talking Points

- **Container deployment**: Show how easy it is to deploy a containerized app
- **Service exposure**: Demonstrate LoadBalancer service creating Azure Load Balancer
- **DNS configuration**: Show how to make the service accessible via friendly DNS name
- **Horizontal autoscaling**: Explain how HPA works with resource requests/limits
- **Cluster autoscaling**: Mention how nodes scale based on pod demands
- **Load testing**: Optional demo of autoscaling in action

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