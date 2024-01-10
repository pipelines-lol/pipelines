const aws = require('aws-sdk');

// Configure AWS SDK with your credentials and region
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION,
});
  
// Create an instance of Rekognition
const rekognition = new aws.Rekognition();

const recognizeImage = async (req, res) => {
    try {
        // if there is no file, then no changes will be made
        if (!req.file) {
            return res.status(200).json(profile);
        }
        let { buffer } = req.file
    
        // Perform Rekognition operation
        const moderationResult = await moderateImage(buffer);
    
        // Send the result back to the client
        res.json({ moderationResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function moderateImage(binaryData) {
    const params = {
        Image: {
            Bytes: binaryData,
        },
        MinConfidence: 70,
    };

    try {
        const { ModerationLabels } = await rekognition.detectModerationLabels(params).promise();

        // If no labels found -> image doesn't contain any forbidden content
        if (!ModerationLabels || ModerationLabels.length === 0) {
            return [];
        }

        // If some labels found -> compare them with forbidden labels
        const forbiddenLabels = ['Explicit Nudity', 'Violence', 'Visually Disturbing', 'Rude Gestures', 'Tobacco', 'Gambling', 'Hate Symbols'];
        const labels = ModerationLabels.map((label) => label.ParentName).filter(Boolean);
        const foundForbiddenLabels = labels.filter((label) => forbiddenLabels.includes(label));

        return foundForbiddenLabels;
    } catch (error) {
        console.error(`Error in image moderation: ${error}`);
        throw error;
    }
}

module.exports = {
    recognizeImage
}
