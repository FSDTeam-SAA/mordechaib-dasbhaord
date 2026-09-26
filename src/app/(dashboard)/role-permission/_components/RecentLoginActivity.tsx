import { loginActivity } from "./role-data";

export default function RecentLoginActivity({ query }: { query: string }) {
  const rows = loginActivity.filter(row => `${row.email} ${row.role}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="overflow-hidden rounded-lg bg-white pb-2" aria-labelledby="login-heading">
    <h2 id="login-heading" className="mx-3 border-b border-[#E9EDF8] py-3 text-base font-medium">Recent Login Activity</h2>
    <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm">
      <thead><tr className="border-b border-[#E9EDF8] text-base font-normal"><th className="px-4 py-5 font-normal">User</th><th className="px-4 py-5 text-center font-normal">Role</th><th className="px-4 py-5 text-center font-normal">Time</th><th className="px-4 py-5 text-center font-normal">Status</th></tr></thead>
      <tbody>{rows.map(row => <tr key={row.email}><td className="px-6 py-4 text-[#303650]">{row.email}</td><td className="px-4 py-4 text-center text-[#303650]">{row.role}</td><td className="px-4 py-4 text-center text-[#303650]">Jul 1, 2026 9:00 AM</td><td className="px-4 py-4 text-center"><span className="rounded-full bg-[#E3F7F0] px-2 py-1 text-[#00B985]">Success</span></td></tr>)}{!rows.length && <tr><td colSpan={4} className="py-8 text-center text-[#929AC0]">No login activity found.</td></tr>}</tbody>
    </table></div>
  </section>;
}
