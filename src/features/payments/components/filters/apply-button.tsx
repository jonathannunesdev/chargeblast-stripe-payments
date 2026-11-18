import { Button } from "@/components/ui/button";

export function ApplyButton({ disabled = false }: { disabled?: boolean }) {
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={disabled}
      className="mt-3 w-full justify-center disabled:opacity-50"
    >
      Apply
    </Button>
  );
}
