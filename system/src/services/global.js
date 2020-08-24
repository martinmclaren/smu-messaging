import request from 'umi-request';
import { HOST_URL } from "../settings";

export function login(data) {
  return request.post(`${HOST_URL}/rest-auth/login/`, {
    data: data
  });
}

export function getChat(username) {
  return request.get(`${HOST_URL}/chat/?username=${username}`)
}

export function user() {
  return request.get('/user');
}

export function getElectiveCourses() {
  return request.get('/course/list');
}
