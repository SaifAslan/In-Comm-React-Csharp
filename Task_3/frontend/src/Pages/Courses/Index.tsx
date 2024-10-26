// Importing React and related libraries
import React, { useEffect, useState } from "react"; 

// Importing Ant Design components
import { Avatar, Button, Card, Col, Row } from "antd"; 

// Importing Axios for API requests
import axios from "axios"; 

// Importing hooks and selectors from Redux
import { useAppSelector } from "../../Redux/hooks"; 
import { RootState } from "../../Redux/store"; 

// Importing Meta component from Ant Design
import Meta from "antd/es/card/Meta"; 

// Importing React Router hooks for navigation
import { useNavigate } from "react-router-dom"; 

// Importing user role interface
import { IRole } from "../../Interfaces/IUser"; 
import { ICourse } from "../../Interfaces/ICourse";

function Courses() {
  const [courses, setCourses] = useState<ICourse[]>([]); // State to manage list of courses
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.user // Get user authentication status and user info from Redux store
  );

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Function to fetch courses from API
  const fetchCourses = () => {
    axios
      .get("http://localhost:5197/api/course", {
        headers: { Authorization: `Bearer ${user?.token}` }, // Include token in headers
      })
      .then((response) => {
        setCourses(response.data.courses); // Update courses state with fetched data
      })
      .catch((e) => {
        console.error("Error fetching courses", { e }); // Log error if fetching fails
      });
  };

  const navigate = useNavigate(); // Hook for navigation

  // Handle course card click
  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`); // Navigate to the course details page by ID
  };

  // Check if the user has the Instructor or Admin role
  const isInstructorOrAdmin = user?.roles.includes(IRole.Instructor) || user?.roles.includes(IRole.Admin);

  return (
    <div className="courses-page">
      {/* Conditionally render the Create Course button */}
      {isInstructorOrAdmin && (
        <Button className="create-button" type="primary" onClick={() => navigate("/courses/create-course")}>
          Create Course
        </Button>
      )}
      <Row gutter={[16, 16]}>
        {courses.map((course) => (
          <Col xs={24} sm={12} md={8} key={course.id}>
            <Card
              title={course.title} // Display course title
              cover={
                <img
                  alt={course.title} // Set alt text for accessibility
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" // Course cover image
                />
              }
              onClick={() => handleCourseClick(course.id)} // Add click handler for navigation
              style={{ cursor: 'pointer' }} // Change cursor to pointer for better UX
            >
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" /> // Avatar for instructor
                }
                title={
                  course.instructor?.firstName + " " + course.instructor?.lastName // Display instructor's name
                }
                description={course.description} // Display course description
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Courses; // Exporting the Courses component
