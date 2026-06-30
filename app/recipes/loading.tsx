import { LoadingState } from "@/components/loading-state";

export default function RecipesLoading() {
  return (
    <section className="container-page py-12">
      <LoadingState />
    </section>
  );
}
