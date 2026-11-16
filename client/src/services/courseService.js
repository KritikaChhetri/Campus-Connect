import { createCrudService } from "./apiClient";

const courseApi = createCrudService("courses");

export const getCourses = courseApi.getAll;
export const getCourseById = courseApi.getById;
export const createCourse = courseApi.create;
export const updateCourse = courseApi.update;
export const deleteCourse = courseApi.remove;
