import { request } from '@/config/axios';
import { AxiosRequestConfig } from 'axios';

export function apiGetProject(queryParams: ApiProject.ProjectsParams) {
  return request.get<ApiProject.Projects>('/project', { params: queryParams });
}

export function apiGetProjectInfo(id: string, config?: AxiosRequestConfig) {
  return request.get<ApiProject.Project>(`/project/${id}`, config);
}

export function apiGetProjectNews(id: string, config?: AxiosRequestConfig) {
  return request.get<ApiProject.News[]>(`/project/${id}/news`, config);
}

export function apiGetProjectFAQs(id: string, config?: AxiosRequestConfig) {
  return request.get<ApiProject.FAQ[]>(`/project/${id}/faqs`, config);
}

export function apiGetProjectMessage(
  projectId: string,
  pageIndex: number,
  pageSize: number
) {
  return request.get<ApiMessage.Chatroom[] | ApiMessage.EmptyChatroom>(
    `/project/${projectId}/message`,
    {
      params: {
        pageIndex,
        pageSize
      }
    }
  );
}
