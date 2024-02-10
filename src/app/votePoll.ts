import { FastifyInstance } from "fastify";
import {randomUUID} from "node:crypto"
import {db, rddb} from "../database/db";
import { z } from "zod";
import { voting } from "./utils/Vote";

export async function VotePoll(app: FastifyInstance) {
    
    app.post("/poll/:pollId/vote", async (req, res) => {
        try {
            const pollParams = z.object({
                pollId: z.string().uuid(),
            })
            const pollBody = z.object({
                optionId: z.string().uuid()
            })
            const { pollId } = pollParams.parse(req.params);
            const { optionId } = pollBody.parse(req.body);
            let { sessionId } = req.cookies;

            if (sessionId) {
                const userAlrealyVote = await db.vote.findUnique({
                    where: {
                        sessionId_pollsId: {
                            sessionId,
                            pollsId: pollId
                        }
                    }
                });
                if (userAlrealyVote && userAlrealyVote.pollOptionsId !== optionId) {
                    await db.vote.delete({
                        where: {
                            id: userAlrealyVote.id
                        }
                    })
                    const decrementVote = await rddb.zincrby(userAlrealyVote.pollsId, -1, userAlrealyVote.pollOptionsId);
                    voting.publish(pollId, {
                        pollOptionId: userAlrealyVote.pollOptionsId,
                        votes: 0
                    })
                }else if (userAlrealyVote) return res.status(401).send({
                    err: "you alrealy vote in this post"
                });
            }

            if (!sessionId) {
                sessionId = randomUUID();
                res.cookie("sessionId", sessionId, {
                    path: "/",
                    maxAge: 60 * 60 * 24 * 30, //30 days
                    signed: true,
                    httpOnly: true
                });
            }

            const vote = await db.vote.create({
                data: {
                    pollOptionsId: optionId,
                    sessionId,
                    pollsId: pollId
                }
            })
                
            const incrementVote = await rddb.zincrby(pollId, 1, optionId);


            voting.publish(pollId, {
                pollOptionId: optionId,
                votes: 1
            })

            return res.send({
                sucess: true,
                sessionId
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                sucess: false,
                err: "an error happened",
            })
        }
    });
}