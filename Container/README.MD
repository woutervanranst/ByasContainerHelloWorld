# Create Project

1. Start with No Docker Support

1. Run it locally

http://localhost:5093/hello

# Docker

docker build -t byas-helloworld .

docker run -it --rm -p 8080:8080 byas-helloworld

localhost:8080/hello


docker tag byas-helloworld woutervanranst/byas-helloworld:latest

docker push woutervanranst/byas-helloworld:latest

https://hub.docker.com/repositories/woutervanranst

# In Azure

* https://portal.azure.com/woutervanranstgmail.onmicrosoft.com/

* Create new App Service
  * !! DISABLE secure hostname
* Choose Container
  * Disable sidcar support
  * Other   container registry
  * Image   and tag
  * woutervanranst/byas-helloworld
  * wouter-byas-test.azurewebsites.net/weatherforecast