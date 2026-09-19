import Image from "next/image";
import { ChartNoAxesCombined, Blocks, Bot, ShieldCheck } from "lucide-react";
import "./auth.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="auth-page"><div className="auth-card">
    <aside className="auth-art">
      <Image src="/images/left_auth.png" alt="An AI assistant at the administration command center" fill priority sizes="(min-width: 900px) 52vw, 100vw" className="auth-art-image" />
      <div className="auth-shade" />
      <div className="auth-decor" aria-hidden="true"><i className="auth-disc"/><i className="auth-bar bar-one"/><i className="auth-bar bar-two"/><i className="auth-bar bar-three"/><i className="auth-dots dots-left"/><i className="auth-dots dots-right"/><i className="auth-orbit"/><i className="auth-sphere"/><i className="auth-rings"/><i className="auth-cross">+</i></div>
      <div className="auth-art-copy"><h2>Command.<br/><span>Control.</span><br/><em>Create Impact.</em></h2>
        <p>Welcome to the central hub where intelligence<br className="auth-desktop-break"/> meets execution.</p>
        <div className="auth-features">{[[Blocks, "Centralized Control"], [ChartNoAxesCombined, "Advanced Analytics"], [Bot, "Ai - powered Insights"], [ShieldCheck, "Enterprise Security"]].map(([Icon, label]) => { const FeatureIcon = Icon as typeof Blocks; return <div key={String(label)}><span><FeatureIcon size={13}/></span>{String(label)}</div>; })}</div>
      </div>
    </aside>
    <section className="auth-content">{children}</section>
  </div></main>;
}
