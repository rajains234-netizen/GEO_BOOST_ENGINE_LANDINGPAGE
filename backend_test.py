#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class GEOBoostAPITester:
    def __init__(self, base_url="https://geo-boost-engine.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_time": response.elapsed.total_seconds(),
                "timestamp": datetime.now().isoformat()
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    result["response_data"] = response_data
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    result["response_text"] = response.text[:200]
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                result["error_response"] = response.text[:500]

            self.test_results.append(result)
            return success, response.json() if success and response.content else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            self.test_results.append(result)
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root Version Info",
            "GET",
            "api/",
            200
        )
        return success and 'version' in response

    def test_create_lead(self):
        """Test creating a business lead"""
        test_lead_data = {
            "business_name": f"Test Business {datetime.now().strftime('%H%M%S')}",
            "website": "https://testbusiness.com",
            "location": "Phoenix, AZ",
            "owner_name": "John Test",
            "email": "john@testbusiness.com",
            "phone": "(555) 123-4567",
            "business_type": "HVAC & Heating"
        }
        
        success, response = self.run_test(
            "Create Business Lead",
            "POST",
            "api/leads",
            200,
            data=test_lead_data
        )
        
        if success and 'id' in response:
            self.created_lead_id = response['id']
            print(f"   Created lead ID: {self.created_lead_id}")
            return True
        return False

    def test_get_lead(self):
        """Test retrieving a lead by ID"""
        if not hasattr(self, 'created_lead_id'):
            print("❌ Skipping - No lead ID available")
            return False
            
        success, response = self.run_test(
            "Get Lead by ID",
            "GET",
            f"api/leads/{self.created_lead_id}",
            200
        )
        return success and response.get('id') == self.created_lead_id

    def test_create_payment_session(self):
        """Test creating a payment session"""
        if not hasattr(self, 'created_lead_id'):
            print("❌ Skipping - No lead ID available")
            return False
            
        payment_data = {
            "lead_id": self.created_lead_id,
            "success_url": "https://geo-boost-engine.preview.emergentagent.com/success",
            "cancel_url": "https://geo-boost-engine.preview.emergentagent.com/?cancelled=true"
        }
        
        success, response = self.run_test(
            "Create Payment Session",
            "POST",
            "api/payments/create-session",
            200,
            data=payment_data
        )
        
        if success and 'checkout_url' in response and 'session_id' in response:
            self.session_id = response['session_id']
            print(f"   Session ID: {self.session_id}")
            print(f"   Checkout URL: {response['checkout_url'][:100]}...")
            return True
        return False

    def test_payment_confirmation(self):
        """Test payment confirmation endpoint"""
        if not hasattr(self, 'created_lead_id') or not hasattr(self, 'session_id'):
            print("❌ Skipping - No lead ID or session ID available")
            return False
            
        success, response = self.run_test(
            "Confirm Payment",
            "POST",
            f"api/payments/confirm?lead_id={self.created_lead_id}&session_id={self.session_id}",
            200
        )
        return success and response.get('status') == 'success'

    def test_create_free_lead(self):
        """Test creating a free lead"""
        test_free_lead_data = {
            "business_name": f"Free Test Business {datetime.now().strftime('%H%M%S')}",
            "email": "test@freebusiness.com",
            "location": "Los Angeles, CA"
        }
        
        success, response = self.run_test(
            "Create Free Lead",
            "POST",
            "api/free-leads",
            200,
            data=test_free_lead_data
        )
        
        if success and 'id' in response:
            self.created_free_lead_id = response['id']
            print(f"   Created free lead ID: {self.created_free_lead_id}")
            return True
        return False

    def test_analytics_tracking(self):
        """Test analytics tracking endpoint"""
        tracking_data = {
            "event_name": "test_event",
            "event_data": {"test": "data"},
            "page_url": "https://geo-boost-engine.preview.emergentagent.com/",
            "user_agent": "Test Agent"
        }
        
        success, response = self.run_test(
            "Track Analytics Event",
            "POST",
            "api/track",
            200,
            data=tracking_data
        )
        return success and response.get('status') == 'tracked'

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting GEO Boost Engine API Tests")
        print(f"   Base URL: {self.base_url}")
        print("=" * 60)

        # Test API root
        self.test_api_root()
        
        # Test free lead creation
        self.test_create_free_lead()
        
        # Test lead creation and retrieval
        if self.test_create_lead():
            self.test_get_lead()
            
            # Test payment flow
            if self.test_create_payment_session():
                self.test_payment_confirmation()
        
        # Test analytics
        self.test_analytics_tracking()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"❌ {self.tests_run - self.tests_passed} test(s) failed")
            return 1

    def save_results(self, filename="/app/test_reports/backend_api_results.json"):
        """Save test results to file"""
        results = {
            "test_run_timestamp": datetime.now().isoformat(),
            "base_url": self.base_url,
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "success_rate": (self.tests_passed/self.tests_run*100) if self.tests_run > 0 else 0,
            "test_results": self.test_results
        }
        
        try:
            with open(filename, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"📄 Results saved to: {filename}")
        except Exception as e:
            print(f"❌ Failed to save results: {e}")

def main():
    tester = GEOBoostAPITester()
    exit_code = tester.run_all_tests()
    tester.save_results()
    return exit_code

if __name__ == "__main__":
    sys.exit(main())