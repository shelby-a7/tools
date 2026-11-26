import { defineAgent } from "eve";

export default defineAgent({
  model: "claude-opus-5-5",
  reasoning: { effort: "high" },
});
