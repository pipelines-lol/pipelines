const Profile = require('../models/profileModel')
const mongoose = require('mongoose')
const crypto = require('crypto')

// const sharp = require('sharp')

const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const BUCKET_NAME = process.env.BUCKET_NAME
const BUCKET_REGION = process.env.BUCKET_REGION
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    region: BUCKET_REGION 
})

const getPfp = async (req, res) => {
    const { id } = req.params

    const profile = await Profile.findById(id);

    if (!profile) {
        return res.status(404).json({ error: 'No such Profile.' });
    }

    const pfp = profile.pfp

    if (!pfp) {
        return res.status(404).json({ error: 'No such profile picture.' });
    } else if (pfp === "") {
        return res.status(200).json({ pfp: "" });
    }

    const getObjectParams = {
        Bucket: BUCKET_NAME,
        Key: pfp
    }

    const command = new GetObjectCommand(getObjectParams)
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

    res.status(200).json({ pfp: url });
}

const updatePfp = async (req, res) => {
    const { id } = req.params

    let profile = await Profile.findOne({ _id: id });

    if (!profile) {
        return res.status(404).json({ error: 'No such Profile.' });
    }

    // if there is no file, then no changes will be made
    if (!req.file) {
        return res.status(200).json(profile);
    }
    let { buffer, mimetype } = req.file

    // resize image
    // const buffer = sharp(buffer).resize({ 
    //     height: 320, 
    //     width: 320, 
    //     fit: "contain"
    // }).toBuffer()

    let imageName;
    if (profile.pfp === "") {
        imageName = randomImageName()
    } else {
        imageName = profile.pfp
    }

    const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Body: buffer,
        ContentType: mimetype
    }

    const command = new PutObjectCommand(params)
    await s3.send(command)

    // save image name (key) to mongodb
    const pfpData = { pfp: imageName }
    profile = await Profile.findOneAndUpdate({ _id: id }, pfpData, { new: true });

    if (!profile) {
        return res.status(404).json({ error: 'No such Profile.' });
    }

    res.status(200).json(profile);
}

module.exports = {
    getPfp,
    updatePfp
}