/** DM-1: route content fades in (180ms) on every navigation within the dashboard. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
