import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleDollarSign, FileText, HelpCircle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

const FLOW = {
  start: {
    id: "start",
    type: "question",
    title: "What do you need help with?",
    subtitle: "Answer a few questions and we will guide you to the right service, estimated pricing, and next steps.",
    options: [
      { label: "New Company Setup", next: "setup_activity" },
      { label: "Visa Services", next: "visa_type" },
      { label: "License Renewal", next: "renewal_status" },
      { label: "I am not sure", next: "unclear_need" },
    ],
  },
  setup_activity: {
    id: "setup_activity",
    type: "question",
    title: "What type of business activity are you planning?",
    subtitle: "This helps identify the likely license category and document requirements.",
    options: [
      { label: "Consultancy / Professional Service", next: "setup_visa" },
      { label: "Trading / E-commerce", next: "setup_visa" },
      { label: "Media / Marketing / IT", next: "setup_visa" },
      { label: "Not sure yet", next: "setup_consultation" },
    ],
  },
  setup_visa: {
    id: "setup_visa",
    type: "question",
    title: "Do you need visa allocation with the license?",
    subtitle: "Visa allocation affects the package and pricing estimate.",
    options: [
      { label: "No visa required", next: "result_setup_no_visa" },
      { label: "1 visa required", next: "result_setup_one_visa" },
      { label: "2 or more visas required", next: "result_setup_multi_visa" },
      { label: "Not sure", next: "setup_consultation" },
    ],
  },
  visa_type: {
    id: "visa_type",
    type: "question",
    title: "Which visa service do you need?",
    subtitle: "Choose the closest option.",
    options: [
      { label: "Investor / Partner Visa", next: "visa_location" },
      { label: "Employee Visa", next: "visa_skill" },
      { label: "Visa Cancellation", next: "result_cancellation" },
      { label: "Visa Renewal", next: "result_visa_renewal" },
    ],
  },
  visa_location: {
    id: "visa_location",
    type: "question",
    title: "Is the applicant inside or outside the UAE?",
    subtitle: "This affects the process steps and possible entry permit requirements.",
    options: [
      { label: "Inside UAE", next: "result_investor_inside" },
      { label: "Outside UAE", next: "result_investor_outside" },
      { label: "Not sure", next: "visa_consultation" },
    ],
  },
  visa_skill: {
    id: "visa_skill",
    type: "question",
    title: "Is the employee applying under a skilled profession?",
    subtitle: "Some skilled visa categories may require an attested degree and Arabic legal translation.",
    options: [
      { label: "Yes, skilled profession", next: "result_employee_skilled" },
      { label: "No / standard employee visa", next: "result_employee_standard" },
      { label: "Not sure", next: "visa_consultation" },
    ],
  },
  renewal_status: {
    id: "renewal_status",
    type: "question",
    title: "What is the current license status?",
    subtitle: "Expired licenses may require urgent review due to penalties and visa impact.",
    options: [
      { label: "Still active", next: "result_renewal_active" },
      { label: "Already expired", next: "result_renewal_expired" },
      { label: "I do not know", next: "renewal_consultation" },
    ],
  },
  unclear_need: { id: "unclear_need", type: "result", title: "Recommended: Speak to an advisor first", summary: "Based on your answer, the next step is to collect basic details before suggesting the right service or pricing.", price: "Pricing to be confirmed after review", checklist: ["Passport copy", "Current license or company name, if available", "Short description of requirement"] },
  setup_consultation: { id: "setup_consultation", type: "result", title: "Recommended: Activity review required", summary: "The business activity needs to be clarified before confirming the license category and final package.", price: "Indicative setup pricing: AED XXX – AED XXX", checklist: ["Passport copy", "Preferred business activities", "Visa requirement", "Preferred company name options"] },
  result_setup_no_visa: { id: "result_setup_no_visa", type: "result", title: "Suggested Package: Company setup without visa", summary: "This is suitable if the client only needs a company license and does not require visa allocation immediately.", price: "Estimated pricing: AED XXX", checklist: ["Passport copy", "Photo", "Business activity", "Company name options"] },
  result_setup_one_visa: { id: "result_setup_one_visa", type: "result", title: "Suggested Package: Company setup with 1 visa allocation", summary: "This is suitable for founders who need the company license and one visa under the company.", price: "Estimated pricing: AED XXX", checklist: ["Passport copy", "Photo", "Business activity", "Company name options", "Visa applicant details"] },
  result_setup_multi_visa: { id: "result_setup_multi_visa", type: "result", title: "Suggested Package: Company setup with multiple visas", summary: "This is suitable where the company requires visa allocation for founders, partners, or employees.", price: "Estimated pricing: AED XXX – AED XXX", checklist: ["Passport copies", "Photos", "Business activity", "Company name options", "Number of visa allocations required"] },
  result_cancellation: { id: "result_cancellation", type: "result", title: "Service: Visa Cancellation", summary: "This service is for cancelling an existing visa under the company.", price: "Estimated pricing: AED XXX", checklist: ["Passport copy", "Visa copy", "Emirates ID copy", "Cancellation reason"] },
  result_visa_renewal: { id: "result_visa_renewal", type: "result", title: "Service: Visa Renewal", summary: "This service is for renewing an existing visa before or after expiry, subject to eligibility and file status.", price: "Estimated pricing: AED XXX", checklist: ["Passport copy", "Current visa copy", "Emirates ID copy", "Recent photo", "Medical fitness if applicable"] },
  result_investor_inside: { id: "result_investor_inside", type: "result", title: "Service: Investor / Partner Visa — Inside UAE", summary: "The applicant appears to need an investor/partner visa process while currently inside the UAE.", price: "Estimated pricing: AED XXX", checklist: ["Passport copy", "Photo", "Current visa copy", "Emirates ID copy if available", "Company documents"] },
  result_investor_outside: { id: "result_investor_outside", type: "result", title: "Service: Investor / Partner Visa — Outside UAE", summary: "The applicant appears to need entry permit and investor/partner visa processing from outside the UAE.", price: "Estimated pricing: AED XXX", checklist: ["Passport copy", "Photo", "Company documents", "Applicant contact details"] },
  result_employee_skilled: { id: "result_employee_skilled", type: "result", title: "Service: Skilled Employee Visa", summary: "This may require degree documentation depending on the profession selected and authority requirements.", price: "Estimated pricing: AED XXX", checklist: ["Passport copy", "Photo", "Current visa copy if inside UAE", "Degree certificate", "Arabic legal translation if required"] },
  result_employee_standard: { id: "result_employee_standard", type: "result", title: "Service: Standard Employee Visa", summary: "This is suitable for standard employee visa processing under the company.", price: "Estimated pricing: AED XXX", checklist: ["Passport copy", "Photo", "Current visa copy if inside UAE", "Company documents"] },
  result_renewal_active: { id: "result_renewal_active", type: "result", title: "Service: License Renewal — Active License", summary: "The renewal can likely proceed under the standard renewal workflow, subject to document review.", price: "Estimated pricing: AED XXX", checklist: ["Current license", "Shareholder passport copies", "Updated contact details", "Visa allocation requirement if any"] },
  result_renewal_expired: { id: "result_renewal_expired", type: "result", title: "Urgent Review: Expired License Renewal", summary: "Expired licenses may involve penalties, restrictions, or visa-related urgency. Immediate review is recommended.", price: "Estimated pricing: AED XXX + possible penalties", checklist: ["Current license", "Expiry date", "Shareholder passport copies", "Visa status details", "Any pending portal remarks"] },
  renewal_consultation: { id: "renewal_consultation", type: "result", title: "Recommended: Renewal status review", summary: "The license status should be checked before pricing or timelines are confirmed.", price: "Pricing to be confirmed after license review", checklist: ["Company name", "License number", "License copy if available", "Contact details"] },
  visa_consultation: { id: "visa_consultation", type: "result", title: "Recommended: Visa eligibility review", summary: "The visa category or applicant status needs to be clarified before confirming the process.", price: "Pricing to be confirmed after review", checklist: ["Passport copy", "Current visa copy if any", "Applicant location", "Company documents"] },
};

function Progress({ history }) {
  return <div className="progress">{history.map((step, index) => <span key={`${step}-${index}`} className="step-pill">Step {index + 1}</span>)}</div>;
}

export default function GuidedFlowPricingApp() {
  const [currentId, setCurrentId] = useState("start");
  const [history, setHistory] = useState(["start"]);
  const [answers, setAnswers] = useState([]);
  const current = FLOW[currentId];
  const resultCount = useMemo(() => Object.values(FLOW).filter((item) => item.type === "result").length, []);

  function choose(option) {
    setAnswers((prev) => [...prev, { question: current.title, answer: option.label }]);
    setCurrentId(option.next);
    setHistory((prev) => [...prev, option.next]);
  }
  function back() {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCurrentId(newHistory[newHistory.length - 1]);
    setAnswers((prev) => prev.slice(0, -1));
  }
  function restart() { setCurrentId("start"); setHistory(["start"]); setAnswers([]); }

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div>
            <div className="badge"><HelpCircle size={16} /> Guided Flow App Prototype</div>
            <h1>Service & Pricing Clarity Tool</h1>
            <p>A web-based flow chart style app that asks users questions and guides them to the right service, estimated pricing, and document checklist.</p>
          </div>
          <Card className="stats-card"><CardContent className="stats-content"><div className="muted">Configured outcomes</div><div className="stats-number">{resultCount}</div></CardContent></Card>
        </div>
        <div className="layout">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card><CardContent className="main-card-content">
              <Progress history={history} />
              <div className="question-block"><h2>{current.title}</h2><p>{current.subtitle || current.summary}</p></div>
              {current.type === "question" && <div className="option-grid">{current.options.map((option) => <button key={option.label} onClick={() => choose(option)} className="option-button"><span>{option.label}</span><ArrowRight size={20} /></button>)}</div>}
              {current.type === "result" && <div className="result-stack"><div className="result-box"><div className="box-label"><CircleDollarSign size={16} /> Pricing guidance</div><div className="price">{current.price}</div></div><div className="result-box"><div className="box-label"><FileText size={16} /> Required documents / next steps</div><div className="checklist">{current.checklist.map((item) => <div key={item} className="check-item"><CheckCircle2 size={20} /><span>{item}</span></div>)}</div></div></div>}
              <div className="actions"><Button variant="outline" onClick={back} disabled={history.length <= 1}><ArrowLeft size={16} /> Back</Button><Button variant="outline" onClick={restart}><RotateCcw size={16} /> Start again</Button></div>
            </CardContent></Card>
          </motion.div>
          <div className="side-stack">
            <Card><CardContent className="side-card-content"><h3>User answers</h3>{answers.length === 0 ? <p className="muted-small">Answers will appear here as the user moves through the flow.</p> : <div className="answer-list">{answers.map((item, index) => <div key={`${item.question}-${index}`} className="answer-box"><div>{item.question}</div><strong>{item.answer}</strong></div>)}</div>}</CardContent></Card>
            <Card><CardContent className="side-card-content"><h3>Admin note</h3><p className="muted-small">Pricing values are currently placeholders. In the final version, you can edit the flow questions, prices, checklist items, and outcomes from an admin panel or a connected database.</p></CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
