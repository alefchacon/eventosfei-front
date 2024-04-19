import { urlEvents, urlNotifications } from "./urls"
import { client } from "./Client";

export const GetEvents = async () => {
    const response = await client.get(urlEvents)
    return response;
}
export const GetNotifications = async () => {
    const response = await client.get(urlNotifications)
    return response;
}