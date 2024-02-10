import { FastifyInstance } from "fastify";
import {db} from "../database/db";
import { z } from "zod";

export async function CreatePolls(app: FastifyInstance) {
    
    app.post("/polls", async (req, res) => {
        try {
            const pollBody = z.object({
                title: z.string(),
                options: z.array(z.string())
            })
            const { title, options} = pollBody.parse(req.body);
            const poll = await db.polls.create({
                data: {
                    title,
                    options: {
                        createMany: {
                            data: options.map(option => ({
                                title: option,
                            })),
                        }
                    }
                }
            });

            return res.status(201).send({
                created: true,
                id: poll.id
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                err: "an error happened",
            })
        }
    });
}