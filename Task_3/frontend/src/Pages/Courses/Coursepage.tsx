// Importing React and related libraries
import React, { useEffect, useState } from "react"; 

// Importing Ant Design components
import { Button, Card, Collapse, List, message } from "antd"; 

// Importing Axios for API requests
import axios from "axios"; 

// Importing hooks from React Router
import { useParams } from "react-router-dom"; 

// Importing interfaces
import { IRole } from "../../Interfaces/IUser"; 
import { IweekFile } from "../../Interfaces/IWeekFile"; 

// Importing Redux hooks and actions
import { useAppDispatch, useAppSelector } from "../../Redux/hooks"; 
import { setEnrollments } from "../../Redux/features/Enrollments/enrollmentsSlice"; 


const { Panel } = Collapse;

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>(); // Get the course ID from the URL
  const [weeks, setWeeks] = useState<any[]>([]); // State to manage weeks
  const [courseDetails, setCourseDetails] = useState<any>(null); // State for course details
  const { user } = useAppSelector((state) => state.user); // Get user from Redux store
  const { courses } = useAppSelector((state) => state.enrollment); // Get enrolled courses from Redux
  const [isEnrolled, setIsEnrolled] = useState(false); // State to track if user is enrolled
  const dispatch = useAppDispatch(); // Get dispatch function from Redux store

  // Fetch course details
  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5197/api/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setWeeks(response.data.weeks); // Set weeks from response
      setCourseDetails(response.data); // Set course details
      console.log(response.data);
    } catch (error) {
      message.error("Failed to fetch course details."); // Handle fetch error
      console.error(error);
    }
  };

  // Handle course enrollment
  const handleEnroll = async () => {
    try {
      await axios.post(
        'http://localhost:5197/api/enrollment/enroll',
        {
          studentId: user?.id, 
          courseId: parseInt(courseId as string), 
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` }, // Add token if needed
        }
      );
      setIsEnrolled(true); // Update enrollment status
      dispatch(setEnrollments([...courses, courseDetails])) // Update enrolled courses in Redux
      message.success("You have successfully enrolled in the course!"); // Show success message
    } catch (error) {
      message.error("Failed to enroll in the course."); // Handle enrollment error
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourseDetails(); // Fetch course details on component mount
    if (courses.some(course => course.id === parseInt(courseId as string))) {
      setIsEnrolled(true); // Check if user is already enrolled
    }
  }, [courseId, courses]); // Dependencies for useEffect

  // Check user roles
  const isStudent = user?.roles.includes(IRole.Student); // Check if user is a student
  const isInstructor = user?.roles.includes(IRole.Instructor); // Check if user is an instructor
  const isAdmin = user?.roles.includes(IRole.Admin); // Check if user is an admin

  return (
    <div style={{ padding: "20px" }}>
      {courseDetails && ( // Render course details if available
        <Card
          style={{ marginBottom: "20px" }}
          cover={
            <img
              alt="Course Banner"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              style={{ height: "200px", objectFit: "cover" }}
            />
          }
        >
          <h2>{courseDetails.title.toUpperCase()}</h2>
          <p>{courseDetails.description}</p>
          <p>
            Instructor: {courseDetails.instructor?.firstName} {courseDetails.instructor?.lastName}
          </p>
        </Card>
      )}
      
      {isStudent && ( // Conditionally render the Enroll button
        <Button
          type="primary"
          onClick={handleEnroll}
          style={{ marginBottom: "20px" }}
          disabled={isEnrolled} // Disable button if already enrolled
        >
          {isEnrolled ? "Enrolled" : "Enroll"} {/* Change button text based on enrollment status */}
        </Button>
      )}

      <h2>Course Content</h2>
      <Collapse>
        {weeks.map((week, index) => ( // Render each week
          <Panel header={` ${week.title.toUpperCase()}`} key={index}>
            <p>{week.description}</p> {/* Display the week description */}
            <List
              size="small"
              bordered
              dataSource={week.files} // Files for each week
              renderItem={(file: IweekFile) => (
                <List.Item>
                  {(isStudent && isEnrolled || isInstructor || isAdmin) ? ( // Check user roles for access
                    <a href={file.url} target="_blank" rel="noopener noreferrer"> {/* Render as clickable link */}
                      {file.fileName}
                    </a>
                  ) : (
                    <span>{file.fileName}</span> // Render as normal text for other roles
                  )}
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default CoursePage; // Exporting the component
