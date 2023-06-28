import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('recipes', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description')
    table.boolean('diet_conform').notNullable()
    table.timestamp('created_at').notNullable()
    table.text('user_id').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('recipes')
}

