# METCS602 HW 4 - Student Trac



## Instructions



## Assignment Instructions

What is it?


The application manages student courses and their grades as documents in Mongo:


The Domain


i. Backend (Server-side)


1.StudentProfile

   a. firstName:  (required; type: string; min len: 1; max len: 255 )

   b. middleMiddle:  (optional;  type: string; min len: 1; max len 255)

   c. lastName:  (required; type: string; min len: 1; max len: 255)

   d. publicStudentId:  (required; unique; type: string; min len: 1; max len: 8; ) /* this is not the primary key */

   e. isDeleted (Optional; type: Date) /* if there is a date present, it is deleted (cannot be retrieved or show in the UI) */


2.Course

   a. publicCourseId:  ( required; unique; type: string; min len: 1; max len: 10) /* this is not the primary key */

   b. courseName:  (required; type: string; min len: 1; max len: 512)

   c. semester:  (required; type:string; min len: 1 max len: 48) /* "Summer Session 1 - 6 weeks", "Summer Session 12 weeks", "Fall", "Spring", for example.. */

   d. year: (required; type: integer)

   e. enabled: (required; default: false; type: boolean) /* if enabled can enroll into course; false: cannot show it in the UI. */


3.Enrollment

   a. courses:

      [{ (ObjectId Ref->course; required; ObjectId->Student); GPA: (Optional; type: decimal; default: 0.00) dateEnrolled: Date, required)}]


 ii. Frontend (Client-side)


    The frontend must allow me to create my profile.   The operations you must implement are:
    Create my profile (see 'StudentProfile')
    Edit my profile
    Show my profile
    Soft-delete my profile (set isDeleted with a Date and Time)
    The frontend must allow me to add courses to my profile.  ("My Courses").
    The frontend must fetch the list of courses from the database, and cannot be hard-coded)


iii. Testing

    All C.R.U.D operations/APIs each must have a test
    Fetching all the enabled courses
    Fetching the profile data
    Getting all the courses for a particular student.