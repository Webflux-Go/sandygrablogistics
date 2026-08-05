/**
 * Shared by the FAQ accordion and the FAQPage structured data, so the answers Google indexes
 * are always the answers on the page — Google penalises structured data that doesn't match
 * visible content.
 */
export const FAQS = [
  {
    question: "What types of freight services do you offer?",
    answer:
      "We provide air freight (4–7 days) and sea freight (45 days) from Turkey, plus factory inspection before shipping, cargo consolidation, customs clearance, and door-to-door delivery worldwide.",
  },
  {
    question: "How do I track my shipment?",
    answer:
      "Once your shipment is confirmed, you'll receive a tracking number and link so you can monitor its status in real time, from pickup to delivery.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes. We ship worldwide from Turkey, and our global network of partners lets us handle customs, documentation, and delivery to major markets.",
  },
  {
    question: "How can I request a shipping quote?",
    answer:
      "Message us on WhatsApp with your shipment details and our team will get back to you with pricing within one business day.",
  },
  {
    question: "Where are you located?",
    answer:
      "We have a sourcing office in Esenyurt, Istanbul, Turkey, and a warehouse in Ajao Estate, Lagos, Nigeria, where you can collect your goods or have them delivered.",
  },
  {
    question: "Can I see the products before they ship?",
    answer:
      "Yes. We inspect every order at the factory before dispatch, and you can join a live video call from the factory to see exactly what you're buying.",
  },
] as const;
