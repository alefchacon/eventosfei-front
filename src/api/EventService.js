import { urlEvents, urlNotifications } from "./urls"

export const GetEvents = async () => {
    const response = await fetch (urlEvents, {
        method: 'GET', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
    });
    return response;
}
export const GetNotifications = async () => {
    const response = await fetch (urlNotifications, {
        method: 'GET', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
    });
    return response;
}