import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    knex.schema.alterTable('transactions', (table) => {
        table.uuid('session-id').after('id').index()
    })
}


export async function down(knex: Knex): Promise<void> {
    knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('session-id')
    })
}

