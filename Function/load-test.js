import http from 'k6/http';
import { check, sleep } from 'k6';

// SIMPLE MAXIMUM LOAD - No mercy, just push to the limit!
export const options = {
  scenarios: {
    max_load_immediately: {
      executor: 'constant-vus',
      vus: 2500,        // Immediately start with 1000 users
      duration: '5m',   // Keep pushing for 5 minutes straight
    },
  },
  
  // NO thresholds - we want to see everything fail and keep going
  thresholds: {},
};

const BASE_URL = 'https://estattest2.azurewebsites.net';

export default function () {
  // Single request per iteration - keep it simple
  const response = http.get(`${BASE_URL}/api/http_trigger1`);
  
  // Track everything - successes AND failures
  check(response, {
    'status 200 (success)': (r) => r.status === 200,
    'status 4xx (client error)': (r) => r.status >= 400 && r.status < 500,
    'status 5xx (server error)': (r) => r.status >= 500,
    'timeout/connection error': (r) => r.status === 0,
  });
  
  // Log failure details in real-time
  if (response.status !== 200) {
    console.log(`FAILURE: Status ${response.status}, Duration: ${response.timings.duration}ms`);
  }
  
  // No sleep - maximum aggression, keep hammering!
}

// Setup function - runs once before the test starts
export function setup() {
  console.log('� MAXIMUM LOAD TEST - NO MERCY! 💀');
  console.log(`Target: ${BASE_URL}/api/http_trigger1`);
  console.log('🔥 1000 users immediately for 5 minutes straight');
  console.log('� Will report ALL failures in real-time');
  console.log('⚡ NO delays, NO thresholds, just pure load!');
}

// Teardown function - runs once after the test ends
export function teardown(data) {
  console.log('🏁 MAXIMUM LOAD TEST COMPLETE!');
  console.log('Check the summary for detailed failure rates and response times.');
}