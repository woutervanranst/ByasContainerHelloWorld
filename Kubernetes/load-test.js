import http from 'k6/http';
import { check, sleep } from 'k6';

// LINEAR RAMP TO 2500 USERS - Build up the pressure!
export const options = {
  scenarios: {
    linear_ramp_to_max: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '45s', target: 2500 },  // Linear ramp from 0 to 2500 users in 1 minute
        { duration: '1m', target: 2500 },  // Hold at 2500 users for 2 minutes
        { duration: '30s', target: 0 },    // Ramp down
      ],
    },
  },
  
  // NO thresholds - we want to see everything fail and keep going
  thresholds: {},
};

// Use the DNS name we configured for the Kubernetes service
const BASE_URL = 'http://byas-helloworld-demo.canadacentral.cloudapp.azure.com';

export default function () {
  // Test the main hello endpoint
  const response = http.get(`${BASE_URL}/hello`);
  
  // Track everything - successes AND failures
  check(response, {
    'status 200 (success)': (r) => r.status === 200,
    'status 4xx (client error)': (r) => r.status >= 400 && r.status < 500,
    'status 5xx (server error)': (r) => r.status >= 500,
    'timeout/connection error': (r) => r.status === 0,
  });
}

// Setup function - runs once before the test starts
export function setup() {
  console.log('📈 LINEAR RAMP TO 2500 USERS! �');
  console.log(`Target: ${BASE_URL}/hello`);
  console.log('🔥 0 → 2500 users in 60 seconds (linear ramp)');
  console.log('⏱️ Hold at 2500 users for 2 minutes');
  console.log('⚡ Maximum pressure build-up!');
}

// Teardown function - runs once after the test ends
export function teardown(data) {
  console.log('🏁 LINEAR RAMP TEST COMPLETE!');
  console.log('Peak load: 2500 concurrent users reached!');
  console.log('Check the summary for detailed failure rates and response times.');
}