export default function AwsArchitecture() {
  return (
    <div className="arch-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;500;700&family=Barlow:wght@300;400;500&display=swap');

        .arch-page {
          --arch-orange: #F4631E;
          --arch-dark: #111315;
          --arch-dark2: #1A1D20;
          --arch-dark3: #22262B;
          --arch-border: rgba(255,255,255,0.09);
          --arch-text: #E8E6E1;
          --arch-text-muted: #8A8880;
          --arch-text-dim: #555;
          background: var(--arch-dark);
          color: var(--arch-text);
          font-family: 'Barlow', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.75;
          min-height: 60vh;
        }

        .arch-header {
          border-bottom: 1px solid var(--arch-border);
          padding: 48px 32px 36px;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .arch-brand-eyebrow {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--arch-orange);
          font-weight: 500;
          margin-bottom: 6px;
        }

        .arch-brand-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 58px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .arch-brand-name span { color: var(--arch-orange); }

        .arch-brand-tagline {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--arch-text-muted);
          margin-top: 8px;
          font-weight: 400;
        }

        .arch-header-meta {
          text-align: right;
          color: var(--arch-text-muted);
          font-size: 12px;
          line-height: 1.9;
        }

        .arch-header-meta strong {
          color: var(--arch-text);
          font-weight: 500;
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .arch-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 32px 80px;
        }

        .arch-content section { margin-top: 56px; }

        .arch-section-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--arch-orange);
          font-weight: 500;
          margin-bottom: 10px;
        }

        .arch-content h2 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 30px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 24px;
        }

        .arch-content p {
          color: var(--arch-text);
          font-weight: 300;
          font-size: 15px;
          line-height: 1.8;
          max-width: 720px;
        }

        .arch-content p + p { margin-top: 16px; }

        .arch-highlight { color: #fff; font-weight: 500; }

        .arch-diagram-wrap {
          background: var(--arch-dark2);
          border: 1px solid var(--arch-border);
          border-radius: 12px;
          padding: 32px 24px;
          overflow-x: auto;
          margin-top: 8px;
        }

        .arch-diagram-legend {
          display: flex;
          gap: 28px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--arch-border);
          flex-wrap: wrap;
        }

        .arch-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: var(--arch-text-muted);
          letter-spacing: 0.08em;
        }

        .arch-legend-line {
          width: 32px;
          height: 2px;
          border-radius: 1px;
        }

        .arch-legend-line.solid  { background: #aaa; }
        .arch-legend-line.dashed { background: linear-gradient(to right, #7c6cf0 50%, transparent 50%); background-size: 8px; }
        .arch-legend-line.dotted { background: linear-gradient(to right, #5a9 50%, transparent 50%); background-size: 5px; }

        .arch-pillar-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .arch-pillar-table th {
          text-align: left;
          padding: 10px 16px;
          background: var(--arch-dark3);
          color: var(--arch-orange);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          border-bottom: 1px solid var(--arch-border);
        }

        .arch-pillar-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--arch-border);
          vertical-align: top;
          color: var(--arch-text);
          font-weight: 300;
          line-height: 1.6;
        }

        .arch-pillar-table tr:last-child td { border-bottom: none; }

        .arch-pillar-table td:first-child {
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          width: 200px;
          font-size: 13px;
        }

        .arch-pillar-table tr:hover td { background: rgba(255,255,255,0.02); }

        .arch-note {
          background: rgba(244,99,30,0.07);
          border-left: 3px solid var(--arch-orange);
          border-radius: 0 6px 6px 0;
          padding: 14px 18px;
          margin-top: 20px;
          font-size: 13.5px;
          color: var(--arch-text-muted);
          line-height: 1.65;
        }

        .arch-note strong { color: var(--arch-orange); font-weight: 500; }

        .arch-footer {
          padding: 24px 32px 40px;
          border-top: 1px solid var(--arch-border);
          font-size: 11px;
          color: var(--arch-text-dim);
          letter-spacing: 0.06em;
          max-width: 900px;
          margin: 72px auto 0;
        }
      `}</style>

      {/* ── Header ── */}
      <div className="arch-header">
        <div>
          <div className="arch-brand-eyebrow">AWS Cloud Architecture Report</div>
          <div className="arch-brand-name">STRIDE<span>LUX</span></div>
          <div className="arch-brand-tagline">Premium Footwear &amp; Performance Activewear — E-Commerce Platform</div>
        </div>
        <div className="arch-header-meta">
          <strong>Designed and Built by</strong>
          Christian Onwuanaku<br />
          Joe-Smith Essang<br />
          <strong>In fulfillment of</strong>
          Cloud Architecture and Administration (CAA) Capstone Project, Summer 2026
        </div>
      </div>

      <div className="arch-content">

        {/* ── Section 01: Diagram ── */}
        <section>
          <div className="arch-section-label">Section 01</div>
          <h2>AWS Services &amp; Traffic Flow</h2>

          <div className="arch-diagram-wrap">
            <svg width="100%" viewBox="0 0 740 540" xmlns="http://www.w3.org/2000/svg" role="img">
              <title>StrideLux AWS Architecture — End-to-End User Flow</title>
              <desc>Architecture diagram showing Route 53, CloudFront, S3, Cognito, API Gateway, Lambda, DynamoDB, SNS/SES, and CloudWatch, with optional WAF protection.</desc>

              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </marker>
              </defs>

              {/* ROW 0: USER */}
              <g>
                <rect x="300" y="18" width="140" height="44" rx="8" fill="#0d1520" stroke="#3a82d4" strokeWidth="1"/>
                <text x="370" y="36" textAnchor="middle" fill="#cce1f7" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700" letterSpacing="0.08em">USER</text>
                <text x="370" y="52" textAnchor="middle" fill="#3a82d4" fontFamily="Barlow, sans-serif" fontSize="10">Browser / Mobile App</text>
              </g>

              {/* Route 53 */}
              <g>
                <rect x="520" y="18" width="160" height="44" rx="8" fill="#0d1a2e" stroke="#3a82d4" strokeWidth="1"/>
                <text x="600" y="36" textAnchor="middle" fill="#cce1f7" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">Amazon Route 53</text>
                <text x="600" y="52" textAnchor="middle" fill="#3a82d4" fontFamily="Barlow, sans-serif" fontSize="10">DNS Resolution</text>
              </g>
              <line x1="440" y1="40" x2="520" y2="40" stroke="#3a82d4" strokeWidth="1.2" markerEnd="url(#arr)" opacity="0.9"/>
              <text x="480" y="33" textAnchor="middle" fill="#3a82d4" fontFamily="Barlow, sans-serif" fontSize="9">DNS lookup</text>

              {/* ROW 1: FRONTEND */}
              <g>
                <rect x="60" y="118" width="155" height="56" rx="8" fill="#0d1a2e" stroke="#3a82d4" strokeWidth="1"/>
                <text x="138" y="138" textAnchor="middle" fill="#cce1f7" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">Amazon CloudFront</text>
                <text x="138" y="154" textAnchor="middle" fill="#3a82d4" fontFamily="Barlow, sans-serif" fontSize="10">CDN / Edge Delivery</text>
                <text x="138" y="166" textAnchor="middle" fill="#3a82d4" fontFamily="Barlow, sans-serif" fontSize="9" opacity="0.7">Frontend Layer</text>
              </g>
              <g>
                <rect x="510" y="118" width="150" height="56" rx="8" fill="#0d1e18" stroke="#30b080" strokeWidth="1"/>
                <text x="585" y="138" textAnchor="middle" fill="#c5ede0" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">Amazon S3</text>
                <text x="585" y="154" textAnchor="middle" fill="#30b080" fontFamily="Barlow, sans-serif" fontSize="10">Static Website Hosting</text>
                <text x="585" y="166" textAnchor="middle" fill="#30b080" fontFamily="Barlow, sans-serif" fontSize="9" opacity="0.7">Frontend Layer</text>
              </g>

              {/* ROW 2: AUTH + API + COMPUTE */}
              <g>
                <rect x="20" y="238" width="150" height="56" rx="8" fill="#1a1028" stroke="#9b6fe0" strokeWidth="1"/>
                <text x="95" y="258" textAnchor="middle" fill="#e9dff8" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">Amazon Cognito</text>
                <text x="95" y="274" textAnchor="middle" fill="#9b6fe0" fontFamily="Barlow, sans-serif" fontSize="10">Authentication (JWT)</text>
                <text x="95" y="286" textAnchor="middle" fill="#9b6fe0" fontFamily="Barlow, sans-serif" fontSize="9" opacity="0.7">Auth Layer</text>
              </g>
              <g>
                <rect x="288" y="238" width="168" height="56" rx="8" fill="#0d1a2e" stroke="#3a82d4" strokeWidth="1"/>
                <text x="372" y="258" textAnchor="middle" fill="#cce1f7" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">API Gateway</text>
                <text x="372" y="274" textAnchor="middle" fill="#3a82d4" fontFamily="Barlow, sans-serif" fontSize="10">REST API Endpoint</text>
                <text x="372" y="286" textAnchor="middle" fill="#3a82d4" fontFamily="Barlow, sans-serif" fontSize="9" opacity="0.7">API Layer</text>
              </g>
              <g>
                <rect x="548" y="238" width="155" height="56" rx="8" fill="#22180a" stroke="#f0a030" strokeWidth="1"/>
                <text x="626" y="258" textAnchor="middle" fill="#fdeac8" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">AWS Lambda</text>
                <text x="626" y="274" textAnchor="middle" fill="#f0a030" fontFamily="Barlow, sans-serif" fontSize="10">Serverless Backend</text>
                <text x="626" y="286" textAnchor="middle" fill="#f0a030" fontFamily="Barlow, sans-serif" fontSize="9" opacity="0.7">Compute Layer</text>
              </g>

              {/* ROW 3: DATA + NOTIFY + MONITOR */}
              <g>
                <rect x="20" y="388" width="155" height="56" rx="8" fill="#220e0e" stroke="#e07070" strokeWidth="1"/>
                <text x="98" y="408" textAnchor="middle" fill="#f8dcdc" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">Amazon SNS / SES</text>
                <text x="98" y="424" textAnchor="middle" fill="#e07070" fontFamily="Barlow, sans-serif" fontSize="10">Email &amp; SMS Alerts</text>
                <text x="98" y="436" textAnchor="middle" fill="#e07070" fontFamily="Barlow, sans-serif" fontSize="9" opacity="0.7">Notifications</text>
              </g>
              <g>
                <rect x="288" y="388" width="168" height="56" rx="8" fill="#0d1e18" stroke="#30b080" strokeWidth="1"/>
                <text x="372" y="408" textAnchor="middle" fill="#c5ede0" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">Amazon DynamoDB</text>
                <text x="372" y="424" textAnchor="middle" fill="#30b080" fontFamily="Barlow, sans-serif" fontSize="10">Products, Orders, Cart</text>
                <text x="372" y="436" textAnchor="middle" fill="#30b080" fontFamily="Barlow, sans-serif" fontSize="9" opacity="0.7">Database Layer</text>
              </g>
              <g>
                <rect x="558" y="388" width="155" height="56" rx="8" fill="#131620" stroke="#6878a0" strokeWidth="1"/>
                <text x="636" y="408" textAnchor="middle" fill="#d8dce8" fontFamily="Barlow Condensed, sans-serif" fontSize="13" fontWeight="700">Amazon CloudWatch</text>
                <text x="636" y="424" textAnchor="middle" fill="#6878a0" fontFamily="Barlow, sans-serif" fontSize="10">Logs &amp; Monitoring</text>
                <text x="636" y="436" textAnchor="middle" fill="#6878a0" fontFamily="Barlow, sans-serif" fontSize="9" opacity="0.7">Observability Layer</text>
              </g>

              {/* OPTIONAL */}
              <text x="20" y="480" fontFamily="Barlow, sans-serif" fontSize="9" fill="#F4631E" letterSpacing="0.14em">OPTIONAL (COST-DEPENDENT)</text>
              <g opacity="0.55">
                <rect x="20" y="490" width="130" height="40" rx="6" fill="none" stroke="#F4631E" strokeWidth="1" strokeDasharray="5 3"/>
                <text x="85" y="508" textAnchor="middle" fill="#F4631E" fontFamily="Barlow Condensed, sans-serif" fontSize="12" fontWeight="700">AWS WAF</text>
                <text x="85" y="522" textAnchor="middle" fill="#F4631E" fontFamily="Barlow, sans-serif" fontSize="9">Web App Firewall</text>
              </g>

              {/* ARROWS */}
              <path d="M370,62 L370,96 L138,96 L138,118" fill="none" stroke="#4a90c8" strokeWidth="1.2" markerEnd="url(#arr)" opacity="0.9"/>
              <line x1="215" y1="146" x2="510" y2="146" stroke="#4a90c8" strokeWidth="1.2" markerEnd="url(#arr)" opacity="0.8"/>
              <text x="362" y="141" textAnchor="middle" fill="#4a90c8" fontFamily="Barlow, sans-serif" fontSize="9">website files</text>
              <path d="M138,174 L138,210 L372,210 L372,238" fill="none" stroke="#4a90c8" strokeWidth="1.2" markerEnd="url(#arr)" opacity="0.9"/>
              <line x1="170" y1="266" x2="288" y2="266" stroke="#9b6fe0" strokeWidth="1.2" strokeDasharray="6 3" markerEnd="url(#arr)" opacity="0.9"/>
              <text x="229" y="261" textAnchor="middle" fill="#9b6fe0" fontFamily="Barlow, sans-serif" fontSize="9">JWT token</text>
              <line x1="456" y1="266" x2="548" y2="266" stroke="#f0a030" strokeWidth="1.5" markerEnd="url(#arr)" opacity="0.9"/>
              <text x="502" y="261" textAnchor="middle" fill="#f0a030" fontFamily="Barlow, sans-serif" fontSize="9">triggers</text>
              <path d="M626,294 L626,355 L372,355 L372,388" fill="none" stroke="#30b080" strokeWidth="1.2" markerEnd="url(#arr)" opacity="0.9"/>
              <path d="M600,294 L600,365 L98,365 L98,388" fill="none" stroke="#e07070" strokeWidth="1.2" markerEnd="url(#arr)" opacity="0.9"/>
              <path d="M703,266 L718,266 L718,416 L713,416" fill="none" stroke="#6878a0" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arr)" opacity="0.8"/>
              <line x1="456" y1="416" x2="558" y2="416" stroke="#6878a0" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arr)" opacity="0.8"/>
              <path d="M304,50 L95,50 L95,238" fill="none" stroke="#9b6fe0" strokeWidth="1.1" strokeDasharray="6 3" markerEnd="url(#arr)" opacity="0.75"/>
              <text x="190" y="45" textAnchor="middle" fill="#9b6fe0" fontFamily="Barlow, sans-serif" fontSize="9">sign up / login</text>
            </svg>

            <div className="arch-diagram-legend">
              <div className="arch-legend-item">
                <div className="arch-legend-line solid"></div>
                User / Application Flow
              </div>
              <div className="arch-legend-item">
                <div className="arch-legend-line dashed"></div>
                Auth Flow (JWT)
              </div>
              <div className="arch-legend-item">
                <div className="arch-legend-line dotted"></div>
                Logs / Monitoring Flow
              </div>
              <div className="arch-legend-item" style={{ marginLeft: 'auto', color: '#F4631E', fontSize: '11px' }}>
                ⬡ Dashed border = optional service
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 02: Front-End Architecture ── */}
        <section>
          <div className="arch-section-label">Section 02</div>
          <h2>Front-End Architecture</h2>
          <p>
            StrideLux is a premium online store specialising in exclusive sports footwear and performance activewear —
            limited-edition sneakers, running shoes, training apparel, and curated accessories from elite global brands.
            The front-end is built as a single-page application using <strong className="arch-highlight">React.js</strong>,
            styled with <strong className="arch-highlight">CSS custom properties</strong> for a consistent, themeable design system,
            and bundled with <strong className="arch-highlight">Create React App</strong> for fast production builds.
            The compiled static assets — HTML, CSS, and JavaScript bundles — are hosted in an{' '}
            <strong className="arch-highlight">Amazon S3 bucket</strong> with static website hosting enabled,
            and delivered globally through <strong className="arch-highlight">Amazon CloudFront</strong>, which acts
            as the content delivery network (CDN). CloudFront caches assets at over 400 edge locations worldwide,
            giving every shopper — whether in Lagos, London, or Los Angeles — fast load times regardless of their distance
            from the origin server. Key pages include a product catalogue with filter and search, individual product detail pages
            with size guides, a shopping cart, a checkout flow integrated with Stripe for test payments, and a user account
            dashboard showing past orders and saved items.
          </p>
        </section>

        {/* ── Section 03: Why These AWS Services ── */}
        <section>
          <div className="arch-section-label">Section 03</div>
          <h2>Why These AWS Services</h2>
          <p>
            The service choices are driven by three goals: minimise operational overhead, pay only for what is used,
            and scale automatically with demand. <strong className="arch-highlight">Amazon Route 53</strong> resolves
            the storefront's custom domain and runs health checks against the origin, so DNS only ever points traffic at a
            healthy endpoint. <strong className="arch-highlight">Amazon CloudFront</strong> was selected because it reduces
            latency for a geographically distributed customer base and provides built-in DDoS protection at the edge at no
            extra cost. <strong className="arch-highlight">Amazon S3</strong> is the simplest and most cost-efficient place
            to store and serve static website files, with 99.999999999% durability and no server management needed.{' '}
            <strong className="arch-highlight">Amazon Cognito</strong> handles user sign-up, login, password recovery, and
            JWT token issuance out of the box, removing the need to build and maintain a custom authentication system.{' '}
            <strong className="arch-highlight">Amazon API Gateway</strong> acts as the secure front door to the backend,
            enforcing JWT validation on every request before traffic ever reaches compute resources.{' '}
            <strong className="arch-highlight">AWS Lambda</strong> is chosen for the backend because it is serverless —
            there are no EC2 instances to provision or patch, and billing is per request rather than per hour, making it
            ideal for a startup or mid-size e-commerce platform with variable traffic.{' '}
            <strong className="arch-highlight">Amazon DynamoDB</strong> provides single-digit millisecond reads for product
            catalogue lookups and cart operations, with on-demand capacity that scales automatically without prior planning.{' '}
            <strong className="arch-highlight">Amazon SNS and SES</strong> send order confirmation emails and SMS shipping
            updates reliably without managing mail infrastructure. Finally,{' '}
            <strong className="arch-highlight">Amazon CloudWatch</strong> centralises logs and metrics from Lambda, API
            Gateway, and DynamoDB, giving the operations team full visibility into errors, latency, and usage trends.
          </p>

          <div className="arch-note">
            <strong>AWS WAF — Optional Augmentation: </strong>
            AWS WAF (Web Application Firewall) can be attached to CloudFront to block SQL injection, cross-site scripting,
            and bot traffic at the edge. It adds cost — approximately $5/month plus per-request charges. A cost-benefit
            analysis is recommended before enabling it; for the current stage of deployment, CloudFront's built-in
            protections may be sufficient.
          </div>
        </section>

        {/* ── Section 04: Well-Architected Framework ── */}
        <section>
          <div className="arch-section-label">Section 04</div>
          <h2>AWS Well-Architected Framework Alignment</h2>
          <p>
            The StrideLux platform is designed to align with all six pillars of the AWS Well-Architected Framework.
            The table below maps each pillar to a concrete design decision in the architecture.
          </p>

          <table className="arch-pillar-table" style={{ marginTop: '24px' }}>
            <thead>
              <tr>
                <th>Pillar</th>
                <th>How StrideLux Aligns</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Operational Excellence</td>
                <td>CloudWatch collects logs and metrics from Lambda, API Gateway, and DynamoDB in one place. Alarms can trigger automated responses, reducing manual intervention and giving the team clear visibility into system health at all times.</td>
              </tr>
              <tr>
                <td>Security</td>
                <td>Cognito authenticates every user and issues short-lived JWT tokens. API Gateway validates those tokens before any backend function runs. CloudFront adds edge-level DDoS protection, and optional WAF rules block known attack patterns. Data in DynamoDB and S3 is encrypted at rest by default.</td>
              </tr>
              <tr>
                <td>Reliability</td>
                <td>Route 53 health checks continuously verify the origin is reachable and can fail over DNS if it isn't. Lambda and DynamoDB are fully managed and inherently multi-AZ, meaning they continue running even if an AWS availability zone fails. CloudFront serves cached content from the nearest edge even during brief origin disruptions.</td>
              </tr>
              <tr>
                <td>Performance Efficiency</td>
                <td>CloudFront caches static assets close to end users, cutting load times dramatically. DynamoDB delivers single-digit millisecond reads for product and cart data. Lambda cold starts are mitigated by keeping functions small and using provisioned concurrency for critical paths such as checkout.</td>
              </tr>
              <tr>
                <td>Cost Optimisation</td>
                <td>The entire backend is pay-per-use — Lambda charges per request, DynamoDB on-demand charges per read/write, and API Gateway charges per API call. There are no idle servers. S3 storage for static files costs cents per gigabyte per month, and SNS/SES pricing is per message sent.</td>
              </tr>
              <tr>
                <td>Sustainability</td>
                <td>Serverless compute (Lambda) and managed services (DynamoDB, S3) run on AWS's shared infrastructure, which is far more energy-efficient than dedicated servers sitting idle. Scaling down automatically during off-peak hours reduces energy use without any manual action.</td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>

      <div className="arch-footer">
        StrideLux — AWS Cloud Architecture Report &nbsp;|&nbsp; Confidential &nbsp;|&nbsp;
        Architecture based on E-Commerce Demo Platform design &nbsp;|&nbsp; Summer 2026
      </div>
    </div>
  );
}
