import { Router } from "../http.js";
import { requireRole } from "../auth.js";
import { caseStudies } from "../collections.js";
import type { CaseStudy } from "../../src/types/ndh.js";

export const caseStudiesRouter = Router();

// Public: the case studies page, homepage spotlight, and hero carousel all
// read from here instead of importing static data straight into the client
// bundle. Anyone can view published case studies -- this is marketing
// content, not sensitive data.
caseStudiesRouter.get("/", (_req, res) => {
  res.json({ caseStudies: caseStudies.all() });
});

caseStudiesRouter.get("/:id", (req, res) => {
  const found = caseStudies.find((c) => c.id === req.params["id"]);
  if (!found) {
    res.status(404).json({ error: "Case study not found." });
    return;
  }
  res.json({ caseStudy: found });
});

// Admin-only from here down: creating, editing, and retiring a case study
// is an editorial/business decision, not something any logged-in user
// should be able to trigger.
caseStudiesRouter.post("/", requireRole("super_admin"), (req, res) => {
  const body = req.body as Partial<CaseStudy> | undefined;

  if (!body || !body.title || !body.clientName || !body.department) {
    res.status(400).json({ error: "title, clientName, and department are required." });
    return;
  }

  const newCaseStudy: CaseStudy = {
    id: `cs-${Date.now()}`,
    slug:
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    title: body.title,
    clientName: body.clientName,
    isAnonymized: body.isAnonymized ?? false,
    industry: body.industry || "",
    department: body.department,
    ...(body.year ? { year: body.year } : {}),
    location: body.location || "Nigeria",
    ...(body.projectDuration ? { projectDuration: body.projectDuration } : {}),
    ...(body.summary ? { summary: body.summary } : {}),
    ...(body.leadPM ? { leadPM: body.leadPM } : {}),
    ...(body.teamSize !== undefined ? { teamSize: body.teamSize } : {}),
    heroImage: body.heroImage || "",
    galleryImages: body.galleryImages || [],
    challenge: body.challenge || "",
    insight: body.insight || "",
    strategy: body.strategy || "",
    process: body.process || "",
    solution: body.solution || "",
    measurableOutcomes: body.measurableOutcomes || [],
    ...(body.testimonial ? { testimonial: body.testimonial } : {}),
    techStack: body.techStack || [],
    featured: body.featured ?? false,
    status: body.status || "published",
    clientApprovalRecorded: body.clientApprovalRecorded ?? false,
    publishedDate: body.publishedDate || new Date().toISOString().slice(0, 10),
    ...(body.liveUrl ? { liveUrl: body.liveUrl } : {}),
    ...(body.liveUrlLabel ? { liveUrlLabel: body.liveUrlLabel } : {}),
  };

  caseStudies.insert(newCaseStudy, "end");
  res.status(201).json({ caseStudy: newCaseStudy });
});

caseStudiesRouter.put("/:id", requireRole("super_admin"), (req, res) => {
  const body = req.body as Partial<CaseStudy> | undefined;
  if (!body) {
    res.status(400).json({ error: "Request body is required." });
    return;
  }
  const updated = caseStudies.update(
    (c) => c.id === req.params["id"],
    (current) => ({ ...current, ...body, id: current.id }),
  );
  if (!updated) {
    res.status(404).json({ error: "Case study not found." });
    return;
  }
  res.json({ caseStudy: updated });
});

caseStudiesRouter.delete("/:id", requireRole("super_admin"), (req, res) => {
  const removed = caseStudies.remove((c) => c.id === req.params["id"]);
  if (removed === 0) {
    res.status(404).json({ error: "Case study not found." });
    return;
  }
  res.status(204).end();
});
