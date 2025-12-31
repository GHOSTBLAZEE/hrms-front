import DocumentActions from "./DocumentActions";

export default function DocumentTable({ documents }) {
  if (!documents.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No documents uploaded
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex justify-between items-center px-4 py-2 border-b"
        >
          <div>
            <div className="font-medium">
              {doc.name}
            </div>
            <div className="text-xs text-muted-foreground">
              Uploaded on{" "}
              {new Date(
                doc.created_at
              ).toLocaleDateString()}
            </div>
          </div>

          <DocumentActions document={doc} />
        </div>
      ))}
    </div>
  );
}
