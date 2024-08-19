import { urlCronogram } from "./urls"
import { client } from "./Client.js";

export const GetCronogram = async (id = 0) => {
    const response = await client.get(urlCronogram(id))
    return response;
}
