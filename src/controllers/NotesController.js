const knex = require('../database/knex');

class NotesController {
    async create(request, response) {
        try {
            const { title, description, rate, tags, links } = request.body;
            const user_id = request.user.id;

            const [note_id] = await knex('notes').insert({
                title,
                description,
                rate,
                user_id
            });

            const linksInsert = links.map(link => {
                return {
                    note_id,
                    url: link
                }
            });

            // Aguarda a inserção dos links
            await knex('links').insert(linksInsert);

            const tagsInsert = tags.map(name => {
                return {
                    note_id,
                    name,
                    user_id
                }
            });

            // Aguarda a inserção das tags
            await knex('tags').insert(tagsInsert);

            return response.json({ message: "Notas, links e tags criados com sucesso!" });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Ocorreu um erro ao criar as notas, links e tags." });
        }
    };

    async show(request, response) {
        const { id } = request.params;

        const note = await knex('notes')
        .where({ id })
        .first();

        const user = await knex('users')
        .where({ id: note.user_id })
        .first();

        const tags = await knex('tags')
        .where({ note_id: id })
        .orderBy("name");

        const links = await knex('links')
        .where({ note_id: id })
        .orderBy("created_at");

        return response.json({
            ...note,
            user,
            tags,
            links
        });
    };

    async delete(request, response) {
        const { id } = request.params;

        await knex('notes')
        .where({ id })
        .delete();

        return response.status(204).json();
    };

    async index(request, response) {
        const { title } = request.body;

        const notes = await knex("users")
        .join("notes", "notes.user_id", "users.id")
        .where("notes.title", "like", `%${title || " "}%`);
      
        const notesWithTagsAndLinks = await Promise.all(
            notes.map(async (note) => {
            const tags = await knex("tags")
                .where("note_id", note.id);
        
            const links = await knex("links")
                .where("note_id", note.id);
        
            return {
                ...note,
                tags,
                links,
            };
            })
        );
        return response.json(notesWithTagsAndLinks);
    };
}

module.exports = NotesController;