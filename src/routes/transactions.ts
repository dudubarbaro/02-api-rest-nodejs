import type { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"
import crypto from "node:crypto"

export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        const transactions = await knex('transactions').select()

        return {
            transactions,
        }
    })

    app.get('/:id', async (request) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        const transaction = await knex('transactions').select().where('id', id).first()

        return {
            transaction,
        }
    })

    app.post('/', async(request, reply) => {
        // { title, amount, type: credit or debit }

        const crateTransactionBodySchema  = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = crateTransactionBodySchema.parse(
            request.body,
        )

        await knex('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            
        })

        return reply.status(201).send()
    })
}