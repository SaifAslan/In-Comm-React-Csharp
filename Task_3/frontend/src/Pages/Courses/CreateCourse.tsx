import { Card, Form, Input, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useState } from "react";
import { ICourse } from "../../Interfaces/ICourse"; // Import the interface
import { useAppSelector } from "../../Redux/hooks";
import AddWeekForm from "../../Components/Courses/AddWeekForm"; // Import the new week form component

const CreateCourse: React.FC = () => {
  const [form] = Form.useForm();
  const [courseDetails, setCourseDetails] = useState<ICourse | null>(null);
  const { user } = useAppSelector((state) => state.user);
  const [weeks, setWeeks] = useState<number[]>([1]); // State to manage weeks

  const onFinishCourse = (values: { title: string; description: string }) => {
    axios
      .post(
        "http://localhost:5197/api/course",
        { ...values, InstructorId: user?.id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      )
      .then((response) => {
        setCourseDetails(response.data); // Set the created course details
        message.success("Course has been created!"); // Show success message
      })
      .catch((e) => {
        message.error("An unexpected error occurred.");
        console.log({ e });
      });
  };

  const addAnotherWeek = () => {
    setWeeks([...weeks, weeks.length + 1]); // Add a new week entry
  };

  return (
    <div className="create-course-page">
      <h2 className="page-title">Create Course</h2>
      <Card title="Course">
        <Form layout={"horizontal"} form={form} onFinish={onFinishCourse}>
          <Form.Item label="Title" required name="title">
            <Input placeholder="Enter course title" />
          </Form.Item>
          <Form.Item label="Description" required name="description">
            <TextArea
              placeholder="Enter course description"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={courseDetails !== null}
              htmlType="submit"
              type="primary"
            >
              Create Course
            </Button>
          </Form.Item>
        </Form>

        {courseDetails && (
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

export default CreateCourse;
