import { client } from "./Client";
import { urlProgramasEducativos } from "./urls";

export const GetProgramasEducativos = async () => {
  return await client.get(urlProgramasEducativos);
}