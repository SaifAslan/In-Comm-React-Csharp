import React, { useEffect, useState } from "react";
import { Button, Card, Collapse, List, message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // For accessing URL parameters
import { IRole, IUser } from "../../Interfaces/IUser"; // Ensure you have the IUser interface
import { IweekFile } from "../../Interfaces/IWeekFile";
import { useAppSelector } from "../../Redux/hooks";

const { Panel } = Collapse;

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>(); // Get the course ID from the URL
  const [weeks, setWeeks] = useState<any[]>([]); // State to manage weeks
  const [courseDetails, setCourseDetails] = useState<any>(null); // State for course details
  const { user } = useAppSelector((state) => state.user); // Get user from Redux store
  const [isEnrolled, setIsEnrolled] = useState(false); // State to track if user is enrolled
  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5197/api/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setWeeks(response.data.weeks); // Assuming your response contains weeks
      setCourseDetails(response.data); // Set course details
      console.log(response.data);
    } catch (error) {
      message.error("Failed to fetch course details.");
      console.error(error);
    }
  };

  const handleEnroll = async () => {
    try {
      await axios.post(
        `http://localhost:5197/api/course/${courseId}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${user?.token}` }, // Add token if needed
        }
      );
      message.success("You have successfully enrolled in the course!");
    } catch (error) {
      message.error("Failed to enroll in the course.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourseDetails(); // Fetch course details on component mount
  }, [courseId]);

  // Check user roles
 // Check user roles using the enum
 const isStudent = user?.roles.includes(IRole.Student);
 const isInstructor = user?.roles.includes(IRole.Instructor);
 const isAdmin = user?.roles.includes(IRole.Admin);


  return (
    <div style={{ padding: "20px" }}>
      {courseDetails && ( // Render course details if available
        <Card
          style={{ marginBottom: "20px" }}
          cover={
            <img
              alt="Course Banner"
              src={courseDetails.bannerFileUrl} // Display course banner image
              style={{ height: "200px", objectFit: "cover" }}
            />
          }
        >
          <h2>{courseDetails.title}</h2>
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
        >
          Enroll
        </Button>
      )}

      <h2>Course Weeks</h2>
      <Collapse>
        {weeks.map((week, index) => (
          <Panel header={` ${week.title}`} key={index}>
            <p>{week.description}</p> {/* Display the week description */}
            <List
              size="small"
              bordered
              dataSource={week.files} // Assuming each week has a files property
              renderItem={(file: IweekFile) => (
                <List.Item>
                  {(isStudent && isEnrolled || isInstructor || isAdmin) ? ( // Check if user is a student, instructor, or admin
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

export default CoursePage;
