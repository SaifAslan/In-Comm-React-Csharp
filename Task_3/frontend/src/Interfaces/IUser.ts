export interface IUser {
    id: string; 
    email: string;
    firstName: string;
    phone: string; 
    lastName: string;
    dateOfBirth: Date; 
    createdAt: Date; 
    updatedAt: Date; 
    roles: IRole[];
}

export enum IRole {
    "Admin",
    "Instructor",
    "Student"
}