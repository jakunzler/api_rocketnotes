const fs = require('fs');

const path = require('path');

const uploadConfig = require('../configs/upload');

const AppError = require('../utils/AppError');

class DiskStorage {
    async saveFile(file) {

        const originalPath = path.resolve(uploadConfig.TMP_FOLDER, file);

        const newPath = path.resolve(uploadConfig.UPLOAD_FOLDER, file);

        await fs.promises.rename(originalPath, newPath);

        return file;
    }

    async deleteFile(file) {
        const filePath = path.resolve(uploadConfig.UPLOAD_FOLDER, file);

        try {
            await fs.promises.stat(filePath);
        } catch {
            throw new AppError('File not found', 404);
        };

        await fs.promises.unlink(filePath);

    }
}

module.exports = DiskStorage;