import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";

export default function DocumentActions({
  document,
}) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() =>
        window.open(
            `${apiClient.defaults.baseURL}/api/v1/employee-documents/${document.id}/download`,
            "_blank"
            )
      }
    >
      Download
    </Button>
  );
}
