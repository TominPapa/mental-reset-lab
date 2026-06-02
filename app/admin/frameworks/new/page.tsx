import { Container } from "@/components/Container";
import { FrameworkForm } from "@/components/admin/FrameworkForm";
import { CATEGORY_NAMES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function NewFrameworkPage() {
  return (
    <Container size="wide" className="py-10">
      <h1 className="text-2xl font-semibold tracking-tight">New framework</h1>
      <p className="mt-2 text-sm text-muted">
        One sharp idea per card. Statement first; explanation optional.
      </p>
      <div className="mt-8">
        <FrameworkForm
          initial={{
            title: "",
            slug: "",
            statement: "",
            explanation: "",
            category: CATEGORY_NAMES[0],
            tags: [],
            status: "draft",
          }}
        />
      </div>
    </Container>
  );
}
