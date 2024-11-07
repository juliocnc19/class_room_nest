import { Activities, ActivitiesSent } from '@prisma/client';
import {
  CreateActivitiesDto,
  FindActivitiesForEvaluationDto,
  FindActivitiesForUserDto,
  FindManyActivitiesDto,
  FindOneActivitiesDto,
  UpdateActivitiesDto,
} from './dto/activities.dto';

export interface Activitiy {
  create(activitiy: CreateActivitiesDto): Promise<Activities>;
  findOne(id: FindOneActivitiesDto): Promise<Activities | null>;
  findMany(course_id: FindManyActivitiesDto): Promise<Activities[] | []>;
  delete(id: FindOneActivitiesDto): Promise<Activities>;
  update(activities: UpdateActivitiesDto): Promise<Activities>;
  myActivities(idUser: FindActivitiesForUserDto): Promise<Activities[]>;
  myActivitiesSent(id_user: FindActivitiesForUserDto): Promise<Activities[]>;
  activitiesForEvaluation(
    id_activity: FindActivitiesForEvaluationDto,
  ): Promise<ActivitiesSent[]>;
}
