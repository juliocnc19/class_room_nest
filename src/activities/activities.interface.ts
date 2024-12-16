import { Activities, ActivitiesSent } from '@prisma/client';
import {
  AssessActivityDto,
  CreateActivitiesDto,
  SendActivityDto,
  UpdateActivitiesDto,
} from './dto/activities.dto';
import { ApiResponse } from 'src/utils/responseHttpUtils';

export interface Activitiy {
  create(activitiy: CreateActivitiesDto): Promise<ApiResponse<Activities>>;
  findOne(id: number): Promise<ApiResponse<Activities | null>>;
  findMany(course_id: number): Promise<ApiResponse<ActivityResponse[] | []>>;
  delete(id: number): Promise<ApiResponse<Activities>>;
  update(activities: UpdateActivitiesDto): Promise<ApiResponse<Activities>>;
  myActivities(idUser: number): Promise<ApiResponse<Activities[]>>;
  myActivitiesSent(id_user: number): Promise<ApiResponse<Activities[]>>;
  activitiesForEvaluation(id_activity: number): Promise<ApiResponse<ActivitiesSent[]>>;
  sendActivity(activitiy: SendActivityDto): Promise<ApiResponse<ActivitiesSent>>;
  activitiesSendForStudenInCourse(
    user_id: number,
    course_id: number,
  ): Promise<ApiResponse<ActivitiesSent[]>>;
  findAll(): Promise<ApiResponse<Activities[] | []>>;
  assessActivity(data: AssessActivityDto): Promise<ApiResponse<ActivitiesSent>>;
}
