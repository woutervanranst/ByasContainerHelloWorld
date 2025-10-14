# Create Project

1. Start with No Docker Support

1. Run it locally

# Docker

docker build -t byas-helloworld .

docker run -it --rm -p 8080:8080 byas-helloworld

localhost:8080/hello

docker tag byas-helloworld woutervanranst/byas-helloworld:latest

docker push woutervanranst/byas-helloworld:latest

# In Azure

* Create new App Service
  * !! DISABLE secure hostname
* Choose Container
  * Disable sidcar support
  * Other   container registry
  * Image   and tag
  * woutervanranst/byas-helloworld
  * wouter-byas-test.azurewebsites.net/weatherforecast



# Function

Create New > Consumption tier (not Flex Consumption)

```python
import azure.functions as func
import random

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="http_trigger1")
def http_trigger1(req: func.HttpRequest) -> func.HttpResponse:
    random_number = random.randint(1, 1000)

    return func.HttpResponse(
        f"Hello world {random_number}",
        status_code=200
    )

```


# Load test

winget install k6 --source winget