import { Activities, Prisma } from '@prisma/client';

export interface Activitiy {
  create(activitiy: Activities): Promise<Activities>;
  findOne(id: number): Promise<Activities | null>;
  findMany(course_id: number): Promise<Activities[] | []>;
  delete(id: number): Promise<Activities>;
  update(activities: Activities): Promise<Activities>;
  myActivities(idUser: number): Promise<Activities[]>;
}
