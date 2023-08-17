export const fetchResponse = async (apiUrl) => {
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    return data;
};