// app/unauthorized/page.jsx
export default function UnauthorizedPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
      <p className="mt-2 text-muted-foreground">You do not have access to this page.</p>
    </div>
  );
}
