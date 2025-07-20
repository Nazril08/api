export async function removeBackground(imageBuffer) {
    try {
        if (!Buffer.isBuffer(imageBuffer)) throw new Error(`Invalid buffer`);

        const body = new FormData();
        body.append("format", "png");
        body.append("model", "v1");
        body.append("image", new Blob([imageBuffer]), "image.png");

        const response = await fetch("https://api2.pixelcut.app/image/matte/v1", {
            headers: {
                "x-client-version": "web"
            },
            body,
            "method": "post"
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${response.status} ${response.statusText}\n${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const result = Buffer.from(arrayBuffer);
        return result;

    } catch (err) {
        if (err.response) {
            console.error('Error Response Data:', err.response.data);
            throw new Error(`External API Error: Status ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        }
        throw new Error(err.message);
    }
} 