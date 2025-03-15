export interface BiasType {
  id: string;
  name: string;
  description: string;
  counteraction: string;
}

export const biasTypes: BiasType[] = [
  {
    id: "confirmation",
    name: "Confirmation Bias",
    description:
      "The tendency to search for, interpret, favor, and recall information in a way that confirms one's preexisting beliefs or hypotheses.",
    counteraction:
      "Actively seek out contradictory evidence and alternative viewpoints. Consider what might prove your beliefs wrong.",
  },
  {
    id: "anchoring",
    name: "Anchoring Bias",
    description:
      "The tendency to rely too heavily on the first piece of information encountered (the 'anchor') when making decisions.",
    counteraction:
      "Consider multiple reference points and deliberately challenge your initial impressions before making decisions.",
  },
  {
    id: "availability",
    name: "Availability Heuristic",
    description:
      "The tendency to overestimate the likelihood of events with greater 'availability' in memory, which can be influenced by how recent, unusual, or emotionally charged these events are.",
    counteraction:
      "Look for objective data rather than relying on examples that come easily to mind. Consider statistical evidence over anecdotes.",
  },
  {
    id: "survivorship",
    name: "Survivorship Bias",
    description:
      "The logical error of concentrating on people or things that made it past some selection process and overlooking those that did not, typically because of their lack of visibility.",
    counteraction:
      "Consider the 'silent evidence' - look for what you don't see and ask about failures, not just successes.",
  },
  {
    id: "bandwagon",
    name: "Bandwagon Effect",
    description:
      "The tendency to do or believe things because many other people do or believe the same.",
    counteraction:
      "Make decisions based on your own research and values, not just because something is popular or trending.",
  },
  {
    id: "dunning_kruger",
    name: "Dunning-Kruger Effect",
    description:
      "A cognitive bias in which people with limited knowledge or competence in a given intellectual or social domain greatly overestimate their competence.",
    counteraction:
      "Embrace a growth mindset, seek feedback from experts, and be open to recognizing the limits of your knowledge.",
  },
  {
    id: "negativity",
    name: "Negativity Bias",
    description:
      "The tendency to give more weight to negative experiences or information than positive ones.",
    counteraction:
      "Deliberately focus on positive aspects and achievements. Practice gratitude and balanced thinking.",
  },
  {
    id: "sunk_cost",
    name: "Sunk Cost Fallacy",
    description:
      "The tendency to continue an endeavor due to previously invested resources (time, money, effort) despite new evidence suggesting that the cost of continuing outweighs the benefits.",
    counteraction:
      "Focus on future costs and benefits rather than past investments when making decisions.",
  },
];
