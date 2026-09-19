import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthHeading({ title, children, back = true }: { title: string; children: React.ReactNode; back?: boolean }) {
  return <>{back && <Link href="/signin" className="auth-back"><ArrowLeft size={17}/>Back to sign In</Link>}
    <header className="auth-heading"><Image src="/images/auth_logo.png" width={110} height={88} alt="Noltra.ai" priority className="auth-logo"/>
      <h1>{title}</h1><p>{children}</p>
    </header></>;
}
