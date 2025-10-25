import multer from 'multer';

/**
 * Multer configuration for handling file uploads.
 * Files are stored in the 'data' directory with a timestamped filename.
 * Only JPEG, JPG, and PNG file types are allowed.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'data');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

/**
 * Ensures only specific file types are accepted.
 * @param {*} req - request object
 * @param {*} file - file object containing file details
 * @param {*} cb - callback to indicate acceptance or rejection
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
  }
};

// Initialize multer with the defined storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;