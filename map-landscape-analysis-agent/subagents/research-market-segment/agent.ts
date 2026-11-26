import { defineAgent } from "eve";

export default defineAgent({
  model: "claude-sonnet-5-5",
  reasoning: { effort: "high" },
});
