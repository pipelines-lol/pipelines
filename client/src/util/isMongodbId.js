import { host } from "./apiRoutes";

export const isMongoDBId = async (id) => {
    try {
        const response = await fetch(`${host}/api/mongodbId/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.error}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error(error.message);
        return true;
    }
}