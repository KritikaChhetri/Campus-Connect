# Campus Connect – Entity Relationship Diagram

## Entities

### Users
- _id
- name
- email
- password
- role

### Students
- _id
- userId
- studentId
- department
- semester

### Faculty
- _id
- userId
- facultyId
- department
- designation

### Courses
- _id
- courseName
- courseCode
- facultyId
- department
- semester

### Assignments
- _id
- title
- description
- courseId
- facultyId
- deadline

### Announcements
- _id
- title
- message
- createdBy
- createdAt

## Relationships

- One User can be linked to one Student profile.
- One User can be linked to one Faculty profile.
- One Faculty member can manage multiple Courses.
- One Course can have multiple Assignments.
- One Faculty member can create multiple Assignments.
- One User can create multiple Announcements.

Users
  │
  ├──── Student
  │
  ├──── Faculty
  │
  └──── Announcements
           ↑
        createdBy

Faculty
  │
  ├────< Courses
  │
  └────< Assignments

Courses
  │
  └────< Assignments