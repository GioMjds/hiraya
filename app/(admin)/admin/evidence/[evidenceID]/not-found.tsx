import Link from 'next/link';

export default async function NotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Link href={{ pathname: '/admin/evidence' }}>Go back to Evidence</Link>
    </div>
  );
}
