import http from 'k6/http';
import { check, sleep } from 'k6';

// SUPER AGGRESSIVE Test configuration - WARNING: This will hammer your endpoint!
export const options = {
  scenarios: {
    // Aggressive spike test - immediate heavy load
    spike_attack: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '10s', target: 1000 },  // FAST ramp to 100 users in 10 seconds
        { duration: '20s', target: 300 },  // Spike to 300 users in 20 seconds
        { duration: '30s', target: 500 },  // MASSIVE spike to 500 users
        { duration: '1m', target: 500 },   // Hold at 500 users for 1 minute
        { duration: '10s', target: 800 },  // EXTREME spike to 800 users
        { duration: '30s', target: 800 },  // Hold extreme load
        { duration: '20s', target: 1000 }, // MAXIMUM spike to 1000 users
        { duration: '1m', target: 1000 },  // Hold maximum load
        { duration: '30s', target: 0 },    // Emergency ramp down
      ],
    },
    
    // Constant heavy bombardment
    constant_bombardment: {
      executor: 'constant-vus',
      vus: 200,
      duration: '3m',
      startTime: '4m', // Start after spike test
    },
  },
  
  // More relaxed thresholds for aggressive testing
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<5000'], // Higher response time tolerance
    http_req_failed: ['rate<0.3'],    // Allow up to 30% error rate during stress
    http_reqs: ['rate>50'],           // Expect high request rate
  },
};

const BASE_URL = 'https://estattest2.azurewebsites.net';

export default function () {
  const params = {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'k6-aggressive-load-test',
      'Connection': 'keep-alive',
    },
  };
  
  // AGGRESSIVE: Multiple rapid requests per iteration
  for (let i = 0; i < 3; i++) {
    const response = http.get(`${BASE_URL}/api/http_trigger1`, params);
    
    // Check that the response is successful
    check(response, {
      'status is 200 or acceptable': (r) => [200, 202, 429].includes(r.status),
      'response time < 2000ms': (r) => r.timings.duration < 2000,
      'not complete failure': (r) => r.status !== 500 && r.status !== 502 && r.status !== 503,
    });
    
    // Minimal delay between rapid-fire requests
    if (i < 2) sleep(0.1); // 100ms between rapid requests
  }
  
  // Very short delay between iterations for maximum aggression
  sleep(0.2); // Only 200ms delay between iteration bursts
}

// Setup function - runs once before the test starts
export function setup() {
  console.log('🚨 STARTING SUPER AGGRESSIVE LOAD TEST! 🚨');
  console.log('WARNING: This will generate MASSIVE load on your endpoint!');
  console.log(`Target URL: ${BASE_URL}/api/http_trigger1`);
  console.log('📈 Peak load: 1000 concurrent users + 200 constant bombardment');
  console.log('⚡ Each user makes 3 rapid requests per iteration');
  console.log('💀 Prepare for potential system stress!');
}

// Teardown function - runs once after the test ends
export function teardown(data) {
  console.log('🏁 AGGRESSIVE LOAD TEST COMPLETED! 🏁');
  console.log('Check your Azure Function metrics and logs for impact analysis.');
  console.log('💡 Tip: Monitor Azure Portal for performance insights.');
}