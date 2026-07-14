import PageHeader from '../components/PageHeader.jsx';

export default function ComingSoonPage({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <section className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-950">Coming Soon</p>
      </section>
    </>
  );
}
