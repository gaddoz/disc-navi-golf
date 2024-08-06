import { action, cache } from "@solidjs/router";
import { getUser as gU, 
        logout as l, 
        loginOrRegister as lOR, 
        getCourses as gCourses, addCourse as aCourse,
        getCourse as gCourse,
        getPoints as gPoints,
        addPoint as aPoint,
        deleteCourse as dCourse,
        deletePoint as dPoint,
        updatePointLocation as uPointLocation,
        updatePointInfo as uPointInfo
    } from "./server";

export const getUser = cache(gU, "user");
export const getCourses = cache(gCourses, "courses");
export const loginOrRegister = action(lOR, "loginOrRegister");
export const logout = action(l, "logout");
export const addCourse = action(aCourse,"addCourse");

export const getCourse = cache(async (id: number) => gCourse(id),"course");
export const getPoints = cache(gPoints,"points");
export const addPoint = action(aPoint,"addPoint");
export const updatePointLocation = action(uPointLocation,"updatePointLocation");
export const updatePointInfo = action(uPointInfo,"updatePointInfo");
export const deleteCourse = action(dCourse,"dCourse");
export const deletePoint = action(dPoint,"dPoint");