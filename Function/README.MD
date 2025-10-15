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

k6 run load-test.js 