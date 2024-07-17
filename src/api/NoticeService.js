import { urlNotices, urlNoticesMarkAsUserRead } from "./urls";
import { client } from "./Client";

export const GetNotices = async (filters = []) => {
  let url = urlNotices
  filters.forEach(filter => {
    url = url.concat(filter,"&")
  })
  return await client.get(url);
}

export const MarkAsUserRead = async (notices, forStaff) => {
  const body = {
    "notices": notices,
  }
  const url = urlNoticesMarkAsUserRead;
  if (forStaff){
    url.concat("?type=staff")
  }
  return await client.post(urlNoticesMarkAsUserRead, body);
}