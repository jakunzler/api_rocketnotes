const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");
const sqliteConnection = require('../database/sqlite');

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConnection();
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(checkUserExists) {
            throw new AppError("User already exists");
        };

        const passwordHash = await hash(password, 8);

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, passwordHash]);

        response.status(201).json();
    }
    
    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        if(!user) {
            throw new AppError("User does not exist.");
        };

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Email already in use.");
        };

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password) {
            throw new AppError("Old password is required.");
        };

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if(!checkOldPassword) {
                throw new AppError("Old password does not match.");
            };

            user.password = await hash(password, 8);

        };

        await database.run(`
        UPDATE users SET 
        name = (?), 
        email = (?), 
        password = (?),
        updated_at = DATETIME('now')
        WHERE id = (?)`, 
        [user.name, user.email, user.password, user_id]);

        response.status(200).json();
    }
}

module.exports = UsersController;