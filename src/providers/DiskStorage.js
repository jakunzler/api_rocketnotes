const fs = require('fs');

const path = require('path');

const uploadConfig = require('../config/upload');

const AppError = require('../utils/AppError');

class DiskStorage {
    async saveFile(file) {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file.filename);

        const newPath = path.resolve(uploadConfig.uploadsFolder, file.filename);

        await fs.promises.rename(originalPath, newPath);

        return file;
    }

    async deleteFile(file) {
        const filePah = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

        try {
            await fs.promises.stat(filePah);
        } catch {
            throw new AppError('File not found', 404);
        };

        await fs.promises.unlink(filePah);

    }
}

module.exports = DiskStorage;