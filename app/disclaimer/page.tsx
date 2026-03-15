import Link from "next/link";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#8a8578] hover:text-[#3d3a35] mb-10 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to AXUNE
        </Link>

        <h1 className="font-serif text-3xl text-[#3d3a35] mb-3">
          Health & Wellness Disclaimer
        </h1>
        <p className="text-sm text-[#8a8578] mb-10">
          Last updated: March 15, 2026
        </p>

        {/* Crisis resources - pinned at top */}
        <div className="bg-[#6b9bc3]/12 border border-[#6b9bc3]/25 rounded-2xl p-6 mb-10">
          <h2 className="font-serif text-lg text-[#3d3a35] mb-3">
            If you need immediate support
          </h2>
          <p className="text-sm text-[#5a5549] mb-4">
            If you are experiencing a mental health crisis, please reach out to
            a professional immediately.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#6b9bc3] shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#3d3a35]">988 Suicide & Crisis Lifeline</p>
                <p className="text-xs text-[#8a8578]">Call or text 988 (US) — Available 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare size={16} className="text-[#6b9bc3] shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#3d3a35]">Crisis Text Line</p>
                <p className="text-xs text-[#8a8578]">Text HOME to 741741 (US) — Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 text-[#5a5549] leading-relaxed text-sm">
          <div className="bg-white border border-[#ede9e2] rounded-2xl p-6">
            <p className="font-serif text-lg text-[#3d3a35] italic leading-relaxed">
              AXUNE is a self-care and mindfulness companion. It is a place for
              gentle reflection, not clinical treatment. Please use it as one
              part of a broader approach to your wellbeing.
            </p>
          </div>

          {[
            {
              title: "Not a Medical Device",
              content: "AXUNE is not a medical device, clinical tool, or healthcare service. It has not been reviewed or approved by any health regulatory authority (such as the FDA). The app provides tools for self-reflection and personal wellness tracking only.",
            },
            {
              title: "Not Medical Advice",
              content: "Nothing in AXUNE — including habit suggestions, journal prompts, breathing exercises, or wellness tips — constitutes medical advice. Always consult a qualified healthcare provider before making decisions about your health.",
            },
            {
              title: "Mood Tracking Is Not Diagnosis",
              content: "AXUNE's mood tracking feature is a tool for personal awareness and self-reflection only. It is not a clinical assessment, psychological evaluation, or diagnostic instrument. Tracking your mood in AXUNE does not constitute a medical diagnosis of any kind.",
            },
            {
              title: "Sleep Data Is Personal Reference",
              content: "Sleep tracking in AXUNE is based on self-reported data. It is intended for personal awareness only and is not a substitute for professional sleep studies or clinical sleep assessments. If you have concerns about sleep disorders, please consult a healthcare professional.",
            },
            {
              title: "Screen Time Management",
              content: "AXUNE's screen time tools are designed to build awareness and encourage intentional digital habits. They are not clinical interventions for digital addiction or behavioral disorders. If you are concerned about compulsive technology use, please seek professional support.",
            },
            {
              title: "Breathing Exercises",
              content: "The breathing exercises in AXUNE are gentle practices for relaxation and mindfulness. If you have respiratory conditions, heart conditions, or any health concerns that may be affected by breathing exercises, please consult your healthcare provider before using these features.",
            },
            {
              title: "Consult Your Healthcare Provider",
              content: "Always seek the advice of a qualified physician, psychologist, or other licensed healthcare professional with any questions you may have about a medical condition, mental health concern, or wellness practice. Do not disregard professional medical advice or delay seeking it because of something you have read or tracked in AXUNE.",
            },
            {
              title: "Emergency Situations",
              content: "AXUNE is not designed for use in medical emergencies. If you or someone you know is experiencing a medical or mental health emergency, call emergency services (911 in the US) immediately.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-serif text-xl text-[#3d3a35] mb-2">
                {item.title}
              </h2>
              <p>{item.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#ede9e2]">
          <div className="flex flex-wrap gap-4 text-sm text-[#8a8578]">
            <Link href="/privacy" className="hover:text-[#3d3a35] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#3d3a35] transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-[#3d3a35] transition-colors">About</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
