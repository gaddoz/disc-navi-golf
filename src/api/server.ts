"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { eq } from "drizzle-orm";
import { getDB } from "./db";
import { Courses, Points, Users } from "../../drizzle/schema";

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

async function login(username: string, password: string) {
  const user = await getDB().select().from(Users).where(eq(Users.username, username)).get();
  if (!user || password !== user.password) throw new Error("Invalid login");
  return user;
}

async function register(username: string, password: string) {
  const existingUser = await getDB().select().from(Users).where(eq(Users.username, username)).get();
  if (existingUser) throw new Error("User already exists");
  return await getDB().insert(Users).values({ username, password }).returning().get();
}

function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace"
  });
}

export async function loginOrRegister(formData: FormData) {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== "login"
      ? register(username, password)
      : login(username, password));
    const session = await getSession();
    await session.update(d => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect("/");
}

export async function logout() {
  const session = await getSession();
  await session.update(d => (d.userId = undefined));
  throw redirect("/login");
}

export async function getUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  try {
    const user = await getDB().select().from(Users).where(eq(Users.id, userId)).get();
    if (!user) throw redirect("/login");
    return { id: user.id, username: user.username };
  } catch {
    throw logout();
  }
}

export async function getCourses() {
  try {
    const courses = (await getDB().select().from(Courses).all());
    console.log('getCourses',courses);
    return courses;
  } catch (err) {
    console.log('error getting courses at getCourses',err);
    return [{id:0,name:'fake'}];
  }
}

export async function addCourse(formData: FormData) {
  const name: string = (formData.get('name') || 'course 1') as string;
  type NewCourse = typeof Courses.$inferInsert;
  const newCourse: NewCourse = { name: name };
  const insertCourse = async (course: NewCourse) => {
    return await getDB().insert(Courses).values(course);
  }
  await insertCourse(newCourse);
  throw redirect("/");
}

export async function getCourse(courseId: number){
  try {
    const course = (await getDB().select().from(Courses).where(eq(Courses.id, courseId)));
    if(course.length > 1){
      console.log('db error',courseId,course)
    }
    return course[0];
  } catch (err) {
    console.log('error fetching course at getCourse',err, courseId);
    return {id:0,name:'fake'};
  }
}

export async function getPoints(courseId: number){
  try {
    const points = (await getDB().select().from(Points).where(eq(Points.courseId, courseId)));
    console.log('getPoints',points,points.length);
    return points;
  } catch (err) {
    console.log('error fetching courses',err);
    return [{id:0,name:'fake',type:'parking',location:'',courseId: 0}];
  }
}

export async function addPoint(courseId: number | undefined, formData: FormData): Promise<number | bigint> {
  const name: string = (formData.get('name') || 'tee 1') as string;
  const type: string = (formData.get('type') || 'tee') as string;
  const location: string = (formData.get('location') || '') as string;
  type NewPoint = typeof Points.$inferInsert;
  const newPoint: NewPoint = { name: name, type: type, location: location, courseId: courseId };
  const insertPoint = async (point: NewPoint) => {
    return await getDB().insert(Points).values(point);
  }
  const res = await insertPoint(newPoint);
  console.log('addPoint res',newPoint, res);
  // return res.lastInsertRowid;
  // TODO: fix this!!!
  return 1;
}

export async function deleteCourse(id: number){
  await getDB().delete(Points).where(eq(Points.courseId, id)).then(res => console.log('res',res)).catch(err => console.log('err',err))
  await getDB().delete(Courses).where(eq(Courses.id, id)).then(res => console.log('res',res)).catch(err => console.log('err',err))
  throw redirect(`/`);
}

export async function deletePoint(id: number, courseId: number){
  await getDB().delete(Points).where(eq(Points.id, id)).then(res => console.log('res',res)).catch(err => console.log('err',err))
  throw redirect(`/courses/${courseId}`);
}

export async function updatePointLocation(id: number, lat: number, lon: number){
  await getDB().update(Points)
  .set({ location: `{"lat":${lat},"lon":${lon}}` })
  .where(eq(Points.id, id))
  console.log(' updatePointCoordinates done')
}

export async function updatePointInfo(id: number, name: string, type: string){
  await getDB().update(Points)
  .set({ name: name, type: type })
  .where(eq(Points.id, id)).then(res => console.log('res',res)).catch(err => console.log('err',err));
  console.log(' updatePointInfo done');
}