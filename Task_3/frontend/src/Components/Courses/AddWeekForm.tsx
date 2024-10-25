import { Form, Input, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { IWeek } from "../../Interfaces/IWeek";
import FileUpload from "./FileUpload";
import { useAppSelector } from "../../Redux/hooks";
import { ICourse } from "../../Interfaces/ICourse";
import axios from "axios";

interface AddWeekFormProps {
  courseDetails : ICourse | null;
}

const AddWeekForm: React.FC<AddWeekFormProps> = ({courseDetails  }) => {
  const [form] = Form.useForm();
  const [week, setWeek] = useState<IWeek | null>(null);
  const {user} = useAppSelector(state=> state.user);
 
   const onFinishWeek = async (values: {
    title: string;
    description: string;
  }) => {
    if (!courseDetails) return;

    try {
      const response = await axios.post<IWeek>(
        `http://localhost:5197/api/course/${courseDetails.id}/week`,
        values,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setWeek(response.data); // Update weeks state
      message.success("Week has been created!");
    } catch (error) {
      message.error("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <Form layout={"horizontal"} form={form} onFinish={onFinishWeek}>
      <Form.Item label="Title" required name="title">
        <Input placeholder="Enter week title" />
      </Form.Item>
      <Form.Item label="Description" required name="description">
        <TextArea
          placeholder="Enter week description"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">Create Week</Button>
      </Form.Item>
     {week && <FileUpload weekId={week?.id} user={user} />}
    </Form>
  );
};

export default AddWeekForm;
