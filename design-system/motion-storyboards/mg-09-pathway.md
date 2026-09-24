# MG-9 — Certification pathway (School landing)

**Job:** explain the route from beginner to certified coder.
**Trigger:** 30% of the component in view, once. **Tech:** Motion — built as `components/motion/pathway-line.tsx` (live in /styleguide → Motion).
**Stages:** Foundations → Billing → Coding → Exam prep → Certified.

| # | Time | Frame (desktop: horizontal; mobile: vertical) |
|---|---|---|
| 1 | 0ms (SSR) | All five stage labels and descriptions visible; grey connector; grey outlined nodes. |
| 2 | 0ms | Node 1 scales 0.6→1 and fades in. |
| 3 | 0–1000ms | The teal connector grows from node 1 toward the learner's current stage (`scaleX`, `dur.story`, `ease.standard`). |
| 4 | 250 / 500 / 750ms | Nodes 2–4 pop in as the line reaches them (`dur.base`, `ease.enter`). Completed nodes fill teal with a check. |
| 5 | at current stage | The current node shows a teal ring glow (static 4px ring, no pulsing loop). |
| 6 | 1000ms | Final node "Certified": grey outline for prospects; solid gold with a check once the learner is certified. |

On the public School page the pathway shows the generic route (current = 0, only node 1 active). In the student dashboard it shows the student's real position.

**Reduced motion:** final state immediately. **Screen readers:** an ordered list; the current stage has `aria-current="step"`; each stage announces "Completed", "Current stage" or "Not started".
