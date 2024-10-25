export interface ICourse {
    id: number;
    title: string;
    description: string;
    instructorId: string; // Foreign key to ApplicationUser
    instructor: IInstructor; // Navigation property
  }

 export interface IInstructor{
    id: string; 
    firstName: string;
    lastName: string;
 } 