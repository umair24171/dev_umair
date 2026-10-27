export default function CommercialInquiryDemo() {
  return <section className="demo-workbench" aria-label="BuildZn-built interactive workflow">
    <div className="demo-topbar"><strong>Built by BuildZn</strong><span>Fictional company and customer data</span></div>
    <p className="demo-disclosure">A configurable enquiry form, service-specific reply template, local lead tracker and Owner review screen. The follow-up question is configured per service. Nothing is detected or written by an AI model. Records stay in browser memory; no messages or external notifications are sent.</p>
    <iframe title="SparkleClean fictional enquiry and Owner approval demo" src="/demos/inquiry-workflow/index.html?mode=interactive" style={{ display: 'block', width: '100%', maxWidth: 760, aspectRatio: '1080 / 1280', border: 0, margin: '0 auto', background: '#070e1c' }}/>
  </section>;
}
