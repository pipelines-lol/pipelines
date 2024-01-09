const Profile = require('../models/profileModel')
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })