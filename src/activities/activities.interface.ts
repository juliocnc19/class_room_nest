import { Activities, ActivitiesSent, Prisma } from '@prisma/client';

export interface Activitiy {
  create(activitiy: Prisma.ActivitiesCreateInput): Promise<Activities>;
  findOne(id: number): Promise<Activities | null>;
  findMany(course_id: number): Promise<Activities[] | []>;
  delete(id: number): Promise<Activities>;
  update(activities: Activities): Promise<Activities>;
  myActivities(idUser: number): Promise<Activities[]>;
  myActivitiesSent(id_user: number): Promise<Activities[]>;
  activitiesForEvaluation(id_activity: number): Promise<ActivitiesSent[]>;
}
