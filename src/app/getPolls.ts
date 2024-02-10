import { FastifyInstance } from "fastify";
import {db, rddb} from "../database/db";
import { object, z } from "zod";

export async function GetPolls(app: FastifyInstance) {
    
    app.get("/poll/:pollId", async (req, res) => {
        try {
            const pollParams = z.object({
                pollId: z.string(),
            })
            const { pollId } = pollParams.parse(req.params);
            const poll = await db.polls.findUnique({
                where: {
                    id: pollId
                },
                include: {
                    options: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            });

            if (!poll) return res.status(404).send({
                sucess: false,
                msg: "poll not found"
            })

            const result = await rddb.zrange(pollId, 0, -1, "WITHSCORES");

            const allVotes = result.reduce((obj, content, index) => {
                if (index %2 ===0) {
                    const score = result[index+1];
                    Object.assign(obj, { [content]: Number(score) })
                }
                return obj;
            },{} as Record<string, number>);


            return res.send({
                sucess: true,
                poll: {
                    id: poll.id,
                    title: poll.title,
                    options: poll.options.map(options => ({
                        id: options.id,
                        title: options.title,
                        result: (options.id in allVotes)? allVotes[options.id]: 0
                    }))
                }
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                err: "an error happened",
            })
        }
    });
}