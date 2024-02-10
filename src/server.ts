import fastify from "fastify";
import cookie from "@fastify/cookie";
import {CreatePolls} from "./app/createPolls";
import { GetPolls } from "./app/getPolls";
import { VotePoll } from "./app/votePoll";
import ws from "@fastify/websocket";
import { PollResults } from "./app/ws/pollResults";

const app = fastify();

app.register(cookie, {
    secret: "my-secret",
    hook: 'onRequest',
    parseOptions: {}
});

app.register(ws);

app.register(CreatePolls);
app.register(GetPolls);
app.register(VotePoll);
app.register(PollResults);

app.listen({port: 3030}).then(() => {
    console.log("Server ON");
});