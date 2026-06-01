# 📝 API Testing Guide

This guide provides curl examples to test all LMS API endpoints.

## Authentication

### 1. Register Admin User
```bash
curl -X POST http://localhost:5000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "Admin@123",
    "role": "admin"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@test.com",
      "role": "admin"
    }
  }
}
```

### 2. Register Student User
```bash
curl -X POST http://localhost:5000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Student User",
    "email": "student@test.com",
    "password": "Student@123",
    "role": "student",
    "departmentId": 1,
    "academicYearId": 1,
    "studentId": "STU001"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@test.com",
    "password": "Admin@123",
    "callbackURL": "/"
  }'
```

Note: `-c cookies.txt` saves cookies for use in subsequent requests

### 4. Get Current Session
```bash
curl -X GET http://localhost:5000/api/auth/get-session \
  -b cookies.txt
```

### 5. Logout
```bash
curl -X POST http://localhost:5000/api/auth/sign-out \
  -b cookies.txt
```

## Departments

### 1. List All Departments
```bash
curl http://localhost:5000/api/departments
```

### 2. Get Department Details
```bash
curl http://localhost:5000/api/departments/1
```

### 3. Create Department (Admin Only)
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Software Engineering",
    "description": "Software Engineering Department"
  }'
```

### 4. Update Department (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/departments/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Computer Science",
    "description": "Updated description"
  }'
```

### 5. Delete Department (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/departments/1 \
  -b cookies.txt
```

## Academic Years

### 1. List Academic Years by Department
```bash
curl "http://localhost:5000/api/academic-years?departmentId=1"
```

### 2. Get Academic Year Details
```bash
curl http://localhost:5000/api/academic-years/1
```

### 3. Create Academic Year (Admin Only)
```bash
curl -X POST http://localhost:5000/api/academic-years \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "departmentId": 1,
    "yearName": "Year 1"
  }'
```

### 4. Update Academic Year (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/academic-years/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "yearName": "Year 2"
  }'
```

### 5. Delete Academic Year (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/academic-years/1 \
  -b cookies.txt
```

## Courses

### 1. List Courses by Academic Year
```bash
curl "http://localhost:5000/api/courses?academicYearId=1"
```

### 2. Get Course with Resources and Exams
```bash
curl http://localhost:5000/api/courses/1
```

### 3. Create Course (Admin Only)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "departmentId": 1,
    "academicYearId": 1,
    "name": "Programming Fundamentals",
    "code": "CS101",
    "description": "Learn programming basics",
    "credits": 3
  }'
```

### 4. Update Course (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Advanced Programming",
    "code": "CS102",
    "credits": 4
  }'
```

### 5. Delete Course (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/courses/1 \
  -b cookies.txt
```

## Resources

### 1. List Resources by Course
```bash
curl "http://localhost:5000/api/resources?courseId=1"
```

### 2. Get Resource Details
```bash
curl http://localhost:5000/api/resources/1
```

### 3. Create Resource (Admin Only)
```bash
curl -X POST http://localhost:5000/api/resources \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "courseId": 1,
    "title": "Lecture 1: Introduction",
    "description": "Introduction to programming",
    "fileUrl": "https://example.com/lecture1.pdf",
    "fileType": "pdf"
  }'
```

### 4. Update Resource (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/resources/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Updated Lecture 1",
    "fileUrl": "https://example.com/lecture1-v2.pdf"
  }'
```

### 5. Delete Resource (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/resources/1 \
  -b cookies.txt
```

## Exams

### 1. List Exams by Course
```bash
curl "http://localhost:5000/api/exams?courseId=1"
```

### 2. Get Exam with Questions
```bash
curl http://localhost:5000/api/exams/1
```

### 3. Create Exam (Admin Only)
```bash
curl -X POST http://localhost:5000/api/exams \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "courseId": 1,
    "title": "Midterm Exam",
    "description": "Midterm examination",
    "passingPercentage": 40,
    "duration": 120
  }'
```

### 4. Update Exam (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/exams/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Updated Midterm",
    "duration": 90
  }'
```

### 5. Delete Exam (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/exams/1 \
  -b cookies.txt
```

## Questions

### 1. List Questions by Exam
```bash
curl "http://localhost:5000/api/questions?examId=1"
```

### 2. Get Question Details
```bash
curl http://localhost:5000/api/questions/1
```

### 3. Create Question (Admin Only)
```bash
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "examId": 1,
    "questionText": "What is the correct way to declare a variable in JavaScript?",
    "optionA": "var x = 5;",
    "optionB": "variable x = 5;",
    "optionC": "v x = 5;",
    "optionD": "declare x = 5;",
    "correctAnswer": "A",
    "explanation": "In JavaScript, you use var, let, or const keywords to declare variables."
  }'
```

### 4. Update Question (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/questions/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "questionText": "Updated question text",
    "optionA": "Updated option A",
    "correctAnswer": "B"
  }'
```

### 5. Delete Question (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/questions/1 \
  -b cookies.txt
```

## Results

### 1. List All Results (Admin) / Own Results (Student)
```bash
curl http://localhost:5000/api/results \
  -b cookies.txt
```

### 2. Get Result Details
```bash
curl http://localhost:5000/api/results/1 \
  -b cookies.txt
```

### 3. Submit Exam (Student Only)
```bash
curl -X POST http://localhost:5000/api/results/submit \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "examId": 1,
    "answers": [
      {
        "questionId": 1,
        "selectedAnswer": "A",
        "correctAnswer": "A"
      },
      {
        "questionId": 2,
        "selectedAnswer": "B",
        "correctAnswer": "B"
      },
      {
        "questionId": 3,
        "selectedAnswer": "C",
        "correctAnswer": "A"
      }
    ]
  }'
```

Response:
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "data": {
    "id": 1,
    "studentId": 2,
    "examId": 1,
    "totalQuestions": 3,
    "correctAnswers": 2,
    "score": 2,
    "percentage": 66.67,
    "status": "completed",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Get Exam Result for Student
```bash
curl http://localhost:5000/api/results/exam/1 \
  -b cookies.txt
```

## Complete Workflow Example

```bash
# 1. Register admin
curl -X POST http://localhost:5000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -c admin_cookies.txt \
  -d '{
    "name": "Admin",
    "email": "admin@test.com",
    "password": "Admin@123",
    "role": "admin"
  }'

# 2. Create department
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{"name": "Software Engineering"}'

# 3. Create academic year
curl -X POST http://localhost:5000/api/academic-years \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{
    "departmentId": 1,
    "yearName": "Year 1"
  }'

# 4. Create course
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{
    "departmentId": 1,
    "academicYearId": 1,
    "name": "Programming 101",
    "code": "CS101"
  }'

# 5. Create exam
curl -X POST http://localhost:5000/api/exams \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{
    "courseId": 1,
    "title": "Quiz 1",
    "duration": 30
  }'

# 6. Register student
curl -X POST http://localhost:5000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -c student_cookies.txt \
  -d '{
    "name": "Student",
    "email": "student@test.com",
    "password": "Student@123",
    "role": "student",
    "departmentId": 1,
    "academicYearId": 1,
    "studentId": "STU001"
  }'

# 7. Student submits exam
curl -X POST http://localhost:5000/api/results/submit \
  -H "Content-Type: application/json" \
  -b student_cookies.txt \
  -d '{
    "examId": 1,
    "answers": [
      {
        "questionId": 1,
        "selectedAnswer": "A",
        "correctAnswer": "A"
      }
    ]
  }'
```

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized - No session token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Forbidden - Admin access required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Department not found"
}
```

### Bad Request (400)
```json
{
  "success": false,
  "message": "Department name is required"
}
```

## Tips

- Use `-b cookies.txt` to send saved cookies
- Use `-c cookies.txt` to save cookies
- Use `-H "Content-Type: application/json"` for JSON requests
- Use `-d @file.json` to send from JSON file
- Use `| jq` to pretty-print JSON responses
- Use `curl -i` to see response headers

## Testing Order

1. Create admin account
2. Create department
3. Create academic year
4. Create course
5. Create exam
6. Create questions
7. Create student account
8. Student takes exam (submit answers)
9. Check results
