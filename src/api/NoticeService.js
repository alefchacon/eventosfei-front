import { urlNotices, urlNoticesMarkAsUserRead } from "./urls";
import { client } from "./Client";

export const GetNotices = async (filters = []) => {
  console.log(client.defaults.headers.common["Authorization"])
  return await client.get(urlNotices);
}

export const UpdateNotice = async (idAviso=0) => {
  const body = {
    "id": idAviso,
    "visto": 1,
  }
  return await client.put(urlNotices, body);
}