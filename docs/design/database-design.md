# Campus Connect – MongoDB Collection Design

## 1. Users Collection

Fields:
- _id
- name
- email
- password
- role
- createdAt

Purpose:
Stores login credentials, user roles, and basic account information.

## 2. Students Collection

Fields:
- _id
- userId
- studentId
- name
- email
- department
- semester
- phone
- address

Purpose:
Stores student-related information.

## 3. Faculty Collection

Fields:
- _id
- userId
- facultyId
- name
- email
- department
- designation
- phone

Purpose:
Stores faculty information.

## 4. Courses Collection

Fields:
- _id
- courseName
- courseCode
- description
- department
- semester
- facultyId

Purpose:
Stores course details and assigned faculty information.

## 5. Assignments Collection

Fields:
- _id
- title
- description
- courseId
- facultyId
- deadline
- createdAt

Purpose:
Stores assignment details and deadlines.

## 6. Announcements Collection

Fields:
- _id
- title
- message
- createdBy
- createdAt

Purpose:
Stores university announcements.