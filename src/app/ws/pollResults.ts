import { FastifyInstance } from "fastify";
import z from "zod";
import { voting } from "../utils/Vote";

export async function PollResults(app: FastifyInstance) {
    
    app.get("/poll/:pollId/results",{ websocket: true }, (conection, req) => {
        try {
            const pollParams = z.object({
                pollId: z.string().uuid(),
            })
            const { pollId } = pollParams.parse(req.params);
            
            conection.socket.send(pollId);

            voting.subscribe(pollId, (message) => {
                console.log(message);
                conection.socket.send(JSON.stringify(message));
            });

        } catch (err) {
            console.log(err);
            conection.socket.on("disconnect");
        }
    });
}