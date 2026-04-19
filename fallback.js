export function getFallback(type, data, language = "en-IN") {

    const text = (data.problem || data.issue || "").toLowerCase();

    /* ================= LEGAL ================= */
    if (type === "legal") {
        return `
Applicable Laws:
- Indian Penal Code (IPC)
- Consumer Protection Act (if applicable)

Explanation:
Based on your issue, your legal rights may have been violated. Indian law provides protection against such situations.

Your Rights:
- You have the right to file a complaint
- You can seek legal compensation
- You can approach authorities for help

Steps to Take:
1. Collect all evidence (documents, messages, etc.)
2. File a complaint at the nearest police station or online portal
3. Consult a lawyer if needed
4. Follow up regularly

Precautions:
- Do not ignore the issue
- Keep copies of all documents
- Avoid verbal agreements
`;
    }

    /* ================= RISK ================= */
    if (type === "risk") {
        return `
Risk Level:
Moderate to High Risk

Legal Risks:
- You may face legal action depending on the situation
- There could be penalties or fines

Financial Risk:
- Possible loss of money if the case goes against you

Chances of Success:
- Depends on available evidence and legal support

Recommendation:
1. Avoid escalation of the situation
2. Consult a lawyer immediately
3. Keep all evidence safe
4. Act legally and responsibly
`;
    }

    /* ================= COMPLAINT ================= */
    if (type === "complaint") {
        return `
To,
Concerned Authority

Subject: Complaint regarding the issue

Respected Sir/Madam,

I would like to bring to your attention that ${data.issue}.

This situation has caused inconvenience and requires immediate action. I request you to kindly investigate this matter and take necessary legal action.

I have attached all relevant details and evidence for your reference.

Kindly do the needful at the earliest.

Thanking you.

Yours sincerely,
Citizen
`;
    }

    /* ================= GOVT ================= */
    if (type === "govt") {
        return `
Eligibility:
You may be eligible for free legal aid services under Indian law.

Available Schemes:
- Legal Services Authority (Free Legal Aid)
- Women & Child Welfare Schemes
- Labour Welfare Programs

Authorities to Approach:
- District Legal Services Authority (DLSA)
- Local Government Offices
- Police Station (if required)

Required Documents:
- Identity proof
- Address proof
- Supporting evidence

Next Steps:
1. Visit nearest legal services office
2. Submit your complaint
3. Follow up regularly
`;
    }

    /* ================= LAWYER ================= */
    if (type === "lawyer") {
        return `
Recommended Options:

1. District Legal Services Authority
   - Provides free legal help
   - Suitable for all citizens

2. Local Lawyers
   - Available in court complexes
   - Specialization based on your case

3. NGOs
   - Offer legal assistance and support

Steps:
1. Visit nearby court complex in ${data.location}
2. Explain your issue clearly
3. Choose a suitable lawyer or NGO
4. Proceed legally
`;
    }

    return "No response available.";
}