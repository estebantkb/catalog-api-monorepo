# Load balancer test with k6

The tests target the Application Load Balancer, not an individual EC2 instance.

## Run the tests

From the repository root, replace `BASE_URL` if the load balancer DNS changes:

```bash
podman run --rm -i \
  -e BASE_URL=http://catalog-api-alb-182186723.us-east-2.elb.amazonaws.com \
  -v "$PWD/tests:/scripts:ro,Z" \
  docker.io/grafana/k6 run /scripts/load-balancer.js
```

The stress test increases the load gradually up to 100 virtual users:

```bash
podman run --rm -i \
  -e BASE_URL=http://catalog-api-alb-182186723.us-east-2.elb.amazonaws.com \
  -v "$PWD/tests:/scripts:ro,Z" \
  docker.io/grafana/k6 run /scripts/load-balancer-stress.js
```

Both tests check:

- `GET /api/health`
- `GET /api/products`

## Validated stress-test result

- Maximum load: 100 virtual users.
- Duration: 3 minutes and 45 seconds.
- HTTP requests: 17,346.
- Failed requests: 0%.
- Successful checks: 100%.
- Average response time: 110.49 ms.
- 95th percentile response time: 115.01 ms.
- Maximum response time: 1.36 seconds.

These results show that the load balancer and its three EC2 targets remained
healthy during this test. They do not represent the maximum capacity of the
infrastructure.
