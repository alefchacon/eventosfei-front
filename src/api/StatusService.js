import { urlStatus } from "./urls"
import { client } from "./Client";

export const GetStatus = async () => {
    const response = await client.get(urlStatus)
    return response;
}
