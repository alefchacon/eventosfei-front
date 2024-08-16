import { urlNotices, urlNoticesMarkAsUserRead } from "./urls";
import { client } from "./Client";

export const GetNotices = async (page) => {
  return await client.get(urlNotices.concat(`page=${page}`));
}
export const GetNoticeAmount = async () => {
  return await client.get(urlNotices.concat("?soloCantidad=true"));
}

export const UpdateNotice = async (idAviso=0) => {
  const body = {
    "id": idAviso,
    "visto": 1,
  }
  return await client.put(urlNotices, body);
}