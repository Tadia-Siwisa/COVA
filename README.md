# Cova — Decision-support portfolio prototype

Created by Tadia Siwisa. Developed through iterative, AI-assisted prototyping in Google AI Studio and prepared for standalone static hosting.

## The problem
Business information is scattered across financial, customer and operational records. Cova explores how a CEO could inspect a connected view of the business and open a thinking-partner conversation from a relevant metric or page.

## Explore
The existing interface includes the current-state dashboard, financial, cash and debt, customer, operations and growth views, metric drilldowns, source tables and contextual conversations. Nala Energy is a fictional company used to demonstrate the design.

## Demonstration boundaries
- Figures, business records and freshness indicators are simulated.
- Chat uses predefined, keyword-based examples, not a live language model. It does not reason over user edits or retain an ongoing model conversation.
- Uploads demonstrate the interaction using file names; contents are not parsed or sent to a server. Completing the flow loads sample data.
- Edits are browser-session interactions, not a durable company database.
- Real ingestion, integrations, authenticated company workspaces and grounded model responses are future work.

## Run locally
Requires a current Node.js LTS release and npm.

```sh
npm install
npm run dev
```

```sh
npm run typecheck
npm run build
npm run preview
```

The production output is `dist/`. This portfolio version needs no model API key or application server. The relative asset base supports hosting under a repository path.

## Design rationale
Preserve the carefully developed interface, connect high-level metrics with underlying example records, and allow users to explore a question in context. The portfolio version prioritizes immediate exploration and honest disclosure of what is simulated.
