const knex = require('../database/knex');

class NotesController {
    async create(request, response) {
        const { title, description, tags, links } = request.body;
        const { user_id } = request.params;

        const note_id = await knex('notes').insert({
            title,
            description, 
            user_id
        });

        const linksInsert = links.map(link => {
            return {
                note_id,
                url: link
                }
        });

        await knex("links").inser(linksInsert);

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
                }
        });

        await knex("tags").inser(tagsInsert);

        return response.json();
    }

    async 
}