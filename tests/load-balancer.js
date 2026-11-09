import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL;

if (!baseUrl) {
    throw new Error("BASE_URL is required, for example: -e BASE_URL=http://...");
}

export const options = {
    vus: 10,
    duration: "30s",
    thresholds: {
        http_req_failed: ["rate<0.05"],
        http_req_duration: ["p(95)<1000"],
    },
};

export default function () {
    const healthResponse = http.get(`${baseUrl}/api/health`);
    check(healthResponse, {
        "health returns 200": (response) => response.status === 200,
    });

    const productsResponse = http.get(`${baseUrl}/api/products`);
    check(productsResponse, {
        "products returns 200": (response) => response.status === 200,
        "products returns a list": (response) => response.json().constructor === Array,
    });

    sleep(1);
}
