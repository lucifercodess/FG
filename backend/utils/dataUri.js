import DataUriParser from 'datauri/parser.js';
import path from 'path';

const parser = new DataUriParser();

export const getDataUri = (file) => {
  // Get the file extension without the leading dot (e.g., 'jpg', 'png')
  const extName = path.extname(file.originalname).slice(1); 
  // Convert buffer to Data URI
  return parser.format(extName, file.buffer).content;
};
