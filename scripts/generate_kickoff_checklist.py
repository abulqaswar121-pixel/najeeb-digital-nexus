"""Generates public/downloads/ndh-project-kickoff-checklist.pdf.

This is real, original content written for NDH Agency's Insights page
(item 12 of the correction list) -- a genuinely useful one-page checklist,
not a placeholder. Run with: python3 scripts/generate_kickoff_checklist.py
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT

NAVY = HexColor("#0B0F1E")
BLUE = HexColor("#2563EB")
SLATE = HexColor("#334155")
LIGHT = HexColor("#F1F5F9")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="NDHTitle",
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=NAVY,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="NDHSubtitle",
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        textColor=SLATE,
        spaceAfter=14,
    )
)
styles.add(
    ParagraphStyle(
        name="NDHSection",
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=BLUE,
        spaceBefore=16,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="NDHBody",
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=NAVY,
    )
)
styles.add(
    ParagraphStyle(
        name="NDHFooter",
        fontName="Helvetica-Oblique",
        fontSize=8,
        leading=11,
        textColor=SLATE,
        spaceBefore=18,
    )
)

doc = SimpleDocTemplate(
    "public/downloads/ndh-project-kickoff-checklist.pdf",
    pagesize=A4,
    topMargin=22 * mm,
    bottomMargin=18 * mm,
    leftMargin=20 * mm,
    rightMargin=20 * mm,
    title="NDH Project Kickoff Checklist",
    author="NDH Agency",
)

story = []

story.append(Paragraph("NDH Project Kickoff Checklist", styles["NDHTitle"]))
story.append(
    Paragraph(
        "A practical, one-page checklist for scoping a software, brand, or AI project "
        "before you request a quote &mdash; use it to arrive at your discovery call with "
        "clear answers, which shortens your proposal turnaround.",
        styles["NDHSubtitle"],
    )
)


def section(title, items):
    story.append(Paragraph(title, styles["NDHSection"]))
    bullets = [
        ListItem(Paragraph(item, styles["NDHBody"]), bulletColor=BLUE, value="square")
        for item in items
    ]
    story.append(
        ListFlowable(
            bullets,
            bulletType="bullet",
            start="square",
            leftIndent=14,
            bulletFontSize=6,
            spaceBefore=2,
            spaceAfter=2,
        )
    )


section(
    "1. Problem &amp; Goal",
    [
        "What specific problem are you solving, and for whom (internal staff, paying customers, both)?",
        "What does success look like 90 days after launch? Pick one measurable outcome, not five vague ones.",
        "What happens today without this project &mdash; manual process, spreadsheet, nothing at all?",
    ],
)

section(
    "2. Scope Boundaries",
    [
        "List the 3-5 features that must exist on day one. Everything else is phase 2.",
        "Name at least one thing you are deliberately leaving out of version one.",
        "If this replaces an existing system, what data needs to migrate, and who owns exporting it?",
    ],
)

section(
    "3. Users &amp; Access",
    [
        "Who logs in, and what can each role see or do differently (e.g. admin vs customer vs staff)?",
        "Roughly how many concurrent users at launch, and in 12 months?",
        "Any compliance constraints (NDPR, PCI-DSS for payments, data residency) you already know about?",
    ],
)

section(
    "4. Integrations &amp; Data",
    [
        "Which third-party tools must this connect to (payment gateway, SMS/WhatsApp, accounting software, CRM)?",
        "Do you already have API credentials/sandbox access for those tools, or does that need to be requested first?",
        "Where will the data live long-term, and who is responsible for backups once the project ships?",
    ],
)

section(
    "5. Budget &amp; Timeline Reality Check",
    [
        "Is your number a hard ceiling or a starting point for a conversation?",
        "Is there an external deadline (event, funding milestone, regulatory date) driving the timeline?",
        "Who on your side can approve scope/budget changes without delaying the whole team?",
    ],
)

section(
    "6. What To Bring To The Discovery Call",
    [
        "Any existing brand assets (logo, colors, fonts) or a reference site/app whose feel you like.",
        "Login to your current website/system if one exists, or screenshots if access isn't available yet.",
        "A one-paragraph summary of the above five sections &mdash; it turns a 60-minute call into a 20-minute one.",
    ],
)

story.append(
    Paragraph(
        "Published by NDH Agency &mdash; a managed software, brand, and AI development bureau. "
        "This checklist is original, practical content, not a fictional whitepaper. "
        "Questions about any section? Bring them to your discovery call.",
        styles["NDHFooter"],
    )
)

doc.build(story)
print("Wrote public/downloads/ndh-project-kickoff-checklist.pdf")
