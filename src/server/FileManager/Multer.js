import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import cloudinary from './CloudanaryConfig.js';

dotenv.config();


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'my-folder',
        allowedFormats: ['jpg', 'png', 'jpeg', 'mp4', 'mp3', 'wav'],
        resource_type: 'auto',
    },
});


const upload = multer({ storage });

export default upload;
