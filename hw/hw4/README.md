# METCS602 HW 4 - Student Trac

Full stack application that manages student courses and their grades as documents in Mongo. Using React + Vite for frontend, Node + Express + MongoDB for backend.

Application allows CRUD operations on student profile. Allows users to load student profile, create course, enroll in course, view courses currently enrolled in. No delete/update course/enrollment as it was not specified in instructions so didn't implement due to time constraints.

## Instructions

### Backend setup

Run MongoDB first (either w/ docker compose or locally), if changing Mongo port make sure to change the `backend/.env`.

``` bash
cd backend
npm install
npm run build
npm test # for jest test
npm run start
```

The above will run Express server on port 3049.

### Frontend

Make sure to run backend first.

``` bash
cd frontend
npm install
npm run dev
```

Go to the port on browser shown in console, eg. `http://localhost:3000`.

## Assignment Instructions

### Backend (Server-side)

1. StudentProfile

   a. firstName:  (required; type: string; min len: 1; max len: 255 )

   b. middleMiddle:  (optional;  type: string; min len: 1; max len 255)

   c. lastName:  (required; type: string; min len: 1; max len: 255)

   d. publicStudentId:  (required; unique; type: string; min len: 1; max len: 8; ) /* this is not the primary key */

   e. isDeleted (Optional; type: Date) /* if there is a date present, it is deleted (cannot be retrieved or show in the UI) */

2. Course

   a. publicCourseId:  ( required; unique; type: string; min len: 1; max len: 10) /* this is not the primary key */

   b. courseName:  (required; type: string; min len: 1; max len: 512)

   c. semester:  (required; type:string; min len: 1 max len: 48) /* "Summer Session 1 - 6 weeks", "Summer Session 12 weeks", "Fall", "Spring", for example.. */

   d. year: (required; type: integer)

   e. enabled: (required; default: false; type: boolean) /* if enabled can enroll into course; false: cannot show it in the UI. */

3. Enrollment

   a. courses:

      [{ (ObjectId Ref->course; required; ObjectId->Student); GPA: (Optional; type: decimal; default: 0.00) dateEnrolled: Date, required)}]

 ### Frontend (Client-side)


The frontend must allow me to create my profile.   The operations you must implement are:

- Create my profile (see 'StudentProfile')
- Edit my profile
- Show my profile
- Soft-delete my profile (set isDeleted with a Date and Time)
- The frontend must allow me to add courses to my profile.  ("My Courses").
- The frontend must fetch the list of courses from the database, and cannot be hard-coded)


### Testing

- All C.R.U.D operations/APIs each must have a test
- Fetching all the enabled courses
- Fetching the profile data
- Getting all the courses for a particular student.
