import { Avatar, Button, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { ICourse } from "../Interfaces/ICourse";
import axios from "axios";
import { useAppSelector } from "../Redux/hooks";
import { RootState } from "../Redux/store";
import Meta from "antd/es/card/Meta";

function Dashboard() {
  const [courses, setSourses] = useState<ICourse[]>([]);
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
        setSourses(response.data.courses);
      })
      .catch((e) => {
        console.error("Error fetching courses", { e });
      });
  };

  return (
    <div className="courses-page">
      <Button type="primary" onClick={fetchCourses}>Create Course</Button>
      <Row>
        {courses.map((course, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              title={course.title}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
            >
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                }
                title={course.instructor?.firstName + " " + course.instructor?.lastName} 
                description={course.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Dashboard;
