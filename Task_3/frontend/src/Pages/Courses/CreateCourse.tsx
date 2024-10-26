// Importing Ant Design components
import { Card, Form, Input, Button, message } from "antd"; 
import TextArea from "antd/es/input/TextArea"; 

// Importing Axios for API requests
import axios from "axios"; 

// Importing React and hooks
import React, { useState } from "react"; 

// Importing interfaces
import { ICourse } from "../../Interfaces/ICourse"; 

// Importing custom hooks
import { useAppSelector } from "../../Redux/hooks"; 

// Importing the AddWeekForm component
import AddWeekForm from "../../Components/Courses/AddWeekForm"; 

const CreateCourse: React.FC = () => {
  const [form] = Form.useForm(); // Create form instance
  const [courseDetails, setCourseDetails] = useState<ICourse | null>(null); // State for created course details
  const { user } = useAppSelector((state) => state.user); // Get user from Redux store
  const [weeks, setWeeks] = useState<number[]>([1]); // State to manage weeks

  // Handle form submission for course creation
  const onFinishCourse = (values: { title: string; description: string }) => {
    axios
      .post(
        "http://localhost:5197/api/course",
        { ...values, InstructorId: user?.id }, // Include InstructorId in the request
        { headers: { Authorization: `Bearer ${user?.token}` } } // Add authorization header
      )
      .then((response) => {
        setCourseDetails(response.data); // Set the created course details
        message.success("Course has been created!"); // Show success message
      })
      .catch((e) => {
        message.error("An unexpected error occurred."); // Show error message
        console.log({ e });
      });
  };

  // Add another week to the form
  const addAnotherWeek = () => {
    setWeeks([...weeks, weeks.length + 1]); // Update weeks state with new week number
  };

  return (
    <div className="create-course-page">
      <h2 className="page-title">Create Course</h2>
      <Card title="Course">
        <Form layout={"horizontal"} form={form} onFinish={onFinishCourse}>
          <Form.Item label="Title" required name="title">
            <Input placeholder="Enter course title" /> {/* Title input field */}
          </Form.Item>
          <Form.Item label="Description" required name="description">
            <TextArea
              placeholder="Enter course description"
              autoSize={{ minRows: 3, maxRows: 5 }} // Adjustable textarea
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={courseDetails !== null} // Disable button if course is created
              htmlType="submit"
              type="primary"
            >
              Create Course
            </Button>
          </Form.Item>
        </Form>

        {courseDetails && ( // Render week forms if course has been created
          <>
            <Card title="Add Weeks" style={{ marginTop: "20px" }}>
              {weeks.map((week, index) => (
                <AddWeekForm key={index} weekNum={index} courseDetails={courseDetails} />
              ))}
            </Card>
            <Button type="dashed" onClick={addAnotherWeek} style={{ marginTop: "10px" }}>
              Create Another Week
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default CreateCourse; // Exporting the CreateCourse component
