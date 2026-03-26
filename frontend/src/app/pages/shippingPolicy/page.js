import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../pages/term-and-conditions/terms.css";
import Head from "next/head";
import Link from "next/link";

const page = () => {
  return (
    <>
      <Head>
        <title>Shipping Policy | Biziffy</title>
        <meta
          name="description"
          content="Read Biziffy's privacy policy to learn how we protect your personal and business information. Your data privacy and security are our top priority."
        />
        <meta
          name="keywords"
          content="Privacy Policy, Biziffy Privacy, user data protection, business data privacy, personal information policy, GDPR, data security, cookies policy, data handling, information confidentiality, secure data, online privacy, digital safety, terms of privacy, user trust, Biziffy policy, business privacy, listing privacy, data collection policy"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Privacy Policy | Biziffy" />
        <meta
          property="og:description"
          content="Understand how Biziffy collects, uses, and protects your data. We prioritize your privacy and follow strict security protocols."
        />
        <meta property="og:url" content="https://biziffy.com/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Biziffy" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Biziffy Privacy Policy" />
        <meta
          name="twitter:description"
          content="Your trust matters. Learn how Biziffy protects your data and respects your privacy."
        />
        <meta name="twitter:creator" content="@biziffy" />
      </Head>

      <div className="py-3 terms-container">
        <div className="container">
          <h1 className="terms-heading mb-4">
            Shipping Policy for Bizi
            <span style={{ color: "var(--blue)" }}>ff</span>y
          </h1>
          <p>
            <strong>Effective Date : </strong> 08/08/2025
          </p>
          <div className="mb-4 terms-main">
            <p>
              At Biziffy.com, we offer digital services only — specifically,
              paid business and website listings. As such, we do not ship any
              physical goods.
            </p>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">No Physical Shipping </h4>
            <ul>
              <li>Our services are delivered digitally via our website.</li>
              <li>
                Upon successful payment and submission, your listing will be
                reviewed and published (24–48 hours]).
              </li>
              <li>
                You will receive confirmation and details via email once your
                listing is live..
              </li>
            </ul>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">Service Availability </h4>
            <p>
              We may disclose your personal information if we are required by
              law to do so or if you violate our Terms of Service.
            </p>
            <ul>
              <li>
                Our platform is accessible globally unless restricted by
                applicable local laws.
              </li>
              <li>
                Listings can be viewed online anytime once approved and
                published.
              </li>
            </ul>
          </div>

          <div className="mb-4 terms-main">
            <h4 className="terms-section-title text-center fw-bolder">
              Service Delivery Policy
            </h4>
            <b>1. Order Confirmation</b>
            <p>After you submit your listing and complete payment:</p>
            <ul>
              <li>You will receive a confirmation email immediately.</li>
              <li>
                Your submission will enter our moderation queue for review.
              </li>
            </ul>
          </div>
          <div className="mb-4 terms-main">
            <b>2. Processing & Approval Times</b>
            <ul>
              <li>
                Standard Listings: Reviewed and published within 1–2 business
                days.
              </li>
              <li>
                Featured Listings / Promotions: Typically live within 24 hours{" "}
              </li>
              <li>Manual Review Required May take up to 3 business days</li>
            </ul>
            <p>
              We aim for fast turnaround times, but delays can occur during
              weekends, holidays, or peak traffic periods.
            </p>
          </div>
          <div className="mb-4 terms-main">
            <b> 3. What May Cause Delays</b>
            <ul>
              <li>Incomplete or incorrect listing information</li>
              <li>
                Listings flagged for manual review (e.g., suspicious or
                restricted content)
              </li>
              <li>
                Failure to respond to verification emails or requests for
                clarification
              </li>
            </ul>
            <p>To avoid delays, double-check your content before submitting.</p>
          </div>
          <div className="mb-4 terms-main">
            <b>4. Listing Denial</b>
            <p>If your listing is rejected due to guideline violations:</p>
            <ul>
              <li>We will notify you via email with the reason</li>
              <li>You may be given the option to revise and resubmit</li>
              <li>
                Listings removed for serious violations may not be refunded (see
                Refund Policy)
              </li>
            </ul>
          </div>
          <div className="mb-4 terms-main">
            <h4 className="terms-section-title">Turnaround Time FAQ</h4>
            <b>Q: How long does it take for my listing to go live?</b>
            <p className="text-muted">
              A: Most listings go live within 1–2 business days after submission
              and payment.
            </p>
            <b>Q: I paid for a featured listing. When will it be active?</b>
            <p>
              A: Featured listings are usually reviewed and published within 24
              hours.
            </p>
            <b>Q: Will I be notified once my listing is published?</b>
            <p>
              A: Yes, you will receive an email confirmation once your listing is
              live.
            </p>
            <b>Q: Why is my listing taking longer than expected?</b>
            <p>
              A: It might need manual review, or your submission may have
              missing/inaccurate info. Check your email in case we contacted you
              for clarification.
            </p>
            <b>Q: Can I request faster processing?</b>
            <p>
              A: If you have a time-sensitive listing or promotion, contact us
              directly — we may be able to expedite it depending on
              availability.
            </p>
            <h4 className="terms-section-title">Need Help?</h4>
            <p>
              If you have not received confirmation or your listing is not live
              after the expected time:
            </p>
            <ul>
              <li>Email: support@biziffy.com</li>
              <li>Or use our contact form: www.biziffy.com</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
