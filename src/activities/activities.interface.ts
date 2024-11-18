import { Activities, ActivitiesSent } from '@prisma/client';
import {
  AssessActivityDto,
  CreateActivitiesDto,
  SendActivityDto,
  UpdateActivitiesDto,
} from './dto/activities.dto';

export interface Activitiy {
  create(activitiy: CreateActivitiesDto): Promise<Activities>;
  findOne(id: number): Promise<Activities | null>;
  findMany(course_id: number): Promise<Activities[] | []>;
  delete(id: number): Promise<Activities>;
  update(activities: UpdateActivitiesDto): Promise<Activities>;
  myActivities(idUser: number): Promise<Activities[]>;
  myActivitiesSent(id_user: number): Promise<Activities[]>;
  activitiesForEvaluation(id_activity: number): Promise<ActivitiesSent[]>;
  sendActivity(activitiy: SendActivityDto): Promise<ActivitiesSent>;
  activitiesSendForStudenInCourse(
    user_id: number,
    course_id: number,
  ): Promise<ActivitiesSent[]>;
  findAll(): Promise<Activities[] | []>;
  assessActivity(data: AssessActivityDto): Promise<ActivitiesSent>;
}
