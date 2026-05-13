"""
Quick Backend Test Script
Tests basic functionality of all API endpoints
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_test(name, passed):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} - {name}")

def test_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print_test("Backend Health Check", response.status_code == 200)
        return True
    except Exception as e:
        print_test("Backend Health Check", False)
        print(f"   Error: {e}")
        return False

def test_auth_endpoints():
    """Test authentication endpoints"""
    print("\n🔐 Testing Authentication...")
    
    # Test login with demo account
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": "student@edify.com",
                "password": "student123"
            }
        )
        token = None
        if response.status_code == 200:
            token = response.json().get("access_token")
            print_test("Student Login", True)
        else:
            print_test("Student Login", False)
            print(f"   Status: {response.status_code}")
        
        return token
    except Exception as e:
        print_test("Student Login", False)
        print(f"   Error: {e}")
        return None

def test_student_endpoints(token):
    """Test student endpoints"""
    print("\n👨‍🎓 Testing Student Endpoints...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test profile
    try:
        response = requests.get(f"{BASE_URL}/student/profile", headers=headers)
        print_test("GET /student/profile", response.status_code == 200)
    except Exception as e:
        print_test("GET /student/profile", False)
        print(f"   Error: {e}")
    
    # Test insight
    try:
        response = requests.get(f"{BASE_URL}/student/insight", headers=headers)
        print_test("GET /student/insight", response.status_code == 200)
        if response.status_code == 200:
            data = response.json()
            print(f"   Attendance: {data.get('attendance_percentage', 'N/A')}%")
            print(f"   Risk Level: {data.get('risk_level', 'N/A')}")
    except Exception as e:
        print_test("GET /student/insight", False)
        print(f"   Error: {e}")
    
    # Test attendance
    try:
        response = requests.get(f"{BASE_URL}/student/attendance", headers=headers)
        print_test("GET /student/attendance", response.status_code == 200)
    except Exception as e:
        print_test("GET /student/attendance", False)
        print(f"   Error: {e}")

def test_faculty_endpoints():
    """Test faculty endpoints"""
    print("\n👨‍🏫 Testing Faculty Endpoints...")
    
    # Login as faculty
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": "faculty@edify.com",
                "password": "faculty123"
            }
        )
        if response.status_code == 200:
            token = response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test dashboard
            response = requests.get(f"{BASE_URL}/faculty/dashboard", headers=headers)
            print_test("GET /faculty/dashboard", response.status_code == 200)
            
            # Test mark attendance
            response = requests.post(
                f"{BASE_URL}/faculty/attendance/mark",
                headers=headers,
                json={
                    "student_id": "STU001",
                    "subject": "Mathematics",
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "status": "present"
                }
            )
            print_test("POST /faculty/attendance/mark", response.status_code == 200)
        else:
            print_test("Faculty Login", False)
    except Exception as e:
        print_test("Faculty Endpoints", False)
        print(f"   Error: {e}")

def test_admin_endpoints():
    """Test admin endpoints"""
    print("\n👔 Testing Admin Endpoints...")
    
    # Login as admin
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": "admin@edify.com",
                "password": "admin123"
            }
        )
        if response.status_code == 200:
            token = response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test dashboard
            response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers)
            print_test("GET /admin/dashboard", response.status_code == 200)
            
            # Test analytics
            response = requests.get(f"{BASE_URL}/admin/analytics", headers=headers)
            print_test("GET /admin/analytics", response.status_code == 200)
            
            # Test users list
            response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
            print_test("GET /admin/users", response.status_code == 200)
        else:
            print_test("Admin Login", False)
    except Exception as e:
        print_test("Admin Endpoints", False)
        print(f"   Error: {e}")

def test_ai_endpoints(token):
    """Test AI endpoints"""
    print("\n🤖 Testing AI Endpoints...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test chat
    try:
        response = requests.post(
            f"{BASE_URL}/ai/chat",
            headers=headers,
            json={
                "message": "What is machine learning?",
                "context": []
            }
        )
        print_test("POST /ai/chat", response.status_code == 200)
        if response.status_code == 200:
            data = response.json()
            print(f"   Response length: {len(data.get('response', ''))} chars")
    except Exception as e:
        print_test("POST /ai/chat", False)
        print(f"   Error: {e}")

def main():
    print("=" * 60)
    print("🧪 Edufy Backend Test Suite")
    print("=" * 60)
    
    # Test if backend is running
    if not test_health():
        print("\n❌ Backend is not running!")
        print("   Start it with: uvicorn main:app --reload")
        return
    
    # Test authentication
    token = test_auth_endpoints()
    
    if token:
        # Test student endpoints
        test_student_endpoints(token)
        
        # Test faculty endpoints
        test_faculty_endpoints()
        
        # Test admin endpoints
        test_admin_endpoints()
        
        # Test AI endpoints
        test_ai_endpoints(token)
    
    print("\n" + "=" * 60)
    print("✅ Testing Complete!")
    print("=" * 60)
    print("\nNote: Some tests may fail if:")
    print("  - MongoDB is not running")
    print("  - Ollama is not running")
    print("  - Demo accounts not created")
    print("\nRefer to SETUP_GUIDE.md for setup instructions.")

if __name__ == "__main__":
    main()

# Made with Bob
