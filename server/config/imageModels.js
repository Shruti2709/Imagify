import axios from "axios";
import FormData from "form-data";

// Pluggable AI image-generation model registry.
// Each entry implements generate(prompt) -> Promise<string> (a base64 data URL or a hosted image URL).
// To add another provider (e.g. OpenAI/DALL-E, Stability AI), add a new key here
// with its own generate() implementation and API key in .env.

const generateWithClipdrop = async (prompt) => {
    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
        headers: {
            'x-api-key': process.env.CLIPDROP_API,
        },
        responseType: 'arraybuffer'
    });

    const base64Image = Buffer.from(data, 'binary').toString('base64');
    return `data:image/png;base64,${base64Image}`;
};

const generateWithPollinations = async (prompt) => {
    // Pollinations.ai offers a free, no-API-key text-to-image endpoint.
    // We fetch the bytes and convert to base64 so it's stored/served the same way as other models.
    const seed = Math.floor(Math.random() * 1_000_000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;

    const { data } = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
    const base64Image = Buffer.from(data, 'binary').toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
};

export const imageModels = {
    clipdrop: {
        label: 'Clipdrop (Stable Diffusion)',
        generate: generateWithClipdrop
    },
    pollinations: {
        label: 'Pollinations (Flux)',
        generate: generateWithPollinations
    }
};

export const getAvailableModels = () =>
    Object.entries(imageModels).map(([id, m]) => ({ id, label: m.label }));

export default imageModels;
