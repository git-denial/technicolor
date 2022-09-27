// Load dependencies
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

//const csv = require('csvtojson')

//put on other file
aws.config = new aws.Config();
aws.config.accessKeyId = process.env.SPACES_ACCESS_KEY_ID
aws.config.secretAccessKey = process.env.SPACES_SECRET_ACCESS_KEY

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(<string>process.env.AWS_ENDPOINT);

// Creating s3 instance
const s3 = new aws.S3({
    endpoint: spacesEndpoint
});

// Creating uploader. Receives field with key "upload"
// request must also include uploadPurpose and uploader userId
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.SPACES_BUCKET_NAME,
        acl: 'public-read',
        key: function (req:any, file: any, cb: any) {
            let purpose = req.info.purpose;
            let id = 0//req.info.id
            let preparedKey = `technicolor/uploads/${purpose}/${id}/${Date.now()}-${file.originalname}`
            console.log(req.info, "Prepared key: " + preparedKey)
            cb(null, preparedKey);
        }
    }),
    fileFilter: (req: any, file: any, cb: any) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(new Error("File format should be PNG,JPG,JPEG"), false); // if validation failed then generate error
        }
    }
}).single('upload')

const uploadImageForTierTwoEntity  = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.SPACES_BUCKET_NAME,
        acl: 'public-read',
        key: function (req:any , file: any, cb:any) {

            let { tierTwoEntity, tierTwoEntityId,purpose } = req.info

            let fileNameSplit = file.originalname.split('.');

            let fileType = fileNameSplit[fileNameSplit.length-1]

            let preparedKey = `${tierTwoEntity}/${tierTwoEntityId}/${purpose}/${Date.now()}.${fileType}`;
            console.log(req.info, "Prepared key: " + preparedKey)
            cb(null, preparedKey);

        }
    }),
    fileFilter: (req:any, file:any, cb:any) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(new Error("File format should be PNG,JPG,JPEG"), false); // if validation failed then generate error
        }
    }
}).single('upload')

const uploadEmailAttachment = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.SPACES_BUCKET_NAME,
        acl: 'public-read',
        key: function (req:any, file:any, cb:any) {
            let purpose = "attachment";
            let id = req.info.id
            let preparedKey = `${purpose}/${id}/${Date.now()}/${file.originalname}`
            console.log(req.info, "Prepared key: " + preparedKey)
            cb(null, preparedKey);
        }
    }),
    fileFilter:(req:any, file:any, cb:any)=> {

        console.log("file is " + JSON.stringify(file))

        if (
            mimeType.includes(file.mimetype)
        ) {
            cb(null, true);
        } else {
            cb(new Error("File format "+file.mimetype+" is not supported"), false); // if validation failed then generate error
        }
    }
}).single('upload')

const mimeType = `audio/aac
            video/x-msvideo
            text/csv
            application/msword
            application/epub+zip
            image/gif
            image/x-icon
            image/jpeg
            application/json
            audio/midi
            video/mpeg
            audio/ogg
            video/ogg
            application/ogg
            application/pdf
            application/vnd.ms-powerpoint
            application/x-rar-compressed
            application/rtf
            image/svg+xml
            application/x-shockwave-flash
            application/x-tar
            image/tiff
            font/ttf
            audio/x-wav
            audio/webm,.weba
            video/webm,.webm
            image/webp,.webp
            font/woff,.woff
            font/woff2,.woff2
            application/vnd.ms-excel
            application/xml
            application/vnd.mozilla.xul+xml
            application/zip
            video/3gpp
            video/3gpp2
            application/x-7z-compressed`


export default{
    upload,
    uploadImageForTierTwoEntity,
    uploadEmailAttachment,
    s3
}
