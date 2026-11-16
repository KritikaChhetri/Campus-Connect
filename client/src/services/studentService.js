import { createCrudService } from "./apiClient";

const studentApi = createCrudService("students");

export const getStudents = studentApi.getAll;
export const getStudentById = studentApi.getById;
export const createStudent = studentApi.create;
export const updateStudent = studentApi.update;
export const deleteStudent = studentApi.remove;
