import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from "@aws-sdk/client-s3";

// Configuração do cliente S3
const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

// Configuração do multer para usar o S3
const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
		// acl removido para evitar erro de ACL
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: function (req, file, cb) {
			const fileName = Date.now().toString() + '-' + file.originalname;
			cb(null, fileName);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
		}
	},
});

export default upload;
