import { Avatar, Button, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { ICourse } from "../../Interfaces/ICourse";
import axios from "axios";
import { useAppSelector } from "../../Redux/hooks";
import { RootState } from "../../Redux/store";
import Meta from "antd/es/card/Meta";
import { useNavigate } from "react-router-dom";
import { IRole } from "../../Interfaces/IUser";

function Courses() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios
      .get("http://localhost:5197/api/course", {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      .then((response) => {
        setCourses(response.data.courses);
      })
      .catch((e) => {
        console.error("Error fetching courses", { e });
      });
  };

  const navigate = useNavigate();

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
              title={course.title}
              cover={
                <img
                  alt={course.title}
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              onClick={() => handleCourseClick(course.id)} // Add click handler for navigation
              style={{ cursor: 'pointer' }} // Change cursor to pointer for better UX
            >
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                }
                title={
                  course.instructor?.firstName +
                  " " +
                  course.instructor?.lastName
                }
                description={course.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Courses;
